import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";

import {
  Document,
  Image,
  Page,
  Path,
  Svg,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";
import sharp from "sharp";

import {
  FINANCE_A4,
  FINANCE_A4_COLORS,
  FINANCE_A4_COPY,
  pdfPointX,
  pdfPointY,
  toEstimateDocumentView,
  toInvoiceDocumentView,
  type FinanceDocumentView,
} from "@/lib/portal/finance-document";
import { portalFinancePdfFilename, portalUiPreviewProfile } from "@/lib/portal/ui-preview";
import { siteConfig } from "@/lib/site-data";

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const HEADER_H = pdfPointY(FINANCE_A4.headerHeight);
const PAD = pdfPointX(FINANCE_A4.padX);
const CONTENT_W = PAGE_W - PAD * 2;

/** Print-readable sizes at 100% — geometry unchanged, typography only. */
const PDF_FONT = {
  body: 10.5,
  sectionTitle: 9.5,
  headerContact: 9.5,
  meta: 10,
  docType: 26,
  tableHeader: 9.5,
  tableRow: 10.5,
  summaryLabel: 9,
  summaryBody: 10.5,
  totals: 10.5,
  emphasis: 11,
  footerCredentials: 9,
  footerTagline: 11,
} as const;

const TABLE_ROW_H = 25;

async function getPhoenixLogoSrc() {
  try {
    const webp = await readFile(join(process.cwd(), "public/images/brand/logo.webp"));
    const png = await sharp(webp).png().toBuffer();
    return `data:image/png;base64,${png.toString("base64")}`;
  } catch {
    return null;
  }
}

function FinancePdfPage({ document, logoSrc }: { document: FinanceDocumentView; logoSrc: string | null }) {
  const copperLeftTop = PAGE_W * 0.62;
  const copperLeftBottom = PAGE_W * 0.54;
  const cardW = (CONTENT_W - pdfPointX(FINANCE_A4.cardGap)) / 2;
  const cardH = pdfPointY(FINANCE_A4.cardHeight);
  const tableTop = pdfPointY(FINANCE_A4.tableY);
  const footerTop = PAGE_H - pdfPointY(FINANCE_A4.footerHeight);
  const descW = CONTENT_W * 0.51;
  const qtyW = CONTENT_W * 0.13;
  const priceW = CONTENT_W * 0.19;
  const amtW = CONTENT_W * 0.17;

  return (
    <Document title={document.documentNumber} author={siteConfig.legalName}>
      <Page size="A4" style={{ backgroundColor: FINANCE_A4_COLORS.paper, fontFamily: "Helvetica", fontSize: PDF_FONT.body, color: FINANCE_A4_COLORS.ink }}>
        <View style={{ position: "absolute", top: 0, left: 0, width: PAGE_W, height: HEADER_H, backgroundColor: FINANCE_A4_COLORS.charcoal }} />
        <Svg style={{ position: "absolute", top: 0, left: 0 }} width={PAGE_W} height={HEADER_H}>
          <Path
            d={`M ${copperLeftTop} 0 L ${PAGE_W} 0 L ${PAGE_W} ${HEADER_H} L ${copperLeftBottom} ${HEADER_H} Z`}
            fill={FINANCE_A4_COLORS.copper}
          />
        </Svg>

        <View style={{ position: "absolute", top: 18, left: PAD, width: PAGE_W * 0.5 }}>
          {logoSrc ? <Image src={logoSrc} style={{ width: 72, height: 26, objectFit: "contain" }} /> : null}
          <View style={{ marginTop: 14, gap: 4 }}>
            <Text style={{ color: "#ffffff", fontSize: PDF_FONT.headerContact }}>{document.brand.phone}</Text>
            <Text style={{ color: "#ffffff", fontSize: PDF_FONT.headerContact }}>{document.brand.email}</Text>
            <Text style={{ color: "#ffffff", fontSize: PDF_FONT.headerContact }}>{document.brand.website}</Text>
            <Text style={{ color: "#ffffff", fontSize: PDF_FONT.headerContact }}>{document.brand.address}</Text>
          </View>
        </View>

        <View style={{ position: "absolute", top: 28, left: PAGE_W * 0.62, width: PAGE_W * 0.34 }}>
          <Text style={{ color: "#ffffff", fontSize: PDF_FONT.docType, fontFamily: "Helvetica-Bold", letterSpacing: 2 }}>{document.documentType}</Text>
          <Meta label={document.numberCaption} value={document.documentNumber} />
          <Meta label={document.issueDateCaption} value={document.issueDateLabel} />
          <Meta label={document.dueDateCaption} value={document.dueDateLabel} />
          <View style={{ flexDirection: "row", marginTop: 5 }}>
            <Text style={{ width: 72, color: "#ffffff", opacity: 0.88, fontSize: PDF_FONT.meta }}>Status</Text>
            <Text style={{ backgroundColor: "#ffffff", color: FINANCE_A4_COLORS.charcoal, paddingHorizontal: 6, paddingVertical: 1, fontFamily: "Helvetica-Bold", fontSize: PDF_FONT.meta }}>
              {document.status}
            </Text>
          </View>
          <Meta label="Job #" value={document.jobNumber} />
        </View>

        <View style={{ position: "absolute", top: pdfPointY(370), left: PAD, width: cardW, height: cardH, borderWidth: 1, borderColor: FINANCE_A4_COLORS.line, padding: 8 }}>
          <Text style={{ color: FINANCE_A4_COLORS.copper, fontFamily: "Helvetica-Bold", letterSpacing: 1, marginBottom: 6, fontSize: PDF_FONT.sectionTitle }}>BILL TO</Text>
          <Text style={{ fontSize: PDF_FONT.body }}>{document.customer.name}</Text>
          <Text style={{ fontSize: PDF_FONT.body }}>{document.customer.email}</Text>
          <Text style={{ fontSize: PDF_FONT.body }}>{document.customer.phone}</Text>
          <Text style={{ fontSize: PDF_FONT.body }}>{document.customer.billingAddress}</Text>
        </View>
        <View style={{ position: "absolute", top: pdfPointY(370), left: PAD + cardW + pdfPointX(FINANCE_A4.cardGap), width: cardW, height: cardH, borderWidth: 1, borderColor: FINANCE_A4_COLORS.line, padding: 8 }}>
          <Text style={{ color: FINANCE_A4_COLORS.copper, fontFamily: "Helvetica-Bold", letterSpacing: 1, marginBottom: 6, fontSize: PDF_FONT.sectionTitle }}>SERVICE ADDRESS</Text>
          <Text style={{ fontSize: PDF_FONT.body }}>{document.serviceAddress}</Text>
        </View>

        <View style={{ position: "absolute", top: pdfPointY(FINANCE_A4.summaryY), left: PAD, width: CONTENT_W, height: pdfPointY(FINANCE_A4.summaryHeight), backgroundColor: FINANCE_A4_COLORS.summaryBand, flexDirection: "row", alignItems: "center" }}>
          <View style={{ width: CONTENT_W * 0.18, borderRightWidth: 2, borderRightColor: FINANCE_A4_COLORS.copper, paddingHorizontal: 8 }}>
            <Text style={{ color: FINANCE_A4_COLORS.copper, fontFamily: "Helvetica-Bold", letterSpacing: 0.8, fontSize: PDF_FONT.summaryLabel }}>SERVICE SUMMARY</Text>
          </View>
          <Text style={{ flex: 1, paddingHorizontal: 10, fontSize: PDF_FONT.summaryBody }}>{document.serviceSummary}</Text>
        </View>

        <View style={{ position: "absolute", top: tableTop, left: PAD, width: CONTENT_W }}>
          <View style={{ flexDirection: "row", backgroundColor: FINANCE_A4_COLORS.charcoal, color: "#ffffff", paddingVertical: 7, paddingHorizontal: 6 }}>
            <Text style={{ width: descW, color: "#ffffff", fontFamily: "Helvetica-Bold", fontSize: PDF_FONT.tableHeader }}>DESCRIPTION</Text>
            <Text style={{ width: qtyW, color: "#ffffff", fontFamily: "Helvetica-Bold", fontSize: PDF_FONT.tableHeader }}>QTY</Text>
            <Text style={{ width: priceW, color: "#ffffff", fontFamily: "Helvetica-Bold", fontSize: PDF_FONT.tableHeader }}>UNIT PRICE</Text>
            <Text style={{ width: amtW, color: "#ffffff", fontFamily: "Helvetica-Bold", fontSize: PDF_FONT.tableHeader }}>AMOUNT</Text>
          </View>
          {document.lineItems.map((line) => (
            <View key={`${line.description}-${line.amount}`} style={{ flexDirection: "row", borderBottomWidth: 1, borderColor: FINANCE_A4_COLORS.line, paddingVertical: 7, paddingHorizontal: 6 }}>
              <Text style={{ width: descW, fontSize: PDF_FONT.tableRow }}>{line.description}</Text>
              <Text style={{ width: qtyW, fontSize: PDF_FONT.tableRow }}>{line.quantity}</Text>
              <Text style={{ width: priceW, fontSize: PDF_FONT.tableRow }}>{line.unitPrice}</Text>
              <Text style={{ width: amtW, fontSize: PDF_FONT.tableRow }}>{line.amount}</Text>
            </View>
          ))}
        </View>

        <View style={{ position: "absolute", top: tableTop + 30 + document.lineItems.length * TABLE_ROW_H, left: PAD, width: CONTENT_W, flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ width: CONTENT_W * 0.48, borderWidth: 1, borderColor: FINANCE_A4_COLORS.line, padding: 8 }}>
            <Text style={{ color: FINANCE_A4_COLORS.copper, fontFamily: "Helvetica-Bold", letterSpacing: 1, marginBottom: 6, fontSize: PDF_FONT.sectionTitle }}>NOTES & PAYMENT TERMS</Text>
            <Text style={{ fontSize: PDF_FONT.body }}>{document.notes}</Text>
            <Text style={{ marginTop: 6, fontSize: PDF_FONT.body }}>{document.paymentTerms}</Text>
          </View>
          <View style={{ width: CONTENT_W * 0.48 }}>
            <TotalRow label="Subtotal" value={document.subtotal} />
            <TotalRow label={document.taxLabel} value={document.tax} />
            <TotalRow label="Total" value={document.total} />
            <TotalRow label="Payments & Credits" value={document.payments} />
            <View style={{ marginTop: 6, flexDirection: "row", backgroundColor: FINANCE_A4_COLORS.charcoal }}>
              <Text style={{ flex: 1, color: "#ffffff", padding: 7, fontFamily: "Helvetica-Bold", fontSize: PDF_FONT.emphasis }}>{document.emphasizedLabel}</Text>
              <Text style={{ color: "#ffffff", backgroundColor: FINANCE_A4_COLORS.copper, padding: 7, fontFamily: "Helvetica-Bold", fontSize: PDF_FONT.emphasis }}>{document.emphasizedAmount}</Text>
            </View>
          </View>
        </View>

        <View style={{ position: "absolute", top: footerTop, left: PAD, width: CONTENT_W, alignItems: "center" }}>
          <View style={{ width: "100%", height: 1, backgroundColor: FINANCE_A4_COLORS.copper, marginBottom: 8 }} />
          {logoSrc ? <Image src={logoSrc} style={{ width: 18, height: 18, objectFit: "contain", marginBottom: 6 }} /> : null}
          <Text style={{ fontSize: PDF_FONT.footerCredentials, letterSpacing: 1.4, fontFamily: "Helvetica-Bold" }}>{FINANCE_A4_COPY.credentials}</Text>
          <Text style={{ marginTop: 4, color: FINANCE_A4_COLORS.copper, fontFamily: "Times-Italic", fontSize: PDF_FONT.footerTagline }}>{FINANCE_A4_COPY.tagline}</Text>
        </View>
      </Page>
    </Document>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: "row", marginTop: 5 }}>
      <Text style={{ width: 72, color: "#ffffff", opacity: 0.88, fontSize: PDF_FONT.meta }}>{label}</Text>
      <Text style={{ color: "#ffffff", fontSize: PDF_FONT.meta }}>{value}</Text>
    </View>
  );
}

function TotalRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 }}>
      <Text style={{ fontSize: PDF_FONT.totals }}>{label}</Text>
      <Text style={{ fontSize: PDF_FONT.totals }}>{value}</Text>
    </View>
  );
}

export async function renderPortalFinancePdf(kind: "invoice" | "estimate", id: string) {
  const profile = portalUiPreviewProfile;
  const logoSrc = await getPhoenixLogoSrc();

  if (kind === "invoice") {
    const invoice = profile.finance.invoices.find((item) => item.id === id);
    if (!invoice) {
      return null;
    }

    const document = toInvoiceDocumentView(invoice, profile);
    const buffer = await renderToBuffer(<FinancePdfPage document={document} logoSrc={logoSrc} />);
    return { buffer, filename: portalFinancePdfFilename("invoice", invoice.number) };
  }

  const estimate = profile.finance.estimates.find((item) => item.id === id);
  if (!estimate) {
    return null;
  }

  const document = toEstimateDocumentView(estimate, profile);
  const buffer = await renderToBuffer(<FinancePdfPage document={document} logoSrc={logoSrc} />);
  return { buffer, filename: portalFinancePdfFilename("estimate", estimate.number) };
}
