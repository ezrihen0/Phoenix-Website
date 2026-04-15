import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at top, #d7a45b 0%, #b9471d 44%, #1f1a16 100%)",
          color: "#f9f3eb",
          fontSize: 220,
          fontWeight: 700,
          letterSpacing: -12,
        }}
      >
        P
      </div>
    ),
    size,
  );
}