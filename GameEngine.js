import { Constants } from './Constants.js';
import { Player } from './Player.js';
import { InputHandler } from './InputHandler.js';
import { Background } from './Background.js';
import { TileMap } from './TileMap.js';

export class GameEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.player = new Player();
    this.input = new InputHandler();

    // Create the background.
    // Assuming world1-1.png is 5376px wide and 640px tall.
    this.background = new Background('./images/world1-1.png', 5376, 640);

    // Use a fixed scale factor of 2 from Constants.
    this.scale = Constants.SCALE; // should be 2
    // Compute the scaled background width for horizontal clamping.
    this.scaledBgWidth = this.background.imgWidth * this.scale;

    // Load Tiled collision object layer from your JSON.
    this.tileMap = null;
    fetch('./world1-1.json')
      .then((response) => response.json())
      .then((jsonData) => {
        this.tileMap = new TileMap(jsonData);
        console.log('TileMap loaded', this.tileMap);
      })
      .catch((error) => console.error('Error loading world1-1.json:', error));

    this.lastTime = 0;
    this.gameSpeed = Constants.clockSpeed;
    this.animate = this.animate.bind(this);
  }

  animate(timestamp) {
    if (!this.lastTime) this.lastTime = timestamp;
    const deltaTime = (timestamp - this.lastTime) * this.gameSpeed;
    this.lastTime = timestamp;

    this.update(deltaTime);
    this.render();

    requestAnimationFrame(this.animate);
  }

  update(deltaTime) {
    // Update player physics and movement.
    this.player.update(this.input, []);

    // Handle collisions against ground objects from Tiled.
    this.handleGroundCollisions();
    //this.handlePlatformCollisionTop(this.player);
    //this.handlePlatformCollisionBottom(this.player);
    this.handleMysteryBoxCollisionBottom(this.player);
    this.handleMysteryBoxCollisionTop(this.player);

    // If the player falls off the canvas, restart.
    if (this.player.y > this.canvas.height) {
      window.location.reload();
    }
  }

  handleGroundCollisions() {
    if (this.tileMap && this.tileMap.groundObjects) {
      for (const obj of this.tileMap.groundObjects) {
        // If the native height is 0, use a default of 16.
        const nativeHeight = obj.height === 0 ? 16 : obj.height;
        const colliderX = obj.x * this.scale;
        // Calculate colliderY: scale native y and then add SKY_OFFSET.
        const colliderY = obj.y * this.scale + Constants.SKY_OFFSET;
        const colliderWidth = obj.width * this.scale;
        const colliderHeight = nativeHeight * this.scale;

        // Check horizontal overlap.
        if (
          this.player.x < colliderX + colliderWidth &&
          this.player.x + this.player.width > colliderX
        ) {
          // If the player is falling and its bottom is at or below the collider's top,
          // snap the player to that collider.
          if (
            this.player.velY >= 0 &&
            this.player.y + this.player.height >= colliderY
          ) {
            this.player.y = colliderY - this.player.height;
            this.player.velY = 0;
            this.player.onGround = true;
          }
        }
      }
    }
  }

  render() {
    // Calculate cameraX offset so the player appears roughly 1/3 across the screen.
    const desiredPlayerScreenX = this.canvas.width / 3;
    let cameraX = this.player.x - desiredPlayerScreenX;
    if (cameraX < 0) cameraX = 0;
    if (cameraX > this.scaledBgWidth - this.canvas.width) {
      cameraX = this.scaledBgWidth - this.canvas.width;
    }

    // Clear the canvas.
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw the background.
    // The background draws the sky (top SKY_OFFSET) and then the upperworld scaled by 2.
    this.background.drawOverworld(
      this.ctx,
      cameraX,
      this.canvas.width,
      this.canvas.height
    );

    // Translate the context for game objects.
    this.ctx.save();
    this.ctx.translate(-cameraX, 0);

    // Draw the player.
    this.player.draw(this.ctx);

    // Optionally, draw red outlines for debugging collisions.
    if (this.tileMap) {
      this.tileMap.drawGroundBox(this.ctx, this.scale, Constants.SKY_OFFSET);
      this.tileMap.drawBrickBox(this.ctx, this.scale, Constants.SKY_OFFSET);
      this.tileMap.drawMysteryBox(this.ctx, this.scale, Constants.SKY_OFFSET);
    }

    this.ctx.restore();
  }

  setClockSpeed(speed) {
    this.gameSpeed = speed;
  }

  /**
   * Checks for and resolves collisions when the player lands on top of a platform.
   *
   * @param {Object} player - The player object with properties {x, y, width, height, velY, onPlatform}.
   * @param {number} scale - Scale factor for the platform dimensions (default is 2).
   * @param {number} yOffset - Vertical offset to apply (typically Constants.SKY_OFFSET).
   */
  handlePlatformCollisionTop(
    player,
    scale = 2,
    yOffset = Constants.SKY_OFFSET
  ) {
    if (this.tileMap && this.tileMap.platformObjects) {
      for (const obj of this.tileMap.platformObjects) {
        // Determine platform dimensions.
        const nativeHeight = obj.height === 0 ? 16 : obj.height;
        const pX = obj.x * scale;
        const pY = obj.y * scale + yOffset;
        const pW = obj.width * scale;
        const pH = nativeHeight * scale;

        // Check horizontal overlap.
        if (player.x < pX + pW && player.x + player.width > pX) {
          // Check if player's bottom is intersecting the platform's top.
          if (player.y + player.height > pY && player.y < pY) {
            // Resolve top collision: snap player to the top of the platform.
            player.y = pY - player.height;
            player.velY = 0;
            player.onPlatform = true;
          }
        }
      }
    }
  }

  handleMysteryBoxCollisionTop(
    player,
    scale = 2,
    yOffset = Constants.SKY_OFFSET
  ) {
    if (this.tileMap && this.tileMap.mysteryObjects) {
      for (const obj of this.tileMap.mysteryObjects) {
        // Determine mystery box dimensions.
        const nativeHeight = obj.height === 0 ? 16 : obj.height;
        const pX = obj.x * scale;
        const pY = obj.y * scale + yOffset;
        const pW = obj.width * scale;
        const pH = nativeHeight * scale;

        // Check horizontal overlap.
        if (player.x < pX + pW && player.x + player.width > pX) {
          // Check if player's bottom is intersecting the mystery box's top.
          if (player.y + player.height > pY && player.y < pY) {
            // Resolve top collision: snap player to the top of the mystery box.
            player.y = pY - player.height;
            player.velY = 0;
            // Stop horizontal acceleration.
            player.velX = 0;
            player.onPlatform = true;
          }
        }
      }
    }
  }

  /**
   * Checks for and resolves collisions when the player hits the bottom of a platform.
   *
   * @param {Object} player - The player object with properties {x, y, width, height, velY}.
   * @param {number} scale - Scale factor for the platform dimensions (default is 2).
   * @param {number} yOffset - Vertical offset to apply (typically Constants.SKY_OFFSET).
   */
  handlePlatformCollisionBottom(
    player,
    scale = 2,
    yOffset = Constants.SKY_OFFSET
  ) {
    if (this.tileMap && this.tileMap.platformObjects) {
      for (const obj of this.tileMap.platformObjects) {
        const nativeHeight = obj.height === 0 ? 16 : obj.height;
        const pX = obj.x * scale;
        const pY = obj.y * scale + yOffset;
        const pW = obj.width * scale;
        const pH = nativeHeight * scale;

        // Check horizontal overlap.
        if (player.x < pX + pW && player.x + player.width > pX) {
          // Determine if player's top is colliding with the bottom of the platform.
          if (player.y < pY + pH && player.y + player.height > pY + pH) {
            // Resolve bottom collision: push the player below the platform.
            player.y = pY + pH;
            player.velY = 0;
          }
        }
      }
    }
  }

  /**
   * Checks for and resolves collisions when the player hits the bottom of a platform.
   * If such a collision is detected, the platform is removed from the TileMap.
   *
   * @param {Object} player - The player object with properties {x, y, width, height, velY}.
   * @param {number} scale - Scale factor for the platform dimensions (default is 2).
   * @param {number} yOffset - Vertical offset to apply (typically Constants.SKY_OFFSET).
   */
  handleMysteryBoxCollisionBottom(player) {
    const scale = Constants.SCALE;
    if (this.tileMap && this.tileMap.mysteryObjects) {
      // Iterate in reverse order so removal doesn't interfere with the loop.
      for (let i = this.tileMap.mysteryObjects.length - 1; i >= 0; i--) {
        const obj = this.tileMap.mysteryObjects[i];
        const nativeHeight = obj.height === 0 ? 16 : obj.height;
        const pX = obj.x * scale;
        const pY = obj.y * scale + Constants.SKY_OFFSET;
        const pW = obj.width * scale;
        const pH = nativeHeight * scale;

        // Check horizontal overlap.
        if (player.x < pX + pW && player.x + player.width > pX) {
          // Check for collision from below:
          // - The player's top is above the bottom edge of the mystery object.
          // - The player's bottom is below that edge.
          // - The player is moving upward (velY < 0).
          if (
            player.velY < 0 &&
            player.y < pY + pH &&
            player.y + player.height > pY + pH
          ) {
            // Resolve collision: push the player to just below the mystery box.
            player.y = pY + pH;
            player.velY = 0;

            // Remove the mystery object from the TileMap.
            this.tileMap.mysteryObjects.splice(i, 1);
          }
        }
      }
    }
  }
}