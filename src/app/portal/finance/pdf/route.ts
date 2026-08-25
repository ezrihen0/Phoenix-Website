import { NextResponse } from "next/server";

import { renderPortalFinancePdf } from "@/lib/portal/finance-pdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const invoiceId = searchParams.get("invoice");
  const estimateId = searchParams.get("estimate");
  const kind = invoiceId ? "invoice" : estimateId ? "estimate" : null;
  const id = invoiceId || estimateId;

  if (!kind || !id) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const result = await renderPortalFinancePdf(kind, id);
  if (!result) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return new NextResponse(new Uint8Array(result.buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${result.filename}"`,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
    },
  });
}
