import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site-data";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "linear-gradient(135deg, #1f1a16 0%, #3b271d 35%, #b9471d 72%, #d7a45b 100%)",
          color: "#f7f0e5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", gap: 16, alignItems: "center", fontSize: 28, letterSpacing: 4, textTransform: "uppercase" }}>
          <span style={{ opacity: 0.9 }}>Phoenix Chimney & Fireplace Services</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 900 }}>
          <div style={{ fontSize: 88, lineHeight: 0.96, fontWeight: 700 }}>
            Fireplace repair, chimney service, and WETT inspections for Calgary homes.
          </div>
          <div style={{ fontSize: 28, lineHeight: 1.4, opacity: 0.86 }}>
            {`${siteConfig.phoneDisplay} · ${siteConfig.bookingLabel}`}
          </div>
        </div>
      </div>
    ),
    size,
  );
}