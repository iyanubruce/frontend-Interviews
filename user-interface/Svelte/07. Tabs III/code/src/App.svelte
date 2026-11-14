<script>
  import Tabs from './Tabs.svelte';

  const items = [
    {
      value: 'html',
      label: 'HTML',
      panel:
        'The HyperText Markup Language or HTML is the standard markup language for documents designed to be displayed in a web browser.',
    },
    {
      value: 'css',
      label: 'CSS',
      panel:
        'Cascading Style Sheets is a style sheet language used for describing the presentation of a document written in a markup language such as HTML or XML.',
    },
    {
      value: 'javascript',
      label: 'JavaScript',
      panel:
        'JavaScript, often abbreviated as JS, is a programming language that is one of the core technologies of the World Wide Web, alongside HTML and CSS.',
    },
  ];
</script>

<div class="wrapper">
  <button>A focusable element</button>
  <Tabs {items} />
  <button>Some other focusable element</button>
</div>

<style>
  .wrapper { display: flex; flex-direction: column; gap: 16px; }
</style>
