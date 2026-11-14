import { ComponentProps, RefObject, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function ModalDialog({
  open = false,
  ...props
}: Readonly<{
  open?: boolean;
}> &
  ComponentProps<typeof ModalDialogImpl>) {
  if (!open) {
    return null;
  }

  return <ModalDialogImpl {...props} />;
}

/**
 * Invokes a function when a key is pressed.
 */
function useOnKeyDown(key: string, fn: (event: KeyboardEvent) => void) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === key) {
        fn(event);
      }
    }

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [fn]);
}

/**
 * Invokes a function when clicking outside an element.
 */
function useOnClickOutside(
  elRef: RefObject<HTMLDivElement | null>,
  fn: () => void,
) {
  // Add event handling for close when clicking outside.
  useEffect(() => {
    function onClickOutside(event: MouseEvent | TouchEvent) {
      // No-op if clicked element is a descendant of element's contents.
      if (
        event.target instanceof Node &&
        elRef.current != null &&
        !elRef.current?.contains(event.target)
      ) {
        fn();
      }
    }

    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('touchstart', onClickOutside);

    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('touchstart', onClickOutside);
    };
  }, [fn]);
}

function getTabbableElements(elRef: RefObject<HTMLDivElement | null>) {
  if (elRef.current == null) {
    return [];
  }

  return Array.from(
    elRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]',
    ),
  ).filter((element) => {
    const { visibility } = window.getComputedStyle(element);
    return (
      !element.matches(':disabled') &&
      element.getAttribute('aria-disabled') !== 'true' &&
      element.closest('[aria-hidden="true"]') == null &&
      element.tabIndex >= 0 &&
      visibility !== 'hidden' &&
      visibility !== 'collapse' &&
      element.getClientRects().length > 0
    );
  });
}

/**
 * Focus on the first tabbable element on mount.
 */
function useFocusOnFirstTabbableElement(
  elRef: RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    const tabbableElements = getTabbableElements(elRef);
    (tabbableElements[0] ?? elRef.current)?.focus();
  }, []);
}

/**
 * Trap focus within an element.
 */
function useFocusTrap(elRef: RefObject<HTMLDivElement | null>) {
  function trapFocus(event: KeyboardEvent) {
    if (elRef.current == null) {
      return;
    }

    const tabbableElements = getTabbableElements(elRef);
    if (tabbableElements.length === 0) {
      event.preventDefault();
      elRef.current.focus();
      return;
    }

    const firstElement = tabbableElements[0];
    const lastElement = tabbableElements[tabbableElements.length - 1];

    if (tabbableElements.length === 1) {
      event.preventDefault();
      firstElement.focus();
      return;
    }

    if (event.shiftKey) {
      // Shift + Tab event
      if (
        document.activeElement === firstElement &&
        lastElement instanceof HTMLElement
      ) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab event
      if (
        document.activeElement === lastElement &&
        firstElement instanceof HTMLElement
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  useOnKeyDown('Tab', trapFocus);
}

/**
 * Retain reference to trigger element and focus that element when closed.
 */
function useReturnFocusToTrigger() {
  const triggerElRef = useRef<Element | null>(null);

  useEffect(() => {
    // Save a reference to the focused element when mounted.
    triggerElRef.current = document.activeElement;

    return () => {
      if (triggerElRef.current instanceof HTMLElement) {
        // Focuses on element when unmounted.
        triggerElRef.current.focus();
      }
    };
  }, []);
}

function ModalDialogImpl({
  children,
  title,
  onClose,
}: Readonly<{
  children: React.ReactNode;
  title: string;
  onClose: () => void;
}>) {
  const titleId = useId();
  const contentId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  // Closing-related hooks.
  useOnKeyDown('Escape', onClose);
  useOnClickOutside(dialogRef, onClose);

  // Focus-related hooks.
  useReturnFocusToTrigger(); // Has to be called before useFocusOnFirstTabbableElement otherwise the focus is lost.
  useFocusOnFirstTabbableElement(dialogRef);
  useFocusTrap(dialogRef);

  return createPortal(
    <div className="modal-overlay">
      <div
        aria-describedby={contentId}
        aria-labelledby={titleId}
        aria-modal="true"
        className="modal"
        role="dialog"
        ref={dialogRef}
        tabIndex={-1}>
        <h1 className="modal-title" id={titleId}>
          {title}
        </h1>
        <div id={contentId}>{children}</div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body,
  );
}
