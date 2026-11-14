<script>
  import ModalDialog from './ModalDialog.svelte';

  let open = false;
</script>

<button type="button" on:click={() => (open = true)}>Show modal</button>
<ModalDialog
  {open}
  title="Feedback"
  on:close={() => (open = false)}
>
  <div class="contents">
    <div>Provide your feedback, we will get back in 3-5 business days.</div>
    <input placeholder="john@gmail.com" />
    <textarea placeholder="Your message here" rows="5"></textarea>
    <button type="button">Submit</button>
  </div>
</ModalDialog>

