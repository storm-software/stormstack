export interface ErrorBoundaryProps {
  error: Error;
  reset: () => void;
}

export type ModalReference = {
  opened: boolean;
  open: () => void;
  close: () => void;
};
