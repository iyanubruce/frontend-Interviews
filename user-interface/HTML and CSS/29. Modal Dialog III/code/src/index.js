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

  function destroy() {
    overlay.remove();

    options.onClose();
  }

  overlay.querySelector('.modal-close').addEventListener('click', destroy);

  document.body.append(overlay);
}

const app = document.querySelector('#app');
app.innerHTML = '<button type="button">Show modal</button>';
app.querySelector('button').addEventListener('click', () => {
  modalDialog({
    title: 'Modal Title',
    content:
      '<p>One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections.</p>',
    onClose() {},
  });
});
