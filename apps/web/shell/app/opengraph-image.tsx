import { BoxLogo } from "@open-system/shared-components";
import { ImageResponse } from "next/server";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "Pat Sullivan Development";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

// Font
const melody = fetch(
  new URL(
    "/static/fonts/BLMelody-Bold.otf",
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"
  )
).then(res => res.arrayBuffer());

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div tw="flex flex-col items-center justify-center gap-5 bg-bg-primary">
        <BoxLogo className="max-h-[26]rem h-1/2 min-h-[15rem]" />
        <h1 tw="whitespace-pre text-5xl font-header-1 leading-none text-primary">
          Pat Sullivan
          <br />
          <span tw="bg-gradient-to-r from-gradient-from via-gradient-via to-gradient-to bg-clip-text text-transparent">
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
          name: "BLMelody",
          data: await melody,
        },
      ],
    }
  );
}
