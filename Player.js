import { Constants } from './Constants.js';

export class Player {
  constructor() {
    this.width = Constants.playerWidth;
    this.height = Constants.playerHeight;
    this.x = Constants.playerStartX;
    this.y = Constants.playerStartY;
    this.velX = 0;
    this.velY = 0;
    this.onGround = false;
  }

  update(input, platforms) {
    // Horizontal movement
    if (this.onGround || this.onPlatform) {
      if (input.left) {
        this.velX = -Constants.moveSpeed;
      } else if (input.right) {
        this.velX = Constants.moveSpeed;
      } else {
        this.velX = 0;
      }
    } else {
      if (input.left) {
        this.velX = -Constants.moveSpeed;
      } else if (input.right) {
        this.velX = Constants.moveSpeed;
      }
    }
  
    // Jump:
    // Allow jump if the player is standing on the ground or a platform.
    if (input.jump && (this.onGround || this.onPlatform)) {
      this.velY = Constants.jumpVelocity;
      // Clear both states so the jump is allowed and collision won't override it.
      this.onGround = false;
      this.onPlatform = false;
      input.jump = false;
    }
  
    // Apply gravity
    this.velY += Constants.gravity;
    this.x += this.velX;
    this.y += this.velY;
  
    // Horizontal clamp
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > Constants.worldWidth) {
      this.x = Constants.worldWidth - this.width;
    }
  
    let collided = false;
    // Process collision against generic platforms passed in.
    for (const platform of platforms) {
      if (
        this.x < platform.x + platform.width &&
        this.x + this.width > platform.x
      ) {
        // Landing
        if (
          this.y + this.height >= platform.y &&
          this.y + this.height - this.velY <= platform.y
        ) {
          this.y = platform.y - this.height;
          this.velY = 0;
          collided = true;
          this.onGround = true;
        }
        // Head collision
        if (this.velY < 0) {
          if (
            this.y <= platform.y + platform.height &&
            this.y - this.velY >= platform.y + platform.height
          ) {
            this.y = platform.y + platform.height;
            this.velY = 0;
          }
        }
      }
    }
    if (!collided) {
      this.onGround = false;
    }
  }
  

  draw(ctx) {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
