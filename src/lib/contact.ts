import { z } from "zod";

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
});

export type ContactRequest = z.infer<typeof contactRequestSchema>;

export type LeadDispatchResult = {
  ok: boolean;
  mode: "workiz" | "demo" | "unconfigured";
  message: string;
};

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

export async function routeLeadSubmission(
  rawPayload: unknown,
): Promise<LeadDispatchResult> {
  const parsed = contactRequestSchema.safeParse(rawPayload);

  if (!parsed.success) {
    throw parsed.error;
  }

  const payload = parsed.data;

  if (payload.honey) {
    return {
      ok: true,
      mode: "demo",
      message: "Submission received.",
    };
  }

  const workizResponse = await dispatchToWorkiz(payload);

  if (workizResponse) {
    return {
      ok: true,
      mode: "workiz",
      message: "Thanks. Your request was sent successfully.",
    };
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[contact-demo] Lead submission", buildWorkizPayload(payload));

    return {
      ok: true,
      mode: "demo",
      message: "Thanks. Your request was captured in demo mode.",
    };
  }

  return {
    ok: false,
    mode: "unconfigured",
    message:
      "Lead delivery is not configured yet. Please call or use online booking for immediate help.",
  };
}