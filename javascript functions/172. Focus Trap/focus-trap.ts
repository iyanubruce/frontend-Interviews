export type FocusTrap = {
  activate: () => void;
  deactivate: () => void;
};

export default function createFocusTrap(container: HTMLElement): FocusTrap {
  throw new Error("Not implemented!");
}
