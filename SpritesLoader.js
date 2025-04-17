// SpritesLoader.js
export class SpritesLoader {
  constructor(url, frameWidth, frameHeight) {
    this.image      = new Image();
    this.frameW     = frameWidth;
    this.frameH     = frameHeight;
    this.animations = {};
    this.ready      = false;

    // Mark ready when the sheet finishes loading
    this.image.onload = () => {
      this.ready = true;
    };

    this.image.src = url;
  }

  define(name, frames, row, interval = 100) {
    this.animations[name] = { frames, row, interval };
  }

  getFrame(name, state) {
    const anim = this.animations[name];
    if (!anim) throw new Error(`No animation: ${name}`);
    const idx = state.frameIndex % anim.frames.length;
    const fn  = anim.frames[idx];
    return {
      sx: fn * this.frameW,
      sy: anim.row * this.frameH,
      sw: this.frameW,
      sh: this.frameH,
      interval: anim.interval
    };
  }
}
