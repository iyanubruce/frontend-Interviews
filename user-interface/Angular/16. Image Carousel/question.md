# Image Carousel

**Difficulty:** Medium · **Duration:** ~30 min · **Topics:** A11y

> Source: [image-carousel](https://www.greatfrontend.com/questions/user-interface/image-carousel/angular)

## Description

Build an image carousel that displays a sequence of images.

### Requirements

- The image carousel component takes an array of image URLs. Example image URLs are provided in the skeleton code.
- Layout and positioning:
  - The image carousel should be centered on the screen with a maximum size of 600px by 400px.
  - Images should shrink to fit within the carousel so that the entire image is visible. Empty parts of the carousel can be filled with black.
  - If the screen width is smaller than the image, the carousel should be resized to fit within the available horizontal space.
- Navigation:
  - Display the first image in the array initially.
  - Add left/right navigation buttons to allow the user to navigate through the images. The buttons should support cycling behavior, i.e., after the last image, the image cycles back to the first.
  - Add page buttons at the bottom to directly jump to an image. You may assume there will be fewer than 10 images.
- Animations and transitions are not necessary for this question; they will be explored in [Image Carousel II](https://www.greatfrontend.com/questions/user-interface/image-carousel-ii) and [Image Carousel III](https://www.greatfrontend.com/questions/user-interface/image-carousel-iii).

For this question, there is a technical restriction that only one image element should be in the DOM at any time.

## Project structure

```
├── src
│   ├── app
│   │   ├── app.component.ts
│   │   ├── app.module.ts
│   │   └── image-carousel.component.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── angular.json
├── package.json
├── tsconfig.app.json
├── tsconfig.json
└── tsconfig.spec.json
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
- Netflix
- Apple
- Canva
- Pinterest
- Shopify

## Next questions

- [Image Carousel II](../17.%20Image%20Carousel%20II/question.md) – Medium
- [Image Carousel III](../18.%20Image%20Carousel%20III/question.md) – Hard
