import type { Metadata } from "next";
import { Bricolage_Grotesque, Cormorant_Garamond } from "next/font/google";

import { MobileActionDock } from "@/components/mobile-action-dock";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StructuredData } from "@/components/structured-data";
import { getPublicSiteSettings } from "@/lib/cms/storage";
import { absoluteUrl } from "@/lib/seo";
import {
  buildLocalBusinessSchema,
  buildWebsiteSchema,
  createPageMetadata,
} from "@/lib/seo";
import { siteConfig } from "@/lib/site-data";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  category: "home services",
  creator: siteConfig.name,
  publisher: siteConfig.name,
  referrer: "origin-when-cross-origin",
  authors: [{ name: siteConfig.name }],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/images/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/brand/favicon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/images/brand/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/images/brand/favicon-180.png", sizes: "180x180", type: "image/png" }],
  },
  alternates: {
    types: {
      "application/rss+xml": absoluteUrl("/feed.xml"),
    },
  },
  ...createPageMetadata({
    title: "Fireplace Repair Calgary | Chimney, WETT & Gas Fireplace Service",
    description:
      "Book Calgary fireplace and chimney specialists for gas fireplace repair, WETT inspections, chimney sweeping, relining, and masonry work.",
    path: "/",
    keywords: [
      "fireplace repair Calgary",
      "chimney repair Calgary",
      "WETT inspection Calgary",
      "gas fireplace repair Calgary",
      "chimney sweep Calgary",
    ],
  }),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getPublicSiteSettings();

  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${cormorant.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full bg-[var(--color-paper)] text-[var(--color-ink)]">
        <StructuredData
          data={[buildWebsiteSchema(), buildLocalBusinessSchema()]}
        />
        <div className="relative flex min-h-screen flex-col overflow-x-clip pb-24 lg:pb-0">
          <SiteHeader settings={settings} />
          <main className="flex-1">{children}</main>
          <SiteFooter settings={settings} />
          <MobileActionDock settings={settings} />
        </div>
      </body>
    </html>
  );
}
