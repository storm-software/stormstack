import { Inter, Roboto_Mono } from "next/font/google";
import localFont from "next/font/local";

export const melody = localFont({
  variable: "--font-melody",
  src: "../public/static/fonts/BLMelody-Bold.otf",
});

export const satoshi = localFont({
  variable: "--font-satoshi",
  src: "../public/static/fonts/Satoshi-Bold.otf",
});

export const antiqueOlive = localFont({
  variable: "--font-antique-olive",
  src: "../public/static/fonts/Antique-Olive-Black.ttf",
});

export const permanentMarker = localFont({
  variable: "--font-permanent-marker",
  src: "../public/static/fonts/PermanentMarker-Regular.ttf",
});

export const monaSans = localFont({
  variable: "--font-mona-sans",
  src: "../public/static/fonts/Mona-Sans-Light.otf",
});

export const monaSansExtraBold = localFont({
  variable: "--font-mona-sans-extrabold",
  src: "../public/static/fonts/Mona-Sans-ExtraBold.otf",
});

/*export const anybody = Anybody({
  variable: "--font-anybody",
  subsets: ["latin"],
  display: "swap",
  fallback: ["arial"],
});*/

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  fallback: ["arial"],
});

export const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  style: ["normal"],
  display: "swap",
  fallback: ["arial"],
});
