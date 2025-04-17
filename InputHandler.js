export class InputHandler {
  constructor() {
    this.left = false;
    this.right = false;
    this.jump = false; // This flag triggers a jump edge event.
    this.jumpDown = false; // Tracks if Space is currently held down.

    window.addEventListener('keydown', (e) => {
      switch (e.code) {
        case 'KeyA':
          this.left = true;
          break;
        case 'KeyD':
          this.right = true;
          break;
        case 'Space':
          // Only set jump if Space is not already held down.
          if (!this.jumpDown) {
            this.jump = true;
            this.jumpDown = true;
          }
          break;
      }
    });

    window.addEventListener('keyup', (e) => {
      switch (e.code) {
        case 'KeyA':
          this.left = false;
          break;
        case 'KeyD':
          this.right = false;
          break;
        case 'Space':
          // When Space is released, reset jumpDown so a new jump can be triggered.
          this.jumpDown = false;
          break;
      }
    });
  }
}
