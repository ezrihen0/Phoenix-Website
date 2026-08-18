import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { CITY_SLUGS, defaultCitySlug, getCityBySlug } from "@/lib/cities";
import { getSiteSettings, saveLead } from "@/lib/cms/storage";
import type { Lead, LeadDeliveryStatus } from "@/lib/cms/types";
import { sendLeadNotificationEmail } from "@/lib/email/lead-notifications";
import { CONTACT_FORM_RECAPTCHA_ACTION, DEFAULT_RECAPTCHA_MIN_SCORE } from "@/lib/recaptcha";
import {
  SERVICE_REQUEST_CONTACT_METHODS,
  SERVICE_REQUEST_TITLES,
  SERVICE_REQUEST_URGENCY_OPTIONS,
  CANADIAN_PROVINCE_CODES,
  formatServiceAddress,
  formatServiceAddressLines,
  normalizeServiceAddressParts,
} from "@/lib/request-service";

export const contactRequestSchema = z.object({
  city: z.enum(CITY_SLUGS).optional().default(defaultCitySlug),
  firstName: z.string().trim().min(2, "First name is required."),
  lastName: z.string().trim().min(2, "Last name is required."),
  phone: z.string().trim().min(10, "Phone number is required."),
  email: z.string().trim().email("Enter a valid email address."),
  service: z.string().trim().min(2, "Select a service."),
  preferredDay: z.string().trim().optional(),
  preferredTime: z.string().trim().optional(),
  message: z.string().trim().min(10, "Tell us what is happening."),
  honey: z.string().max(0).optional().default(""),
  recaptchaToken: z.string().trim().optional().default(""),
});

export type ContactRequest = z.infer<typeof contactRequestSchema>;

const serviceRequestTitleSchema = z.enum(
  SERVICE_REQUEST_TITLES as [string, ...string[]],
);

export const serviceRequestSchema = z.object({
  city: z.enum(CITY_SLUGS).optional().default(defaultCitySlug),
  firstName: z.string().trim().min(2, "First name is required."),
  lastName: z.string().trim().min(2, "Last name is required."),
  phone: z.string().trim().min(10, "Phone number is required."),
  email: z.string().trim().email("Enter a valid email address."),
  service: serviceRequestTitleSchema,
  message: z.string().trim().min(10, "Tell us what is happening."),
  urgency: z.enum(SERVICE_REQUEST_URGENCY_OPTIONS),
  urgencyDetail: z.string().trim().min(2, "Choose a timing option."),
  preferredDay: z.string().trim().optional(),
  preferredTime: z.string().trim().optional(),
  addressStreet: z.string().trim().min(3, "Street address is required."),
  addressCity: z.string().trim().min(2, "City is required."),
  addressProvince: z.enum(CANADIAN_PROVINCE_CODES as [string, ...string[]], {
    message: "Province is required.",
  }),
  addressPostalCode: z.string().trim().min(6, "Postal code is required."),
  address: z.string().trim().optional(),
  preferredContactMethod: z.enum(SERVICE_REQUEST_CONTACT_METHODS).optional().default("Phone"),
  sourceUrl: z.string().trim().optional(),
  utmSource: z.string().trim().optional(),
  utmMedium: z.string().trim().optional(),
  utmCampaign: z.string().trim().optional(),
  honey: z.string().max(0).optional().default(""),
  recaptchaToken: z.string().trim().optional().default(""),
});

export type ServiceRequest = z.infer<typeof serviceRequestSchema>;

export type LeadDispatchResult = {
  ok: boolean;
  message: string;
  leadId?: string;
  emailDeliveryStatus: LeadDeliveryStatus;
};

type DeliveryResult = {
  status: LeadDeliveryStatus;
  note?: string;
};

type RecaptchaVerificationResult = {
  ok: boolean;
  message?: string;
};

