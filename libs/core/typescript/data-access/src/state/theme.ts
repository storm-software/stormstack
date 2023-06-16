import { isDevelopment } from "@open-system/core-utilities";
import { atom } from "jotai";
import { atomWithToggle } from "../utilities/atomWithToggle";

export const isDarkModeAtom = atom(true); // atomWithWebStorage<boolean>("dark", true);
if (isDevelopment()) {
  isDarkModeAtom.debugPrivate = true;
}

export const toggleDarkModeAtom = atomWithToggle(isDarkModeAtom);
if (isDevelopment()) {
  toggleDarkModeAtom.debugPrivate = true;
}

export const themeAtom = atom("open-system"); // atomWithWebStorage<string>("theme", "open-system");
if (isDevelopment()) {
  themeAtom.debugPrivate = true;
}
