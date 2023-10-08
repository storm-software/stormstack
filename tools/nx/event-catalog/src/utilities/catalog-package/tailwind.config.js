const { createGlobPatternsForDependencies } = require("@nx/react/tailwind");
const { join } = require("path");

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("../../../../tailwind.config.js")],
  content: [
    join(__dirname, "pages/**/*.{js,ts,jsx,tsx}"),
    join(__dirname, "components/**/*.{js,ts,jsx,tsx}"),
    ...createGlobPatternsForDependencies(__dirname)
  ],
  theme: {
    extend: {}
  },
  variants: {
    extend: {}
  },
  safelist: [
    "bg-red-50",
    "bg-yellow-50",
    "bg-indigo-50",
    "text-red-400",
    "text-yellow-400",
    "text-indigo-400",
    "bg-green-500",
    "bg-indigo-500",
    "bg-yellow-500",
    "bg-purple-100",
    "text-purple-800",
    "bg-pink-100",
    "text-pink-800",
    "bg-green-100",
    "text-green-800",
    "bg-yellow-100",
    "text-yellow-800",
    "bg-blue-100",
    "text-blue-800",
    "bg-indigo-100",
    "text-indigo-800"
  ]
};
