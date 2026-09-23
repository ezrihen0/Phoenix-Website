import { NextResponse } from "next/server";

import { getWettReportSession } from "@/lib/auth/permissions";
import { isWettRecordId, readWettPhotoBytes } from "@/lib/wett/photo-storage";
import { getWettReport } from "@/lib/wett/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const privateHeaders = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow",
};

export async function GET(_request: Request, context: { params: Promise<{ reportId: string; photoId: string }> }) {
  const session = await getWettReportSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: privateHeaders });
  }

  const { reportId, photoId } = await context.params;

  if (!isWettRecordId(reportId) || !isWettRecordId(photoId)) {
    return NextResponse.json({ error: "Photo not found." }, { status: 404, headers: privateHeaders });
  }
  const report = await getWettReport(reportId);
  const photo = report?.photos.find((entry) => entry.id === photoId);

  if (!photo) {
    return NextResponse.json({ error: "Photo not found." }, { status: 404, headers: privateHeaders });
  }

  const bytes = await readWettPhotoBytes(photo.storageKey);

  if (!bytes) {
    return NextResponse.json({ error: "Photo not found." }, { status: 404, headers: privateHeaders });
  }

  return new Response(Buffer.from(bytes), {
    headers: {
      ...privateHeaders,
      "Content-Type": photo.contentType,
    },
  });
}
