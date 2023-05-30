import { isDevelopment } from "@open-system/core-utilities";
import { atomWithToggle } from "../state/atomWithToggle";
import { atomWithWebStorage } from "../state/atomWithWebStorage";

export const isDarkModeAtom = atomWithWebStorage<boolean>("dark", true);
if (isDevelopment()) {
  isDarkModeAtom.debugPrivate = true;
}

export const toggleDarkModeAtom = atomWithToggle(isDarkModeAtom);
if (isDevelopment()) {
  toggleDarkModeAtom.debugPrivate = true;
}

export const themeAtom = atomWithWebStorage<string>("theme", "open-system");
if (isDevelopment()) {
  themeAtom.debugPrivate = true;
}
