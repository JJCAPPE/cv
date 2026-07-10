import { ImageResponse } from "next/og";

export const alt =
  "Giacomo Cappelletto, software systems, applied ML, robotics, and computer vision";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "stretch",
        background: "#0b0b0a",
        color: "#f1efe8",
        display: "flex",
        height: "100%",
        width: "100%",
      }}
    >
      <div
        style={{
          background: "#e6d12a",
          color: "#11110f",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "58px 56px",
          width: 370,
        }}
      >
        <span style={{ fontSize: 22 }}>COMPUTER ENGINEERING</span>
        <span style={{ fontSize: 26, lineHeight: 1.1 }}>
          Software
          <br />
          Machine learning
          <br />
          Robotics
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "58px 62px",
        }}
      >
        <span style={{ fontSize: 21 }}>GIACOMO CAPPELLETTO</span>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontFamily: "sans-serif",
            fontSize: 88,
            fontWeight: 600,
            letterSpacing: -5,
            lineHeight: 0.88,
            textTransform: "uppercase",
          }}
        >
          <span>REAL DATA.</span>
          <span>WORKING SYSTEMS.</span>
        </div>
        <span style={{ color: "#9e9b93", fontSize: 22 }}>
          Boston University / Summer 2027
        </span>
      </div>
    </div>,
    size,
  );
}
