<script>
  import ModalDialog from './ModalDialog.svelte';

  let open = false;
</script>

<button type="button" on:click={() => (open = true)}>Show modal</button>
<ModalDialog
  {open}
  title="Modal Title"
  on:close={() => (open = false)}
>
  <p>One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections.</p>
</ModalDialog>

