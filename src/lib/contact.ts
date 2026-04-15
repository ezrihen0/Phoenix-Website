import "server-only";

import nodemailer from "nodemailer";
import { z } from "zod";

import { getSiteSettings, saveLead } from "@/lib/cms/storage";
import { CONTACT_FORM_RECAPTCHA_ACTION, DEFAULT_RECAPTCHA_MIN_SCORE } from "@/lib/recaptcha";
import type { LeadDeliveryStatus } from "@/lib/cms/types";

export const contactRequestSchema = z.object({
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

export type LeadDispatchResult = {
  ok: boolean;
  message: string;
  leadId?: string;
  bookingDeliveryStatus: LeadDeliveryStatus;
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
        message: "We could not verify your submission. Please call or use online booking if the form keeps failing.",
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

function buildWorkizPayload(payload: ContactRequest) {
  return {
    firstName: payload.firstName,
    lastName: payload.lastName,
    phone: payload.phone,
    email: payload.email,
    service: payload.service,
    preferredDay: payload.preferredDay,
    preferredTime: payload.preferredTime,
    message: payload.message,
    source: "website",
  };
}

async function dispatchToWorkiz(payload: ContactRequest) {
  const endpoint = process.env.WORKIZ_LEAD_ENDPOINT;
  const token = process.env.WORKIZ_API_TOKEN;

  if (!endpoint || !token) {
    return null;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(buildWorkizPayload(payload)),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Workiz lead dispatch failed with status ${response.status}: ${errorText}`,
    );
  }

  return response;
}

async function sendNotificationEmail(payload: ContactRequest): Promise<DeliveryResult> {
  const settings = await getSiteSettings();

  if (!settings.sendLeadEmails) {
    return {
      status: "skipped",
      note: "Lead email notifications are turned off.",
    };
  }

  const recipient = (settings.notificationEmail || settings.sendingEmail || settings.email).trim();
  const sender = (settings.sendingEmail || settings.email).trim();
  const appPassword = settings.googleAppPassword.trim();

  if (!recipient || !sender || !appPassword) {
    return {
      status: "failed",
      note: "Lead email delivery is enabled, but the sender, recipient, or app password is missing.",
    };
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: sender,
      pass: appPassword,
    },
  });

  const subject = `New fireplace lead: ${payload.firstName} ${payload.lastName}`;
  const lines = [
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

  try {
    await transporter.sendMail({
      from: `Phoenix website leads <${sender}>`,
      to: recipient,
      replyTo: payload.email,
      subject,
      text: lines.join("\n"),
      html: `
        <h2>${subject}</h2>
        <p><strong>Name:</strong> ${payload.firstName} ${payload.lastName}</p>
        <p><strong>Phone:</strong> ${payload.phone}</p>
        <p><strong>Email:</strong> ${payload.email}</p>
        <p><strong>Service:</strong> ${payload.service}</p>
        <p><strong>Preferred day:</strong> ${normalizeOptional(payload.preferredDay) || "Not provided"}</p>
        <p><strong>Preferred time:</strong> ${normalizeOptional(payload.preferredTime) || "Not provided"}</p>
        <p><strong>Message:</strong></p>
        <p>${payload.message.replace(/\n/g, "<br />")}</p>
      `,
    });

    return {
      status: "sent",
      note: `Lead email sent to ${recipient}.`,
    };
  } catch (error) {
    console.error("[lead-email] Failed to send notification", error);

    return {
      status: "failed",
      note: error instanceof Error ? error.message : "Unknown email delivery error.",
    };
  }
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
      bookingDeliveryStatus: "skipped",
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
      bookingDeliveryStatus: "skipped",
      emailDeliveryStatus: "skipped",
    };
  }

  let bookingDelivery: DeliveryResult = {
    status: "skipped",
    note: "Online booking sync is not configured.",
  };

  try {
    const workizResponse = await dispatchToWorkiz(payload);

    if (workizResponse) {
      bookingDelivery = {
        status: "sent",
        note: "Lead synced to the booking system.",
      };
    }
  } catch (error) {
    console.error("[lead-booking-sync] Failed to sync lead", error);
    bookingDelivery = {
      status: "failed",
      note: error instanceof Error ? error.message : "Unknown booking sync error.",
    };
  }

  const emailDelivery = await sendNotificationEmail(payload);
  const createdAt = new Date().toISOString();
  const leadId = crypto.randomUUID();

  await saveLead({
    id: leadId,
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
    bookingDeliveryStatus: bookingDelivery.status,
    bookingDeliveryNote: bookingDelivery.note,
    emailDeliveryStatus: emailDelivery.status,
    emailDeliveryNote: emailDelivery.note,
  });

  return {
    ok: true,
    message: "Thanks. Your request has been received.",
    leadId,
    bookingDeliveryStatus: bookingDelivery.status,
    emailDeliveryStatus: emailDelivery.status,
  };
}