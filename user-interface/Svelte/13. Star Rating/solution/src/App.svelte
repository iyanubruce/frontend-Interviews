<script>
  import StarRating from './StarRating.svelte';

  let primaryRating = 3;
  let secondaryRating = 5;
</script>

<StarRating
  max={5}
  value={primaryRating}
  onChange={(value) => (primaryRating = value)} />
<p>Selected rating: {primaryRating}</p>

<StarRating
  max={10}
  value={secondaryRating}
  onChange={(value) => (secondaryRating = value)} />
<p>Selected rating: {secondaryRating}</p>
