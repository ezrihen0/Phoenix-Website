import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { Document, Image, Page, Text, View, renderToBuffer } from "@react-pdf/renderer";
import sharp from "sharp";

import { siteConfig } from "@/lib/site-data";
import { buildWettReportViewModel, type WettReportViewModel } from "@/lib/wett/report-view-model";
import { readWettPhotoBytes } from "@/lib/wett/photo-storage";
import type { WettReport } from "@/lib/wett/schema";

const COLORS = {
  charcoal: "#1c1816",
  copper: "#c56a3a",
  paper: "#ffffff",
  line: "#d8d0c6",
  muted: "#6b625a",
  ink: "#1f1a16",
  band: "#f4efe8",
} as const;

async function getPhoenixLogoSrc() {
  try {
    const webp = await readFile(join(process.cwd(), "public/images/brand/logo.webp"));
    const png = await sharp(webp).png().toBuffer();
    return `data:image/png;base64,${png.toString("base64")}`;
  } catch {
    return null;
  }
}

async function photoSources(report: WettReport) {
  const sources: Array<{ id: string; caption: string; src: string }> = [];

  for (const photo of report.photos.slice(0, 8)) {
    if (!photo.contentType.startsWith("image/") || photo.contentType.includes("heic") || photo.contentType.includes("heif")) {
      continue;
    }

    const bytes = await readWettPhotoBytes(photo.storageKey);

    if (!bytes) {
      continue;
    }

    try {
      const jpeg = await sharp(bytes).rotate().resize({ width: 1200, withoutEnlargement: true }).jpeg({ quality: 70 }).toBuffer();
      sources.push({
        id: photo.id,
        caption: photo.caption?.trim() || "Phoenix Evidence Photo",
        src: `data:image/jpeg;base64,${jpeg.toString("base64")}`,
      });
    } catch {
      // Skip a photo the renderer cannot embed. The caption still appears in the view model.
    }
  }

  return sources;
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ width: "48%", marginBottom: 8 }}>
      <Text style={{ fontSize: 8, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 0.6 }}>{label}</Text>
      <Text style={{ marginTop: 2, fontSize: 11 }}>{value}</Text>
    </View>
  );
}