function normalizeOptional(value?: string) {
  return value?.trim() ? value.trim() : undefined;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getRecaptchaMinScore() {
  const parsed = Number.parseFloat(process.env.RECAPTCHA_MIN_SCORE || "");

  if (!Number.isFinite(parsed)) {
    return DEFAULT_RECAPTCHA_MIN_SCORE;
  }

  return Math.min(1, Math.max(0, parsed));
}

async function verifyRecaptchaToken(
  token: string | undefined,
  remoteIp?: string,
): Promise<RecaptchaVerificationResult> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY?.trim();
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim();

  if (!secretKey || !siteKey) {
    return { ok: true };
  }

  if (!token) {
    return {
      ok: false,
      message: "We could not verify your submission. Please try again.",
    };
  }

  const formData = new URLSearchParams({
    secret: secretKey,
    response: token,
  });

  if (remoteIp) {
    formData.set("remoteip", remoteIp);
  }

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        ok: false,
        message: "We could not verify your submission right now. Please try again.",
      };
    }

    const result = (await response.json()) as {
      success?: boolean;
      score?: number;
      action?: string;
      hostname?: string;
      [key: string]: unknown;
    };

    if (!result.success) {
      return {
        ok: false,
        message: "We could not verify your submission. Please try again.",
      };
    }

    if (result.action !== CONTACT_FORM_RECAPTCHA_ACTION) {
      return {
        ok: false,
        message: "We could not verify your submission. Please refresh the page and try again.",
      };
    }

    if (typeof result.score === "number" && result.score < getRecaptchaMinScore()) {
      return {
        ok: false,
        message: "We could not verify your submission. Please call the office if the form keeps failing.",
      };
    }

    return { ok: true };
  } catch (error) {
    console.error("[recaptcha] Verification failed", error);

    return {
      ok: false,
      message: "We could not verify your submission right now. Please try again.",
    };
  }
}

async function sendNotificationEmail(payload: ContactRequest): Promise<DeliveryResult> {
  const settings = await getSiteSettings();
  const city = getCityBySlug(payload.city) || getCityBySlug(defaultCitySlug);

  const subject = `New ${city?.name || "website"} fireplace lead: ${payload.firstName} ${payload.lastName}`;
  const lines = [
    `City: ${city?.name || "Unknown"}`,
    `Name: ${payload.firstName} ${payload.lastName}`,
    `Phone: ${payload.phone}`,
    `Email: ${payload.email}`,
    `Service: ${payload.service}`,
    `Preferred day: ${normalizeOptional(payload.preferredDay) || "Not provided"}`,
    `Preferred time: ${normalizeOptional(payload.preferredTime) || "Not provided"}`,
    "",
    "Message:",
    payload.message,
  ];

  return sendLeadNotificationEmail(settings, {
    subject,
    text: lines.join("\n"),
    html: `
        <h2>${escapeHtml(subject)}</h2>
        <p><strong>City:</strong> ${escapeHtml(city?.name || "Unknown")}</p>
        <p><strong>Name:</strong> ${escapeHtml(payload.firstName)} ${escapeHtml(payload.lastName)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(payload.phone)}</p>
        <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
        <p><strong>Service:</strong> ${escapeHtml(payload.service)}</p>
        <p><strong>Preferred day:</strong> ${escapeHtml(normalizeOptional(payload.preferredDay) || "Not provided")}</p>
        <p><strong>Preferred time:</strong> ${escapeHtml(normalizeOptional(payload.preferredTime) || "Not provided")}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(payload.message).replace(/\n/g, "<br />")}</p>
      `,
    replyTo: payload.email,
  });
}

export async function routeLeadSubmission(
  rawPayload: unknown,
  options?: { remoteIp?: string },
): Promise<LeadDispatchResult> {
  const parsed = contactRequestSchema.safeParse(rawPayload);

  if (!parsed.success) {
    throw parsed.error;
  }

  const payload = parsed.data;

  if (payload.honey) {
    return {
      ok: true,
      message: "Submission received.",
      emailDeliveryStatus: "skipped",
    };
  }

  const recaptchaVerification = await verifyRecaptchaToken(
    payload.recaptchaToken,
    options?.remoteIp,
  );

  if (!recaptchaVerification.ok) {
    return {
      ok: false,
      message: recaptchaVerification.message || "We could not verify your submission. Please try again.",
      emailDeliveryStatus: "skipped",
    };
  }

  const createdAt = new Date().toISOString();
  const leadId = crypto.randomUUID();
  const city = getCityBySlug(payload.city) || getCityBySlug(defaultCitySlug);

  const leadRecord: Lead = {
    id: leadId,
    city: city?.slug || defaultCitySlug,
    source: "contact-form",
    firstName: payload.firstName,
    lastName: payload.lastName,
    phone: payload.phone,
    email: payload.email,
    service: payload.service,
    preferredDay: normalizeOptional(payload.preferredDay),
    preferredTime: normalizeOptional(payload.preferredTime),
    message: payload.message,
    createdAt,
    disposition: "pending",
    emailDeliveryStatus: "skipped",
    emailDeliveryNote: "Notification pending.",
  };

  await saveLead(leadRecord);
  console.info("[lead-inbox] saved", {
    leadId,
    source: leadRecord.source,
    city: leadRecord.city,
  });
  revalidatePath("/admin/leads");

  let emailDelivery: DeliveryResult = {
    status: "failed",
    note: "Lead was saved, but the notification email did not run.",
  };

  try {
    emailDelivery = await sendNotificationEmail(payload);
  } catch (error) {
    console.error("[lead-email] Contact-form notification failed after save", error);
    emailDelivery = {
      status: "failed",
      note: error instanceof Error ? error.message : "Unknown email delivery error.",
    };
  }

  try {
    await saveLead({
      ...leadRecord,
      emailDeliveryStatus: emailDelivery.status,
      emailDeliveryNote: emailDelivery.note,
    });
  } catch (error) {
    console.error("[lead-email] Lead was saved, but email status could not be updated", error);
  }

  return {
    ok: true,
    message: `Thanks. Your ${city?.name || "service"} request has been received.`,
    leadId,
    emailDeliveryStatus: emailDelivery.status,
  };
}

