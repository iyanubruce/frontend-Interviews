import './styles.css';

let nextModalId = 0;

function modalDialog(options) {
  const id = ++nextModalId;
  const titleId = 'modal-title-' + id;
  const contentId = 'modal-content-' + id;
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML =
    '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="' +
    titleId +
    '" aria-describedby="' +
    contentId +
    '"' +
    '><h1 class="modal-title" id="' +
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

  function destroy() {
    document.removeEventListener('keydown', onKeyDown);
    overlay.remove();

    options.onClose();
  }

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      destroy();
      return;
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
