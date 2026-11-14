import './styles.css';

let nextModalId = 0;

function modalDialog(options) {
  const id = ++nextModalId;
  const titleId = 'modal-title-' + id;
  const contentId = 'modal-content-' + id;
  const triggerElement = document.activeElement;
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML =
    '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="' +
    titleId +
    '" aria-describedby="' +
    contentId +
    '"' +
    ' tabindex="-1"><h1 class="modal-title" id="' +
    titleId +
    '"' +
    '>' +
    options.title +
    '</h1><div id="' +
    contentId +
    '"' +
    '>' +
    options.content +
    '</div><button class="modal-close" type="button">Close</button></div>';

  const dialogElement = overlay.querySelector('.modal');

  function getTabbableElements() {
    return Array.from(
      dialogElement.querySelectorAll(
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

  function destroy() {
    document.removeEventListener('keydown', onKeyDown);
    overlay.remove();
    if (triggerElement instanceof HTMLElement) triggerElement.focus();
    options.onClose();
  }

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      destroy();
      return;
    }
    if (event.key !== 'Tab') {
      return;
    }
    const elements = getTabbableElements();
    if (elements.length === 0) {
      event.preventDefault();
      dialogElement.focus();
      return;
    }

    const firstElement = elements[0];
    const lastElement = elements[elements.length - 1];
    if (elements.length === 1) {
      event.preventDefault();
      firstElement.focus();
      return;
    }
    if (
      (event.shiftKey && document.activeElement === firstElement) ||
      (!event.shiftKey && document.activeElement === lastElement)
    ) {
      event.preventDefault();
      (event.shiftKey ? lastElement : firstElement).focus();
    }
  }

  overlay.querySelector('.modal-close').addEventListener('click', destroy);
  overlay.addEventListener('mousedown', (event) => {
    if (!dialogElement.contains(event.target)) {
      destroy();
    }
  });
  document.addEventListener('keydown', onKeyDown);
  document.body.append(overlay);
  const firstTabbableElement = getTabbableElements()[0];
  (firstTabbableElement != null ? firstTabbableElement : dialogElement).focus();
}

const app = document.querySelector('#app');
app.innerHTML = '<button type="button">Show modal</button>';
app.querySelector('button').addEventListener('click', () => {
  modalDialog({
    title: 'Feedback',
    content:
      '<div class="contents"><div>Provide your feedback, we will get back in 3-5 business days.</div><input placeholder="john@gmail.com" /><textarea placeholder="Your message here" rows="5"></textarea><button type="button">Submit</button></div>',
    onClose() {},
  });
});
