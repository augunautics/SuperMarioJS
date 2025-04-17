import { Constants } from './Constants.js';
import { GameEngine } from './GameEngine.js';

window.addEventListener('load', () => {
  const canvas = document.getElementById('gameCanvas');
  canvas.width = Constants.canvasWidth;
  canvas.height = Constants.canvasHeight;

  // No need to focus the canvas since we use window listeners for input
  const gameEngine = new GameEngine(canvas);

  // Use '+' and '-' keys to control the clock speed and log when '+' is pressed.
  window.addEventListener('keydown', (e) => {
    if (e.key === '+') {
      gameEngine.setClockSpeed(gameEngine.gameSpeed + 0.1);
      console.log("'+' pressed, new clock speed:", gameEngine.gameSpeed);
    } else if (e.key === '-') {
      gameEngine.setClockSpeed(Math.max(0.1, gameEngine.gameSpeed - 0.1));
    }
  });

  // Start the game loop using requestAnimationFrame
  requestAnimationFrame(gameEngine.animate);
});
