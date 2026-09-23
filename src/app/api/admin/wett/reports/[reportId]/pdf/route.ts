import { NextResponse } from "next/server";

import { getWettReportSession } from "@/lib/auth/permissions";
import { isWettRecordId } from "@/lib/wett/photo-storage";
import { renderWettReportPdf } from "@/lib/wett/report-pdf";
import { getWettReport } from "@/lib/wett/service";
import { readPrivateWettBytes } from "@/lib/wett/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const privateHeaders = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow",
};

export async function GET(_request: Request, context: { params: Promise<{ reportId: string }> }) {
  const session = await getWettReportSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: privateHeaders });
  }

  const { reportId } = await context.params;

  if (!isWettRecordId(reportId)) {
    return NextResponse.json({ error: "Report not found." }, { status: 404, headers: privateHeaders });
  }
  const report = await getWettReport(reportId);

  if (!report) {
    return NextResponse.json({ error: "Report not found." }, { status: 404, headers: privateHeaders });
  }

  const stored =
    report.status === "completed" && report.reportOutput.pdfStorageKey
      ? await readPrivateWettBytes(report.reportOutput.pdfStorageKey)
      : null;
  const pdf = stored ?? (await renderWettReportPdf(report));

  return new Response(Buffer.from(pdf), {
    headers: {
      ...privateHeaders,
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${report.reportNumber}.pdf"`,
    },
  });
}
