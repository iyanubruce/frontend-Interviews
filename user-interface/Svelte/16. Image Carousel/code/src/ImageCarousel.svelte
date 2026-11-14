<script>
  export let images;
</script>

<div>
  {#each images as image (image.src)}
    <img src={image.src} alt={image.alt} width="100%" />
  {/each}
</div>

