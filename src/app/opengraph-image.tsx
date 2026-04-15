import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site-data";

export const alt = "Phoenix Chimney & Fireplace Services logo and Calgary service overview";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), "public/images/brand/favicon-512.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          padding: "28px",
          background:
            "linear-gradient(145deg, #17120f 0%, #2c1d15 42%, #7a2d14 74%, #d7a45b 100%)",
          color: "#fbf2e6",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            flexDirection: "column",
            justifyContent: "space-between",
            borderRadius: "36px",
            padding: "42px 48px",
            background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
            border: "1px solid rgba(255,255,255,0.18)",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "120px",
                  height: "120px",
                  borderRadius: "28px",
                  background: "rgba(255,255,255,0.94)",
                  border: "1px solid rgba(23,18,15,0.12)",
                }}
              >
                <img src={logoSrc} width={90} height={90} alt="Phoenix logo" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div
                  style={{
                    display: "flex",
                    fontSize: "54px",
                    fontWeight: 800,
                    lineHeight: 1,
                    letterSpacing: "4px",
                  }}
                >
                  PHOENIX
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: "20px",
                    textTransform: "uppercase",
                    letterSpacing: "4px",
                    color: "#ecd0aa",
                  }}
                >
                  Chimney & Fireplace Services
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                borderRadius: "999px",
                padding: "12px 20px",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.16)",
                fontSize: "22px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#f5dcb8",
              }}
            >
              Calgary & Area
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              maxWidth: "930px",
            }}
          >
            <div style={{ display: "flex", fontSize: "82px", lineHeight: 1.02, fontWeight: 800 }}>
              Gas fireplace repair, chimney service, and WETT inspections.
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "30px",
                lineHeight: 1.35,
                color: "#f3e1c7",
              }}
            >
              Safety-first service, chimney sweeping, masonry repair, and insurance-ready reporting for Calgary homeowners.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", gap: "14px" }}>
              {[
                "WETT reports",
                "Gas fireplace repair",
                "Chimney sweeping",
                "Masonry rebuilds",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "999px",
                    padding: "12px 18px",
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    fontSize: "22px",
                    color: "#fbf2e6",
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
              <div style={{ display: "flex", fontSize: "32px", fontWeight: 700 }}>
                {siteConfig.phoneDisplay}
              </div>
              <div style={{ display: "flex", fontSize: "22px", color: "#ecd0aa" }}>
                {siteConfig.serviceRadius}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}