const { fontFamily } = require("tailwindcss/defaultTheme");
const extend = require("./dist/design-system/tokens/js/theme");
const plugin = require("tailwindcss/plugin");
const { join } = require("path");
const { createGlobPatternsForDependencies } = require("@nx/react/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  "content": [
    join(__dirname, "apps/web/shell/app/**/*!(*.stories|*.spec).{ts,tsx,html}"),
    join(
      __dirname,
      "apps/web/shell/components/**/*!(*.stories|*.spec).{ts,tsx,html}"
    ),
    join(__dirname, "libs/**/typescript/**/*!(*.stories|*.spec).{ts,tsx,html}"),
    join(
      __dirname,
      "design-system/components/**/*!(*.stories|*.spec).{ts,tsx,html}"
    ),
  ],
  "future": {
    "hoverOnlyWhenSupported": true,
  },
  "theme": {
    "extend": {
      ...extend,
      "fontFamily": {
        ...extend.fontFamily,
        "app-title-1": ["var(--font-melody)", ...fontFamily.sans],
        "header-1": ["var(--font-melody)", ...fontFamily.sans],
        "header-2": ["var(--font-melody)", ...fontFamily.sans],
        "header-3": ["var(--font-melody)", ...fontFamily.sans],
        "header-4": ["var(--font-permanent-marker)", ...fontFamily.sans],
        "header-5": ["var(--font-permanent-marker)", ...fontFamily.sans],
        "header-6": ["var(--font-mona-sans-extrabold)", ...fontFamily.sans],
        "body-1": ["var(--font-mona-sans)", ...fontFamily.sans],
        "body-2": ["var(--font-inter)", ...fontFamily.sans],
        "label-1": ["var(--font-mona-sans-extrabold)", ...fontFamily.sans],
        "label-2": ["var(--font-permanent-marker)", ...fontFamily.sans],
        "label-3": ["var(--font-satoshi)", ...fontFamily.sans],
        "label-4": ["var(--font-antique-olive)", ...fontFamily.sans],
        "btn-label-1": ["var(--font-mona-sans-extrabold)", ...fontFamily.sans],
        "rating-label": ["var(--font-permanent-marker)", ...fontFamily.sans],
        "footer-name": ["var(--font-permanent-marker)", ...fontFamily.sans],
        "footer-copyright": ["var(--font-mona-sans)", ...fontFamily.sans],
        "vhs": ["var(--font-roboto-mono)", ...fontFamily.mono],
      },
      "textShadow": {
        ...extend.textShadow,
        "sm": "0 1px 2px var(--tw-shadow-color)",
        "DEFAULT": "0 2px 4px var(--tw-shadow-color)",
        "lg": "0 0 80px rgba(var(--tw-shadow-color), 0.8), 0 0 32px rgba(var(--tw-shadow-color), 0.3)",
      },
      "backgroundImage": {
        ...extend.backgroundImage,
        "bg-radial": "radial-gradient(var(--tw-gradient-stops))",
        "bg-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "bg-footer": "url(../../../../assets/backgrounds/bg-footer.jpg)",
        "bg-windows": "url(../../../../assets/backgrounds/bg-windows.jpg)",
      },
      "zIndex": {
        ...extend.zIndex,
        "bg": 2,
        "bg-sphere": 3,
        "content-bg": 80,
        "scroll": 90,
        "content-low": 100,
        "content-mid-low": 105,
        "content": 110,
        "content-mid-high": 115,
        "content-high": 120,
        "title": 125,
        "footer": 130,
        "rating": 140,
        "nav": 145,
        "nav-buttons": 150,
        "modal": 170,
        "notification": 180,
        "progress": 200,
        "loading": 250,
        "highest": 999,
      },
      "animation": {
        ...extend.animation,
        "marquee": "marquee 25s linear infinite",
        "marquee2": "marquee2 25s linear infinite",
        "wave1": "wave 18s -3s linear infinite",
        "wave2": "wave 22s linear reverse infinite",
        "wave3": "wave 20s -1s linear infinite",
        "bubble": "bubble 10s ease-in-out infinite",
        "scan": "scan 4s ease-in-out infinite",
        "float": "float 12s ease-in-out infinite",
        "spin-fast": "spin 0.8s linear infinite",
        "spin-half": "spin 1.5s linear infinite",
        "spin-slow": "spin 2s linear infinite",
        "flash": "flash 2s linear infinite",
        "arrow": "arrow 1.5s linear infinite",
        "ripple": "ripple 600ms linear",
        "tv-static": "tv-static 1s steps(8,end) infinite both",
        "loading": "loading 2s ease-in-out infinite",
        "spin-n-grow": "spin-n-grow 1.2s 2s ease-out",
        "flicker": "flicker 2s ease-out 0.15s both",
        "flicker-2": "flicker 1.5s ease-out 0.15s both",
      },
      "keyframes": {
        ...extend.keyframes,
        "marquee": {
          "0%": { "transform": "translateX(0%)" },
          "100%": { "transform": "translateX(-100%)" },
        },
        "marquee2": {
          "0%": { "transform": "translateX(100%)" },
          "100%": { "transform": "translateX(0%)" },
        },
        "wave": {
          "0%": { "transform": "translateX(0)" },
          "100%": { "transform": "translateX(-50%)" },
        },
        "bubble": {
          "0%": {
            "transform": "translateY(5%)",
            "opacity": 0.1,
          },
          "70%": {
            "transform": "translateX(2.5%)",
          },
          "80%": {
            "opacity": 0,
          },
          "100%": {
            "transform": "translateY(-160vh)",
            "opacity": 0,
          },
        },
        "scan": {
          "0%": {
            "transform": "translateY(0px)",
            "opacity": 0.4,
          },
          "50%": {
            "transform": "translateY(75px)",
            "opacity": 1,
          },
          "100%": {
            "transform": "translateY(0px)",
            "opacity": 0.4,
          },
        },
        "float": {
          "0%": { "transform": "translateY(0)" },
          "50%": { "transform": "translateY(-15px)" },
          "100%": { "transform": "translateY(0)" },
        },
        "loading": {
          "0%": { "transform": "translateX(0)" },
          "17%": { "transform": "translateX(100%)" },
          "33%": { "transform": "translateX(100%)" },
          "50%": { "transform": "translateX(0)" },
          "67%": { "transform": "translateX(-100%)" },
          "83%": { "transform": "translateX(-100%)" },
          "100%": { "transform": "translateX(0%)" },
        },
        "spin-n-grow": {
          "0%": { "transform": "scale(0); rotate(290deg);" },
          "100%": { "transform": "scale(1); rotate(0deg);" },
        },
        "arrow": {
          "0%": { "transform": "translateX(0px)" },
          "50%": { "transform": "translateX(110%)" },
          "50.01%": { "transform": "translateX(-110%)" },
          "100%": { "transform": "translateX(0px)" },
        },
        "ripple": {
          "to": { "transform": "scale(4)", "opacity": "0" },
        },
        "flash": {
          "0%": { "opacity": "100%" },
          "24%": { "opacity": "100%" },
          "25%": { "opacity": "0%" },
          "26%": { "opacity": "0%" },
          "74%": { "opacity": "0%" },
          "75%": { "opacity": "100%" },
          "76%": { "opacity": "100%" },
          "100%": { "opacity": "100%" },
        },
        "tv-static": {
          "0%": {
            "transform": "translateX(0px,0px)",
          },
          "10%": {
            "transform": "translate(-100px, 100px)",
          },
          "20%": {
            "transform": "translate(150px, -100px)",
          },
          "30%": {
            "transform": "translate(-100px,100px)",
          },
          "40%": {
            "transform": "translate(100px, -150px)",
          },
          "50%": {
            "transform": "translate(-100px, 200px)",
          },
          "60%": {
            "transform": "translate(-200px, -100px)",
          },
          "70%": {
            "transform": "translateY(50px, 100px)",
          },
          "80%": {
            "transform": "translate(100px, -150px)",
          },
          "90%": {
            "transform": "translate(0px, 200px)",
          },
          "100%": {
            "transform": "translate(-100px, 100px)",
          },
        },
        "flicker": {
          "0%": {
            "opacity": 0,
          },
          "10%": {
            "opacity": 0,
          },
          "10.1%": {
            "opacity": 1,
          },
          "20.6%": {
            "opacity": 0,
          },
          "30%": {
            "opacity": 0,
          },
          "30.1%": {
            "opacity": 1,
          },
          "30.5%": {
            "opacity": 1,
          },
          "30.6%": {
            "opacity": 0,
          },
          "50%": {
            "opacity": 1,
          },
          "55%": {
            "opacity": 1,
          },
          "55.1%": {
            "opacity": 0,
          },
          "60%": {
            "opacity": 1,
          },
          "60.1%": {
            "opacity": 0,
          },
          "65%": {
            "opacity": 0,
          },
          "65.1%": {
            "opacity": 1,
          },
          "77%": {
            "opacity": 0,
          },
          "77.1%": {
            "opacity": 1,
          },
          "85%": {
            "opacity": 1,
          },
          "85.1%": {
            "opacity": 0,
          },
          "100%": {
            "opacity": 1,
          },
        },
      },
    },
  },
  "variants": {},
  "plugins": [
    require("@tailwindcss/forms"),
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          "text-shadow": value => ({
            "textShadow": value,
          }),
        },
        { "values": theme("textShadow") }
      );
    }),
  ],
};
