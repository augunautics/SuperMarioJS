export class TileMap {
  constructor(jsonData) {
    this.data = jsonData;
    this.groundObjects = null;
    this.platformObjects = null; // Objects from the platform layer.
    this.mysteryObjects = null; // Objects from the mystery layer.

    if (jsonData.layers) {
      for (const layer of jsonData.layers) {
        // Find the ground layer.
        if (
          layer.type === 'objectgroup' &&
          layer.name.toLowerCase() === 'ground'
        ) {
          this.groundObjects = layer.objects;
        }

        // Find the platform layer.
        if (
          layer.type === 'objectgroup' &&
          layer.name.toLowerCase() === 'platform'
        ) {
          this.platformObjects = layer.objects;
        }

        // Find the mystery layer.
        if (
          layer.type === 'objectgroup' &&
          layer.name.toLowerCase() === 'mystery'
        ) {
          this.mysteryObjects = layer.objects;
        }
      }
    }

    if (!this.groundObjects) {
      console.error("No object layer named 'ground' was found in the JSON.");
    }
    if (!this.platformObjects) {
      console.warn("No object layer named 'platform' was found in the JSON.");
    }
    if (!this.mysteryObjects) {
      console.warn("No object layer named 'mystery' was found in the JSON.");
    }
  }

  /**
   * Draws red outlines around each collision object in the ground layer.
   *
   * @param {CanvasRenderingContext2D} ctx - The canvas context.
   * @param {number} scale - The scale factor (default: 2).
   * @param {number} yOffset - Vertical offset to apply (in pixels).
   */
  drawGroundBox(ctx, scale = 2, yOffset = 0) {
    if (!this.groundObjects) return;

    ctx.strokeStyle = 'red';
    ctx.lineWidth = 3;

    for (const obj of this.groundObjects) {
      // Use a default height of 16 if obj.height is 0.
      const nativeHeight = obj.height === 0 ? 16 : obj.height;
      const x = obj.x * scale;
      const y = obj.y * scale + yOffset;
      const width = obj.width * scale;
      const height = nativeHeight * scale;

      ctx.strokeRect(x, y, width, height);
    }
  }

  /**
   * Draws blue outlines around each platform object.
   *
   * @param {CanvasRenderingContext2D} ctx - The canvas context.
   * @param {number} scale - The scale factor (default: 2).
   * @param {number} yOffset - Vertical offset to apply (in pixels).
   */
  drawBrickBox(ctx, scale = 2, yOffset = 0) {
    if (!this.platformObjects) return;

    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 3;

    for (const obj of this.platformObjects) {
      // Use a default height of 16 if obj.height is 0.
      const nativeHeight = obj.height === 0 ? 16 : obj.height;
      const x = obj.x * scale;
      const y = obj.y * scale + yOffset;
      const width = obj.width * scale;
      const height = nativeHeight * scale;

      ctx.strokeRect(x, y, width, height);
    }
  }

  /**
   * Draws purple outlines around each mystery object.
   *
   * @param {CanvasRenderingContext2D} ctx - The canvas context.
   * @param {number} scale - The scale factor (default: 2).
   * @param {number} yOffset - Vertical offset to apply (in pixels).
   */
  drawMysteryBox(ctx, scale = 2, yOffset = 0) {
    if (!this.mysteryObjects) return;

    ctx.strokeStyle = 'purple';
    ctx.lineWidth = 3;

    for (const obj of this.mysteryObjects) {
      // Use a default height of 16 if obj.height is 0.
      const nativeHeight = obj.height === 0 ? 16 : obj.height;
      const x = obj.x * scale;
      const y = obj.y * scale + yOffset;
      const width = obj.width * scale;
      const height = nativeHeight * scale;

      ctx.strokeRect(x, y, width, height);
    }
  }
}
