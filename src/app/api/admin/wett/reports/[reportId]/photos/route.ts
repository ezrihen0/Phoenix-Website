import { NextResponse } from "next/server";

import { getWettReportSession } from "@/lib/auth/permissions";
import { assertWettPhotoFile, storeWettPhoto } from "@/lib/wett/photo-storage";
import { addWettPhoto, WettReportError } from "@/lib/wett/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const privateHeaders = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow",
};

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: privateHeaders });
}

export async function POST(request: Request, context: { params: Promise<{ reportId: string }> }) {
  const session = await getWettReportSession();

  if (!session) {
    return unauthorized();
  }

  const { reportId } = await context.params;

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(reportId)) {
    return NextResponse.json({ error: "Report not found." }, { status: 404, headers: privateHeaders });
  }
  const form = await request.formData();
  const file = form.get("file");
  const caption = form.get("caption");
  const expectedRevision = Number(form.get("expectedRevision"));

  if (!(file instanceof File) || !Number.isInteger(expectedRevision)) {
    return NextResponse.json({ error: "Choose a photo and try again." }, { status: 400, headers: privateHeaders });
  }

  try {
    assertWettPhotoFile(file);
    const stored = await storeWettPhoto({
      reportId,
      username: session.username,
      file,
      caption: typeof caption === "string" ? caption : undefined,
    });
    const textField = (key: string, max: number) => {
      const value = form.get(key);
      return typeof value === "string" && value.trim() ? value.trim().slice(0, max) : undefined;
    };
    const photo = {
      ...stored,
      checklistItemId: textField("checklistItemId", 120),
      findingId: textField("findingId", 80),
      measurementId: textField("measurementId", 80),
      systemType: textField("systemType", 40),
      inspectionSection: textField("inspectionSection", 80),
    };
    const report = await addWettPhoto(reportId, session.username, expectedRevision, photo);
    return NextResponse.json({ report }, { headers: privateHeaders });
  } catch (error) {
    const status = error instanceof WettReportError && error.code === "conflict" ? 409 : 400;
    const message = error instanceof Error ? error.message : "The photo could not be uploaded. Try again.";
    return NextResponse.json({ error: message }, { status, headers: privateHeaders });
  }
}
