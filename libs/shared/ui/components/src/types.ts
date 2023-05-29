export interface ErrorBoundaryProps {
  error: Error;
  reset: () => void;
}

export type ModalReference = {
  opened: boolean;
  open: () => void;
  close: () => void;
};


export type ColorSchemeTypes = "primary" | "secondary" | "light";
export const ColorSchemeTypes = { PRIMARY:  "primary" as ColorSchemeTypes,
SECONDARY: "secondary" as ColorSchemeTypes, LIGHT: "light" as ColorSchemeTypes };