import { Constants } from './Constants.js';

export class Background {
  /**
   * @param {string} imagePath  - path to your world1-1.png image.
   * @param {number} imgWidth   - total width of the entire image (e.g., 5376).
   * @param {number} imgHeight  - total height of the entire image (e.g., 640 or more).
   */
  constructor(imagePath, imgWidth, imgHeight) {
    this.image = new Image();
    this.image.src = imagePath;
    this.loaded = false;

    this.imgWidth = imgWidth; // e.g., 5376
    this.imgHeight = imgHeight; // e.g., 640

    // Use the native overworld height from Constants (e.g., 240).
    this.OVERWORLD_HEIGHT = Constants.OVERWORLD_HEIGHT;

    // Set a default sky color in case sampling fails.
    this.skyColor = '#80c9ff';

    this.image.onload = () => {
      this.loaded = true;
      // Create an offscreen canvas to sample the color from the top 16x16 at (0,0).
      const offCanvas = document.createElement('canvas');
      offCanvas.width = 16;
      offCanvas.height = 16;
      const offCtx = offCanvas.getContext('2d');
      // Draw the first 16x16 area of the image onto the offscreen canvas.
      offCtx.drawImage(this.image, 0, 0, 16, 16, 0, 0, 16, 16);
      // Get the color of the first pixel.
      const imageData = offCtx.getImageData(0, 0, 1, 1).data; // [R, G, B, A]
      // Convert the pixel data to a CSS rgba string.
      this.skyColor = `rgba(${imageData[0]}, ${imageData[1]}, ${
        imageData[2]
      }, ${imageData[3] / 255})`;
      console.log('Sky color sampled:', this.skyColor);
    };

    this.image.onerror = (err) => {
      console.error('Error loading background:', err);
    };
  }

  /**
   * Draws the overworld (the top OVERWORLD_HEIGHT of the image) scaled by a fixed factor of 2,
   * and then drawn starting at y = SKY_OFFSET so that the brick area (OVERWORLD_HEIGHT * 2 = 480px) fills
   * the bottom of a 600px-tall canvas.
   *
   * @param {CanvasRenderingContext2D} ctx - The canvas 2D context.
   * @param {number} cameraX   - The horizontal offset (in screen coordinates).
   * @param {number} canvasWidth - The canvas width (e.g., 800).
   * @param {number} canvasHeight - The canvas height (e.g., 600).
   */
  drawOverworld(ctx, cameraX, canvasWidth, canvasHeight) {
    if (!this.loaded) return;

    const fixedScale = Constants.SCALE; // Using constant scale defined in Constants.js

    // Native overworld slice:
    const overworldSourceY = 0;
    const overworldSourceH = this.OVERWORLD_HEIGHT; // 240px

    // When scaled by 2, the overworld becomes 240 * 2 = 480px tall.
    // Fill the top SKY_OFFSET portion of the canvas with the sampled sky color.
    ctx.fillStyle = this.skyColor;
    ctx.fillRect(0, 0, canvasWidth, Constants.SKY_OFFSET);

    // The horizontal slice width from the source needed to fill the canvas:
    const sourceW = canvasWidth / fixedScale; // e.g., 800/2 = 400px
    // Convert cameraX from final screen coords to the source image's coordinate space.
    const sourceX = cameraX / fixedScale;

    // Draw the upper world portion scaled by the fixed scale,
    // and drawn starting at y = SKY_OFFSET to fill the remainder of the canvas.
    ctx.drawImage(
      this.image,
      sourceX, // source X in the image
      overworldSourceY, // source Y = 0 (top OVERWORLD_HEIGHT)
      sourceW, // source width to sample
      overworldSourceH, // source height (240px)
      0, // destination X on canvas
      Constants.SKY_OFFSET, // destination Y on canvas (after sky)
      canvasWidth, // destination width (800)
      canvasHeight - Constants.SKY_OFFSET // destination height (600 - SKY_OFFSET)
    );
  }
}
