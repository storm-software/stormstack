import { Inter, Roboto_Mono } from "@next/font/google";
import localFont from "@next/font/local";

export const melody = localFont({
  variable: "--font-melody",
  src: "../../../../assets/fonts/BLMelody-Bold.woff2",
});

export const satoshi = localFont({
  variable: "--font-satoshi",
  src: "../../../../assets/fonts/Satoshi-Bold.otf",
});

export const antiqueOlive = localFont({
  variable: "--font-antique-olive",
  src: "../../../../assets/fonts/Antique-Olive-Black.ttf",
});

export const permanentMarker = localFont({
  variable: "--font-permanent-marker",
  src: "../../../../assets/fonts/PermanentMarker-Regular.ttf",
});

export const monaSans = localFont({
  variable: "--font-mona-sans",
  src: "../../../../assets/fonts/Mona-Sans-Light.woff2",
});

export const monaSansExtraBold = localFont({
  variable: "--font-mona-sans-extrabold",
  src: "../../../../assets/fonts/Mona-Sans-ExtraBold.woff2",
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
