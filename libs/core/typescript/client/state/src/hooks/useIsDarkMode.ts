import { useAtom, useAtomValue, useSetAtom } from "jotai/react";
import { isDarkModeAtom } from "../state/theme";

export const useIsDarkMode = () => useAtom(isDarkModeAtom);

export const useIsDarkModeValue = () => useAtomValue<boolean>(isDarkModeAtom);
export const useSetIsDarkMode = () => useSetAtom(isDarkModeAtom);
