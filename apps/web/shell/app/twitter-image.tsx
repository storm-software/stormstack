import { BoxLogo } from "@open-system/shared-components";
import { ImageResponse } from "next/server";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "About Acme";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Font
const melody = fetch(
  new URL(
    "/static/fonts/BLMelody-Bold.woff2",
    process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : "http://localhost:3000"
  )
).then(res => res.arrayBuffer());

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div className="flex flex-col items-center justify-center gap-5 bg-bg-primary">
        <BoxLogo className="h-1/2 max-h-[26rem] min-h-[10rem]" />
        <h1 className="whitespace-pre text-5xl font-header-1 leading-none text-primary">
          Pat Sullivan
          <br />
          <span className="bg-gradient-to-r from-gradient-from via-gradient-via to-gradient-to bg-clip-text text-transparent">
            Development
          </span>
        </h1>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
      fonts: [
        {
          name: "Inter",
          data: await melody,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
