import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileStickyCTA } from "@/components/layout/MobileStickyCTA";
import { siteConfig } from "@/lib/site";
import { localBusinessSchema } from "@/lib/schema";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: "Phoenix Chimney & Fireplace | Premium Service in Alberta",
    template: "%s | Phoenix Chimney & Fireplace",
  },
  description:
    "Premium chimney and fireplace services in Alberta, including gas fireplace repair, WETT inspections, chimney sweep, and chimney repair.",
  openGraph: {
    type: "website",
    title: "Phoenix Chimney & Fireplace",
    description:
      "Premium chimney and fireplace services in Alberta with fast booking and professional reporting.",
    url: siteConfig.siteUrl,
    siteName: "Phoenix Chimney & Fireplace",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema()) }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
        <MobileStickyCTA />
      </body>
    </html>
  );
}
