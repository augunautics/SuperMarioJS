export const Constants = {
  canvasWidth: 800,
  canvasHeight: 600,
  worldWidth: 3200, // (or whichever value you need for horizontal scrolling)
  gravity: 0.3,
  playerWidth: 32, // assuming we scaled player from 16 to 32
  playerHeight: 32,
  playerStartX: 50,
  playerStartY: 0,
  jumpVelocity: -10,
  moveSpeed: 2,
  clockSpeed: 1,
  OVERWORLD_HEIGHT: 240, // Native height of the upperworld (15 tiles * 16px)
  SKY_OFFSET: 120,       // Constant for the top sky area (in pixels)
  SCALE: 2               // Fixed scale factor (e.g., 2 so 16x16 becomes 32x32)
};
