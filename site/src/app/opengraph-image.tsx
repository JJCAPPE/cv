import { ImageResponse } from "next/og";

export const alt =
  "Giacomo Cappelletto — software systems, applied ML, computer vision, rowing biomechanics";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "stretch",
        background: "#050505",
        color: "#f5f5f5",
        display: "flex",
        fontFamily: "sans-serif",
        height: "100%",
        padding: "72px",
        width: "100%",
      }}
    >
      <div
        style={{
          borderLeft: "1px solid #262626",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          paddingLeft: "52px",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "#9ca3af",
            display: "flex",
            fontFamily: "monospace",
            fontSize: 22,
            gap: 28,
            textTransform: "uppercase",
          }}
        >
          <span>Software Systems</span>
          <span>/</span>
          <span>Applied ML</span>
          <span>/</span>
          <span>Biomechanics</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: 72,
              letterSpacing: "-0.045em",
              lineHeight: 1,
              marginBottom: 30,
            }}
          >
            Giacomo Cappelletto
          </div>
          <div
            style={{
              color: "#9ca3af",
              fontSize: 29,
              lineHeight: 1.35,
              maxWidth: 820,
            }}
          >
            Computer Engineering at Boston University. Building software,
            data systems, and computer vision pipelines for human motion.
          </div>
        </div>
        <div
          style={{
            color: "#525252",
            display: "flex",
            fontFamily: "monospace",
            fontSize: 20,
            justifyContent: "space-between",
          }}
        >
          <span>Boston / Treviso</span>
          <span>github.com/JJCAPPE</span>
        </div>
      </div>
    </div>,
    size,
  );
}
