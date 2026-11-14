# Image Carousel II

**Difficulty:** Medium · **Duration:** ~30 min · **Topics:** A11y, State management

> Source: [image-carousel-ii](https://www.greatfrontend.com/questions/user-interface/image-carousel-ii/vanilla)

## Description

**Note:** This is a follow-up to the [Image Carousel](https://www.greatfrontend.com/questions/user-interface/image-carousel) question. You should complete that question first before attempting this one.

Build an image carousel that displays a sequence of images, smoothly transitioning when navigating between images.

### Requirements

- All requirements of the [Image Carousel](https://www.greatfrontend.com/questions/user-interface/image-carousel) question should be supported.
- The one-image DOM restriction from the original question does not apply. This version can render every image in one strip so the outgoing and incoming images move together.
- Upon clicking the Prev/Next buttons, the current image should smoothly translate out while the next image enters. The translation direction is left/right, respectively.
- Navigation interactions during an ongoing transition should not start overlapping transitions.
- Transitions when clicking the page buttons are optional but highly encouraged. Aim to reuse the transitioning code for the Prev/Next buttons.

Click the "See what you are building" button to see a preview of the result.

### Notes

The skeleton code uses the solution of [Image Carousel](https://www.greatfrontend.com/questions/user-interface/image-carousel), but you are free to use your own solution as a starting point.

## Project structure

```
├── src
│   ├── index.js
│   └── styles.css
├── index.html
└── package.json
```

- `code/` – starter files for the question.
- `solution/` – reference solution files.

## Asked at these companies

- Airbnb
- Amazon
- Google
- Doordash
- Dropbox
- Microsoft
- Snap
- Squarespace
- Bytedance
- Tiktok

## Next questions

- [Image Carousel III](../18.%20Image%20Carousel%20III/question.md) – Hard
