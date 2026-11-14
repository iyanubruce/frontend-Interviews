# useMediaQuery

**Difficulty:** Medium

## Description

Implement a `useMediaQuery` hook that subscribes to and responds to media query changes (e.g. screen size, resolution, orientation, etc.).

## Examples

```js
export default function Component() {
  const isSmallDevice = useMediaQuery('only screen and (max-width: 768px)');

  return <div>{isSmallDevice && <a href="#">Menu</a>}</div>;
}
```

## Arguments

- `query: string`: The media query to match. It must be a [valid CSS media query string](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries)

## Returns

The hook returns a boolean value that indicates whether the media query matches.

## Notes

- The initial return value should come from `window.matchMedia(query).matches`.
- Subscribe to the current query's `change` event and update state when it changes.
- If `query` changes, unsubscribe from the old `MediaQueryList` and subscribe to the new one.
- You do not need a separate `resize` listener.

## Files

| File | Contents |
| --- | --- |
| `use-media-query.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
