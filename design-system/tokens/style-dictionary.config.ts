import { makeSdTailwindConfig } from "./src/tailwindcss";

const sdConfig = makeSdTailwindConfig({
  source: ["src/themes/**/tokens.json"],
  isPreset: true,
  excludeCompTokensOnType: [
    "spacing",
    "borderWidth",
    "shadow",
    "boxShadow",
    "opacity",
    "fontSizes",
  ],
  tailwind: {
    "content": ["./src/**/*.{js,ts,jsx,tsx}"],
    "plugins": ["typography", "forms"],
  },
});

export default {
  ...sdConfig,
  platforms: {
    ...sdConfig.platforms,
    css: {
      transformGroup: "css",
      buildPath: "./styles/",
      files: [
        {
          destination: "tailwind.css",
          format: "css/variables",
        },
      ],
    },
  },
};
