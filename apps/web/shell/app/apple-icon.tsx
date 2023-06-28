import Image from "next/image";
import { ImageResponse } from "next/server";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}>
        <Image src="/apple-icon.png" alt="Pat Sullivan Development" />
      </div>
    )
  );
}
