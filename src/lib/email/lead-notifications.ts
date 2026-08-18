import "server-only";

import nodemailer from "nodemailer";

import type { SiteSettings } from "@/lib/cms/types";

export type LeadNotificationContent = {
  subject: string;
  text: string;
  html: string;
  replyTo: string;
};

export type LeadEmailDeliveryResult = {
  status: "sent" | "skipped" | "failed";
  note?: string;
};

function getBrevoApiKey() {
  return process.env.BREVO_API_KEY?.trim() || "";
}

function getRecipient(settings: SiteSettings) {
  return (settings.notificationEmail || settings.sendingEmail || settings.email).trim();
}

function getSender(settings: SiteSettings) {
  return (settings.sendingEmail || settings.email).trim();
}

export function leadEmailDeliveryIsConfigured(settings: SiteSettings) {
  const recipient = getRecipient(settings);
  const sender = getSender(settings);

  if (!recipient || !sender) {
    return false;
  }

  if (getBrevoApiKey()) {
    return true;
  }

  return Boolean(settings.googleAppPassword.trim());
}

async function sendViaBrevo(
  settings: SiteSettings,
  content: LeadNotificationContent,
): Promise<LeadEmailDeliveryResult> {
  const apiKey = getBrevoApiKey();
  const recipient = getRecipient(settings);
  const sender = getSender(settings);

  if (!apiKey) {
    return {
      status: "failed",
      note: "Brevo API key is not configured.",
    };
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: {
          name: settings.businessName || "Phoenix Fireplace Leads",
          email: sender,
        },
        to: [{ email: recipient }],
        replyTo: { email: content.replyTo },
        subject: content.subject,
        htmlContent: content.html,
        textContent: content.text,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("[lead-email] Brevo API error", response.status, errorBody);

      return {
        status: "failed",
        note: `Brevo rejected the notification email (${response.status}).`,
      };
    }

    return {
      status: "sent",
      note: `Lead email sent to ${recipient} via Brevo.`,
    };
  } catch (error) {
    console.error("[lead-email] Brevo delivery failed", error);

    return {
      status: "failed",
      note: error instanceof Error ? error.message : "Unknown Brevo delivery error.",
    };
  }
}

async function sendViaSmtp(
  settings: SiteSettings,
  content: LeadNotificationContent,
): Promise<LeadEmailDeliveryResult> {
  const recipient = getRecipient(settings);
  const sender = getSender(settings);
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

  try {
    await transporter.sendMail({
      from: `Phoenix website leads <${sender}>`,
      to: recipient,
      replyTo: content.replyTo,
      subject: content.subject,
      text: content.text,
      html: content.html,
    });

    return {
      status: "sent",
      note: `Lead email sent to ${recipient}.`,
    };
  } catch (error) {
    console.error("[lead-email] SMTP delivery failed", error);

    return {
      status: "failed",
      note: error instanceof Error ? error.message : "Unknown email delivery error.",
    };
  }
}

export async function sendLeadNotificationEmail(
  settings: SiteSettings,
  content: LeadNotificationContent,
): Promise<LeadEmailDeliveryResult> {
  if (!settings.sendLeadEmails) {
    return {
      status: "skipped",
      note: "Lead email notifications are turned off.",
    };
  }

  if (!leadEmailDeliveryIsConfigured(settings)) {
    return {
      status: "failed",
      note: "Lead email delivery is enabled, but BREVO_API_KEY or Gmail SMTP credentials are missing.",
    };
  }

  if (getBrevoApiKey()) {
    return sendViaBrevo(settings, content);
  }

  return sendViaSmtp(settings, content);
}
