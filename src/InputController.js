/**
 * Input Controller
 *
 * Handles keyboard input for controlling the drone
 */

class InputController {
  constructor() {
    this.keys = {};
    this.setupEventListeners();
  }

  /**
   * Setup keyboard event listeners
   */
  setupEventListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
      this.keys[e.code] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
      this.keys[e.code] = false;
    });

    // Prevent default behavior for arrow keys and space
    window.addEventListener('keydown', (e) => {
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
    });
  }

  /**
   * Check if a key is currently pressed
   */
  isKeyDown(key) {
    return this.keys[key.toLowerCase()] || this.keys[key] || false;
  }

  /**
   * Process input and control the drone
   */
  processDroneInput(drone) {
    let hasInput = false;

    // Thrust (Space or Arrow Up)
    if (this.isKeyDown('Space') || this.isKeyDown('ArrowUp')) {
      drone.applyThrust(0.7);
      hasInput = true;
    }

    // Forward (W key)
    if (this.isKeyDown('w')) {
      drone.moveForward(0.8);
      hasInput = true;
    }

    // Backward (S key)
    if (this.isKeyDown('s')) {
      drone.moveBackward(0.8);
      hasInput = true;
    }

    // Rotate left (A key or Arrow Left)
    if (this.isKeyDown('a') || this.isKeyDown('ArrowLeft')) {
      drone.rotateCounterClockwise(0.7);
      hasInput = true;
    }

    // Rotate right (D key or Arrow Right)
    if (this.isKeyDown('d') || this.isKeyDown('ArrowRight')) {
      drone.rotateClockwise(0.7);
      hasInput = true;
    }

    return hasInput;
  }

  /**
   * Get all currently pressed keys
   */
  getPressedKeys() {
    return Object.keys(this.keys).filter(key => this.keys[key]);
  }

  /**
   * Clear all key states
   */
  clear() {
    this.keys = {};
  }

  /**
   * Destroy controller and remove listeners
   */
  destroy() {
    this.clear();
    // Note: In a production app, you'd want to store and remove specific listeners
  }
}