function WettPdfDocument({
  model,
  logoSrc,
  photos,
}: {
  model: WettReportViewModel;
  logoSrc: string | null;
  photos: Array<{ id: string; caption: string; src: string }>;
}) {
  return (
    <Document title={`${model.reportNumber} inspection report`} author={siteConfig.legalName}>
      <Page size="LETTER" style={{ padding: 36, fontFamily: "Helvetica", color: COLORS.ink, backgroundColor: COLORS.paper }}>
        <View style={{ backgroundColor: COLORS.charcoal, padding: 18, borderRadius: 8 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              {logoSrc ? <Image src={logoSrc} style={{ width: 42, height: 42 }} /> : null}
              <View>
                <Text style={{ color: COLORS.paper, fontSize: 14 }}>{siteConfig.shortName}</Text>
                <Text style={{ color: COLORS.copper, marginTop: 2, fontSize: 9 }}>{model.title}</Text>
              </View>
            </View>
            <View>
              <Text style={{ color: COLORS.paper, fontSize: 12, textAlign: "right" }}>{model.reportNumber}</Text>
              <Text style={{ color: "#d8d0c6", marginTop: 2, fontSize: 9, textAlign: "right" }}>{model.inspectionDate}</Text>
            </View>
          </View>
        </View>
        <View style={{ height: 4, backgroundColor: COLORS.copper, marginTop: 8, marginBottom: 16 }} />

        <Text style={{ fontSize: 12, marginBottom: 8 }}>Report details</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
          <MetaRow label="Customer" value={model.customerName} />
          <MetaRow label="Inspector" value={model.inspectorName} />
          <MetaRow label="WETT number" value={model.wettInspectorNumber} />
          <MetaRow label="Inspection level" value={model.inspectionLevel} />
          <MetaRow label="Reason" value={model.reason} />
          <MetaRow label="Status" value={model.status} />
        </View>
        <Text style={{ fontSize: 8, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 0.6 }}>Property</Text>
        {model.propertyLines.map((line) => (
          <Text key={line} style={{ marginTop: 2, fontSize: 11 }}>
            {line}
          </Text>
        ))}

        <View style={{ marginTop: 16, padding: 12, backgroundColor: COLORS.band, borderRadius: 6 }}>
          <Text style={{ fontSize: 12, marginBottom: 6 }}>System</Text>
          <Text style={{ fontSize: 11, lineHeight: 1.4 }}>{model.systemLabel}</Text>
          {model.identification.length === 0 ? <Text style={{ fontSize: 11, lineHeight: 1.4, marginTop: 4 }}>Not recorded</Text> : null}
          {model.identification.map((item) => (
            <Text key={item.label} style={{ fontSize: 11, lineHeight: 1.4, marginTop: 4 }}>
              {item.label}: {item.value}
            </Text>
          ))}
        </View>

        <Text style={{ fontSize: 12, marginTop: 16, marginBottom: 6 }}>Executive summary</Text>
        {model.executiveSummary.map((line) => (
          <Text key={line} style={{ fontSize: 10, marginBottom: 2 }}>{line}</Text>
        ))}

        {model.measurements.length > 0 ? <Text style={{ fontSize: 12, marginTop: 16, marginBottom: 6 }}>Measurements & system checks</Text> : null}
        {model.measurements.map((item) => (
          <View key={item.label} style={{ borderBottomWidth: 1, borderBottomColor: COLORS.line, paddingVertical: 4 }}>
            <Text style={{ fontSize: 10, color: COLORS.muted }}>{item.label}</Text>
            <Text style={{ fontSize: 10, marginTop: 2 }}>{item.value}</Text>
          </View>
        ))}

        {model.sectionResults.length > 0 ? <Text style={{ fontSize: 12, marginTop: 16, marginBottom: 6 }}>Inspection</Text> : null}
        {model.sectionResults.map((item) => (
          <View key={item.label} style={{ borderBottomWidth: 1, borderBottomColor: COLORS.line, paddingVertical: 4 }}>
            <Text style={{ fontSize: 10, color: COLORS.muted }}>{item.label}</Text>
            <Text style={{ fontSize: 10, marginTop: 2 }}>{item.value}</Text>
            {photos.filter((photo) => item.photoIds.includes(photo.id)).map((photo) => (
              <Image key={photo.src} src={photo.src} style={{ width: 180, height: 120, objectFit: "cover", marginTop: 4 }} />
            ))}
          </View>
        ))}

        {model.cleaning ? <Text style={{ fontSize: 12, marginTop: 16, marginBottom: 6 }}>Maintenance / combustible deposits</Text> : null}
        {model.cleaning ? (
          <View style={{ marginBottom: 6 }}>
            {model.cleaning.observation ? <Text style={{ fontSize: 10 }}>Observation: {model.cleaning.observation}</Text> : null}
            <Text style={{ fontSize: 10, marginTop: 2 }}>Assessment: {model.cleaning.assessment}</Text>
            {model.cleaning.recommendation ? <Text style={{ fontSize: 10, marginTop: 2 }}>Technician recommendation: {model.cleaning.recommendation}</Text> : null}
            {model.cleaning.technicalBasis ? <Text style={{ fontSize: 10, marginTop: 2 }}>Technical basis: {model.cleaning.technicalBasis}</Text> : null}
            {photos.filter((photo) => model.cleaning?.photoIds.includes(photo.id)).map((photo) => (
              <Image key={photo.id} src={photo.src} style={{ width: 180, height: 120, objectFit: "cover", marginTop: 4 }} />
            ))}
          </View>
        ) : null}

        {model.findings.length > 0 ? <Text style={{ fontSize: 12, marginTop: 16, marginBottom: 6 }}>Additional findings</Text> : null}
        {model.findings.map((finding) => (
          <View key={`${finding.title}-${finding.body}`} style={{ marginBottom: 6 }}>
            <Text style={{ fontSize: 10 }}>{finding.title}: {finding.body}</Text>
            {photos.filter((photo) => finding.photoIds.includes(photo.id)).map((photo) => (
              <Image key={photo.src} src={photo.src} style={{ width: 180, height: 120, objectFit: "cover", marginTop: 4 }} />
            ))}
          </View>
        ))}

        {model.recommendations.length > 0 ? <Text style={{ fontSize: 12, marginTop: 16, marginBottom: 6 }}>Technician recommendations</Text> : null}
        {model.recommendationDisclaimer ? <Text style={{ fontSize: 10, marginBottom: 4 }}>{model.recommendationDisclaimer}</Text> : null}
        {model.recommendations.map((line) => (
          <Text key={line} style={{ fontSize: 10, marginBottom: 2 }}>{line}</Text>
        ))}

        {model.technicianNote ? <Text style={{ fontSize: 12, marginTop: 16, marginBottom: 6 }}>Technician notes</Text> : null}
        {model.technicianNote ? <Text style={{ fontSize: 11, lineHeight: 1.4 }}>{model.technicianNote}</Text> : null}
        {model.maintenanceNotes ? <Text style={{ fontSize: 11, lineHeight: 1.4, marginTop: 8 }}>Maintenance: {model.maintenanceNotes}</Text> : null}
        {model.protectiveBarrierNotes ? <Text style={{ fontSize: 11, lineHeight: 1.4, marginTop: 4 }}>Protective barrier: {model.protectiveBarrierNotes}</Text> : null}

        <View style={{ marginTop: 16, padding: 12, borderWidth: 1, borderColor: COLORS.line, borderRadius: 6 }}>
          <Text style={{ fontSize: 11, lineHeight: 1.4 }}>{model.signOff}</Text>
          <Text style={{ fontSize: 10, color: COLORS.muted, marginTop: 8, lineHeight: 1.4 }}>{model.scopeNote}</Text>
        </View>

        {photos.filter((photo) => !model.sectionResults.some((item) => item.photoIds.includes(photo.id)) && !model.findings.some((item) => item.photoIds.includes(photo.id)) && !model.cleaning?.photoIds.includes(photo.id)).map((photo) => (
          <View key={photo.src} style={{ marginTop: 12 }} wrap={false}>
            <Image src={photo.src} style={{ width: 240, height: 160, objectFit: "cover" }} />
            <Text style={{ marginTop: 4, fontSize: 10, color: COLORS.muted }}>{photo.caption}</Text>
          </View>
        ))}

        <Text
          fixed
          style={{ position: "absolute", bottom: 24, left: 36, right: 36, fontSize: 9, color: COLORS.muted }}
          render={({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) =>
            `${siteConfig.phoneDisplay}  ·  ${siteConfig.email}  ·  Page ${pageNumber} of ${totalPages}`
          }
        />
      </Page>
    </Document>
  );
}

export async function renderWettReportPdf(report: WettReport) {
  const model = buildWettReportViewModel(report);
  const [logoSrc, photos] = await Promise.all([getPhoenixLogoSrc(), photoSources(report)]);
  return renderToBuffer(<WettPdfDocument model={model} logoSrc={logoSrc} photos={photos} />);
}
