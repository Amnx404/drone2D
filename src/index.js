/**
 * Drone Physics Simulator
 * Main application entry point
 */

class DroneSimulator {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      throw new Error(`Canvas with id "${canvasId}" not found`);
    }

    // Set canvas size
    this.canvas.width = 800;
    this.canvas.height = 600;

    // Initialize components
    this.physicsWorld = new PhysicsWorld(this.canvas.width, this.canvas.height);
    this.renderer = new Renderer(this.canvas, this.physicsWorld.getEngine());
    this.inputController = new InputController();

    // Create drone
    this.drone = new Drone(
      this.physicsWorld.getWorld(),
      this.canvas.width / 2,
      100
    );

    // Animation state
    this.isRunning = false;
    this.lastTime = performance.now();
    this.fps = 60;
    this.frameCount = 0;
    this.fpsTime = 0;

    // Start simulation
    this.start();
  }

  /**
   * Start the simulation
   */
  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.lastTime = performance.now();
    this.animate();

    console.log('Drone simulator started!');
    console.log('Controls:');
    console.log('  SPACE / Arrow Up - Thrust');
    console.log('  W - Move Forward');
    console.log('  S - Move Backward');
    console.log('  A / Arrow Left - Rotate Left');
    console.log('  D / Arrow Right - Rotate Right');
  }

  /**
   * Stop the simulation
   */
  stop() {
    this.isRunning = false;
    console.log('Drone simulator stopped');
  }

  /**
   * Main animation loop
   */
  animate() {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Calculate FPS
    this.frameCount++;
    this.fpsTime += deltaTime;
    if (this.fpsTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.fpsTime = 0;
    }

    // Process input
    this.inputController.processDroneInput(this.drone);

    // Update physics
    this.physicsWorld.update(deltaTime);
    this.drone.update();

    // Render
    this.renderer.render(this.drone, this.fps);

    // Continue animation
    requestAnimationFrame(() => this.animate());
  }

  /**
   * Reset the simulation
   */
  reset() {
    // Remove old drone
    this.drone.destroy();

    // Create new drone
    this.drone = new Drone(
      this.physicsWorld.getWorld(),
      this.canvas.width / 2,
      100
    );

    console.log('Simulation reset');
  }

  /**
   * Get the drone instance
   */
  getDrone() {
    return this.drone;
  }

  /**
   * Get the physics world
   */
  getPhysicsWorld() {
    return this.physicsWorld;
  }

  /**
   * Cleanup
   */
  destroy() {
    this.stop();
    this.drone.destroy();
    this.inputController.destroy();
    this.renderer.stop();
  }
}

// Initialize when DOM is ready
let simulator;

window.addEventListener('DOMContentLoaded', () => {
  try {
    simulator = new DroneSimulator('gameCanvas');

    // Expose to window for debugging
    window.droneSimulator = simulator;

    // Add reset button handler
    const resetButton = document.getElementById('resetButton');
    if (resetButton) {
      resetButton.addEventListener('click', () => {
        simulator.reset();
      });
    }

    // Add stop/start button handler
    const toggleButton = document.getElementById('toggleButton');
    if (toggleButton) {
      toggleButton.addEventListener('click', () => {
        if (simulator.isRunning) {
          simulator.stop();
          toggleButton.textContent = 'Start';
        } else {
          simulator.start();
          toggleButton.textContent = 'Stop';
        }
      });
    }

  } catch (error) {
    console.error('Failed to initialize drone simulator:', error);
  }
});
