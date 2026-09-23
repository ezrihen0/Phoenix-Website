import "server-only";

import { getSiteSettings } from "@/lib/cms/storage";
import { siteConfig } from "@/lib/site-data";
import type { WettReport } from "@/lib/wett/schema";

export type WettEmailResult = {
  status: "sent" | "failed";
  recipientEmail?: string;
  failureReason?: string;
};

function getBrevoApiKey() {
  return process.env.BREVO_API_KEY?.trim() || "";
}

export async function sendCompletedWettReportEmail(report: WettReport, pdf: Uint8Array): Promise<WettEmailResult> {
  const recipient = report.customer.email?.trim();

  if (!recipient) {
    return {
      status: "failed",
      failureReason: "No customer email is saved on this report.",
    };
  }

  const apiKey = getBrevoApiKey();

  if (!apiKey) {
    return {
      status: "failed",
      recipientEmail: recipient,
      failureReason: "Email delivery is not configured. The completed report can be resent later.",
    };
  }

  try {
    const settings = await getSiteSettings();
    const sender = (settings.sendingEmail || settings.email).trim();

    if (!sender) {
      return {
        status: "failed",
        recipientEmail: recipient,
        failureReason: "A sender email is not configured. The completed report can be resent later.",
      };
    }

    const internalCopy = process.env.WETT_INTERNAL_REPORT_EMAIL?.trim();
    const filename = `${report.reportNumber}.pdf`;
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: settings.businessName || siteConfig.shortName,
          email: sender,
        },
        to: [{ email: recipient }],
        bcc: internalCopy ? [{ email: internalCopy }] : undefined,
        subject: `${siteConfig.shortName} inspection report ${report.reportNumber}`,
        textContent: [
          `Your inspection report ${report.reportNumber} is attached.`,
          "Official inspection wording will be added after the WETT Knowledge Pack is approved.",
        ].join("\n\n"),
        attachment: [
          {
            content: Buffer.from(pdf).toString("base64"),
            name: filename,
          },
        ],
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        status: "failed",
        recipientEmail: recipient,
        failureReason: "The email service rejected the completed report. It can be resent.",
      };
    }

    return {
      status: "sent",
      recipientEmail: recipient,
    };
  } catch {
    return {
      status: "failed",
      recipientEmail: recipient,
      failureReason: "The completed report email could not be sent. It can be resent.",
    };
  }
}