async function sendWebsiteLeadEmail(
  payload: ServiceRequest,
  leadId: string,
): Promise<DeliveryResult> {
  const settings = await getSiteSettings();
  const city = getCityBySlug(payload.city) || getCityBySlug(defaultCitySlug);
  const customerName = `${payload.firstName} ${payload.lastName}`;
  const subject = `[Phoenix Website Lead] ${city?.name || "Website"} | ${payload.service} | ${customerName}`;
  const adminLeadsUrl = `${settings.siteUrl.replace(/\/$/, "")}/admin/leads`;
  const addressLines = formatServiceAddressLines(payload);
  const formattedAddress = formatServiceAddress(payload) || "Not provided";
  const addressHtml = addressLines.length
    ? addressLines
        .map((line) => {
          const separatorIndex = line.indexOf(": ");
          const label = separatorIndex >= 0 ? line.slice(0, separatorIndex) : "Address";
          const value = separatorIndex >= 0 ? line.slice(separatorIndex + 2) : line;

          return `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`;
        })
        .join("")
    : `<p><strong>Address:</strong> Not provided</p>`;
  const lines = [
    `Lead ID: ${leadId}`,
    `Admin inbox: ${adminLeadsUrl}`,
    `City: ${city?.name || "Unknown"}`,
    `Source: Website`,
    `Name: ${customerName}`,
    `Phone: ${payload.phone}`,
    `Email: ${payload.email}`,
    `Preferred contact: ${payload.preferredContactMethod || "Phone"}`,
    `Service: ${payload.service}`,
    `Urgency: ${payload.urgency}`,
    `Timing: ${payload.urgencyDetail}`,
    ...(addressLines.length ? addressLines : [`Address: ${formattedAddress}`]),
    `Preferred day: ${normalizeOptional(payload.preferredDay) || payload.urgencyDetail}`,
    `Preferred time: ${normalizeOptional(payload.preferredTime) || "Not provided"}`,
    `Page: ${normalizeOptional(payload.sourceUrl) || "Not provided"}`,
    `UTM source: ${normalizeOptional(payload.utmSource) || "Not provided"}`,
    `UTM medium: ${normalizeOptional(payload.utmMedium) || "Not provided"}`,
    `UTM campaign: ${normalizeOptional(payload.utmCampaign) || "Not provided"}`,
    "",
    "What is happening:",
    payload.message,
  ];

  return sendLeadNotificationEmail(settings, {
    subject,
    text: lines.join("\n"),
    html: `
        <h2>${escapeHtml(subject)}</h2>
        <p><strong>Lead ID:</strong> ${escapeHtml(leadId)}</p>
        <p><strong>Admin inbox:</strong> <a href="${escapeHtml(adminLeadsUrl)}">${escapeHtml(adminLeadsUrl)}</a></p>
        <p><strong>City:</strong> ${escapeHtml(city?.name || "Unknown")}</p>
        <p><strong>Source:</strong> Website</p>
        <p><strong>Name:</strong> ${escapeHtml(customerName)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(payload.phone)}</p>
        <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
        <p><strong>Preferred contact:</strong> ${escapeHtml(payload.preferredContactMethod || "Phone")}</p>
        <p><strong>Service:</strong> ${escapeHtml(payload.service)}</p>
        <p><strong>Urgency:</strong> ${escapeHtml(payload.urgency)}</p>
        <p><strong>Timing:</strong> ${escapeHtml(payload.urgencyDetail)}</p>
        ${addressHtml}
        <p><strong>Preferred day:</strong> ${escapeHtml(normalizeOptional(payload.preferredDay) || payload.urgencyDetail)}</p>
        <p><strong>Preferred time:</strong> ${escapeHtml(normalizeOptional(payload.preferredTime) || "Not provided")}</p>
        <p><strong>Page:</strong> ${escapeHtml(normalizeOptional(payload.sourceUrl) || "Not provided")}</p>
        <p><strong>What is happening:</strong></p>
        <p>${escapeHtml(payload.message).replace(/\n/g, "<br />")}</p>
      `,
    replyTo: payload.email,
  });
}

