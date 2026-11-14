# Image Carousel III

**Difficulty:** Hard · **Duration:** ~40 min · **Topics:** A11y, Performance, State management

> Source: [image-carousel-iii](https://www.greatfrontend.com/questions/user-interface/image-carousel-iii/react)

## Description

**Note:** This is a follow-up to the [Image Carousel](https://www.greatfrontend.com/questions/user-interface/image-carousel) question; you should complete that question first before attempting this question.

Build an image carousel that displays a sequence of images, smoothly transitioning when navigating between images.

The main difference between this question and [Image Carousel II](https://www.greatfrontend.com/questions/user-interface/image-carousel-ii) is that there should only be a **maximum of two image elements** in the DOM at any time. This improves performance because the number of image elements present in the DOM is no longer proportional to the number of images, and the image carousel does not unnecessarily load images that aren't shown. However, this approach comes at the cost of higher implementation complexity.

### Requirements

- All requirements of the [Image Carousel](https://www.greatfrontend.com/questions/user-interface/image-carousel) question should be supported.
- Upon clicking the Prev/Next buttons, the current image should smoothly translate out while the next image enters. The translation direction is left/right, respectively.
- Navigation interactions during an ongoing transition should not start overlapping transitions.
- Transitions when clicking the page buttons are optional but highly encouraged. Aim to reuse the transitioning code for the Prev/Next buttons.
  - Selecting the currently active page should not change or animate the carousel.
- There should only be a **maximum of two image elements** in the DOM at any time.

Click the "See what you are building" button to see a preview of the result.

### Notes

The skeleton code uses the solution of [Image Carousel](https://www.greatfrontend.com/questions/user-interface/image-carousel), but you are free to use your own solution as a starting point.

## Project structure

```
├── public
│   └── index.html
├── src
│   ├── app.tsx
│   ├── image-carousel.tsx
│   ├── index.tsx
│   └── styles.css
├── package.json
└── tsconfig.json
```

- `code/` – starter files for the question.
- `solution/` – reference solution files.

## Asked at these companies

- Airbnb
- Amazon
- Bytedance
- Google
- Doordash
- Dropbox
- Microsoft
- Snap
- Squarespace
- Tiktok