export async function routeServiceRequestSubmission(
  rawPayload: unknown,
  options?: { remoteIp?: string },
): Promise<LeadDispatchResult> {
  const parsed = serviceRequestSchema.safeParse(rawPayload);

  if (!parsed.success) {
    throw parsed.error;
  }

  const payload = parsed.data;

  if (payload.honey) {
    return {
      ok: true,
      message: "Request received. Phoenix will review your request and contact you with the next step.",
      emailDeliveryStatus: "skipped",
    };
  }

  const recaptchaVerification = await verifyRecaptchaToken(
    payload.recaptchaToken,
    options?.remoteIp,
  );

  if (!recaptchaVerification.ok) {
    return {
      ok: false,
      message: recaptchaVerification.message || "We could not verify your submission. Please try again.",
      emailDeliveryStatus: "skipped",
    };
  }

  const createdAt = new Date().toISOString();
  const leadId = crypto.randomUUID();
  const city = getCityBySlug(payload.city) || getCityBySlug(defaultCitySlug);
  const addressParts = normalizeServiceAddressParts(payload);

  const leadRecord: Lead = {
    id: leadId,
    city: city?.slug || defaultCitySlug,
    source: "website",
    firstName: payload.firstName,
    lastName: payload.lastName,
    phone: payload.phone,
    email: payload.email,
    service: payload.service,
    preferredDay: normalizeOptional(payload.preferredDay) || payload.urgencyDetail,
    preferredTime: normalizeOptional(payload.preferredTime),
    message: payload.message,
    addressStreet: addressParts.addressStreet,
    addressCity: addressParts.addressCity,
    addressProvince: addressParts.addressProvince,
    addressPostalCode: addressParts.addressPostalCode,
    address: formatServiceAddress(payload),
    urgency: payload.urgency,
    urgencyDetail: payload.urgencyDetail,
    preferredContactMethod: payload.preferredContactMethod,
    sourceUrl: normalizeOptional(payload.sourceUrl),
    utmSource: normalizeOptional(payload.utmSource),
    utmMedium: normalizeOptional(payload.utmMedium),
    utmCampaign: normalizeOptional(payload.utmCampaign),
    createdAt,
    disposition: "pending",
    emailDeliveryStatus: "skipped",
    emailDeliveryNote: "Notification pending.",
  };

  await saveLead(leadRecord);
  console.info("[lead-inbox] saved", {
    leadId,
    source: leadRecord.source,
    city: leadRecord.city,
  });
  revalidatePath("/admin/leads");

  let emailDelivery: DeliveryResult = {
    status: "failed",
    note: "Lead was saved, but the notification email did not run.",
  };

  try {
    emailDelivery = await sendWebsiteLeadEmail(payload, leadId);
  } catch (error) {
    console.error("[lead-email] Website request notification failed after save", error);
    emailDelivery = {
      status: "failed",
      note: error instanceof Error ? error.message : "Unknown email delivery error.",
    };
  }

  try {
    await saveLead({
      ...leadRecord,
      emailDeliveryStatus: emailDelivery.status,
      emailDeliveryNote: emailDelivery.note,
    });
  } catch (error) {
    console.error("[lead-email] Lead was saved, but email status could not be updated", error);
  }

  return {
    ok: true,
    message: "Request received. Phoenix will review your request and contact you with the next step.",
    leadId,
    emailDeliveryStatus: emailDelivery.status,
  };
}