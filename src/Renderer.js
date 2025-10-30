/**
 * Canvas Renderer
 *
 * Renders the Matter.js physics world to a canvas with additional UI elements
 */

class Renderer {
  constructor(canvas, engine) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.engine = engine;
    this.width = canvas.width;
    this.height = canvas.height;

    // Matter.js renderer (we'll use custom rendering but keep this as fallback)
    this.matterRenderer = Matter.Render.create({
      canvas: canvas,
      engine: engine,
      options: {
        width: this.width,
        height: this.height,
        wireframes: false,
        background: '#ecf0f1',
        showAngleIndicator: true,
        showVelocity: true
      }
    });
  }

  /**
   * Start the Matter.js renderer
   */
  start() {
    Matter.Render.run(this.matterRenderer);
  }

  /**
   * Stop the renderer
   */
  stop() {
    Matter.Render.stop(this.matterRenderer);
  }

  /**
   * Custom render method with additional UI
   */
  render(drone, fps = 60) {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw background gradient
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, '#87ceeb');
    gradient.addColorStop(1, '#ecf0f1');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Draw all bodies
    this.drawBodies();

    // Draw constraints
    this.drawConstraints();

    // Draw UI overlay
    this.drawUI(drone, fps);
  }

  /**
   * Draw all physics bodies
   */
  drawBodies() {
    const bodies = Matter.Composite.allBodies(this.engine.world);

    this.ctx.save();

    bodies.forEach(body => {
      const vertices = body.vertices;

      this.ctx.beginPath();
      this.ctx.moveTo(vertices[0].x, vertices[0].y);

      for (let i = 1; i < vertices.length; i++) {
        this.ctx.lineTo(vertices[i].x, vertices[i].y);
      }

      this.ctx.lineTo(vertices[0].x, vertices[0].y);
      this.ctx.closePath();

      // Fill
      this.ctx.fillStyle = body.render.fillStyle || '#95a5a6';
      this.ctx.fill();

      // Stroke
      this.ctx.strokeStyle = body.render.strokeStyle || '#000';
      this.ctx.lineWidth = body.render.lineWidth || 1;
      this.ctx.stroke();

      // Draw angle indicator for non-static bodies
      if (!body.isStatic && body.circleRadius) {
        this.ctx.beginPath();
        this.ctx.moveTo(body.position.x, body.position.y);
        this.ctx.lineTo(
          body.position.x + Math.cos(body.angle) * body.circleRadius,
          body.position.y + Math.sin(body.angle) * body.circleRadius
        );
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
      }
    });

    this.ctx.restore();
  }

  /**
   * Draw all constraints
   */
  drawConstraints() {
    const constraints = Matter.Composite.allConstraints(this.engine.world);

    this.ctx.save();

    constraints.forEach(constraint => {
      if (!constraint.bodyA || !constraint.bodyB) return;

      const posA = constraint.bodyA.position;
      const posB = constraint.bodyB.position;

      this.ctx.beginPath();
      this.ctx.moveTo(posA.x, posA.y);
      this.ctx.lineTo(posB.x, posB.y);

      this.ctx.strokeStyle = constraint.render.strokeStyle || '#666';
      this.ctx.lineWidth = constraint.render.lineWidth || 2;
      this.ctx.stroke();
    });

    this.ctx.restore();
  }

  /**
   * Draw UI overlay (HUD)
   */
  drawUI(drone, fps) {
    this.ctx.save();

    // Semi-transparent background for HUD
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(10, 10, 250, 150);

    // Text settings
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '14px monospace';

    // FPS
    this.ctx.fillText(`FPS: ${Math.round(fps)}`, 20, 30);

    // Drone stats
    const pos = drone.getPosition();
    const angle = drone.getAngle();
    const battery = drone.getBattery();

    this.ctx.fillText(`Position: (${Math.round(pos.x)}, ${Math.round(pos.y)})`, 20, 50);
    this.ctx.fillText(`Angle: ${(angle * 180 / Math.PI).toFixed(1)}°`, 20, 70);
    this.ctx.fillText(`Battery: ${Math.round(battery)}%`, 20, 90);

    // Battery bar
    const barWidth = 200;
    const barHeight = 20;
    const barX = 20;
    const barY = 100;

    // Background
    this.ctx.fillStyle = '#333';
    this.ctx.fillRect(barX, barY, barWidth, barHeight);

    // Battery level
    const batteryColor = battery > 50 ? '#2ecc71' : battery > 20 ? '#f39c12' : '#e74c3c';
    this.ctx.fillStyle = batteryColor;
    this.ctx.fillRect(barX, barY, (battery / 100) * barWidth, barHeight);

    // Border
    this.ctx.strokeStyle = '#fff';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(barX, barY, barWidth, barHeight);

    // Controls info
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(10, this.height - 110, 250, 100);

    this.ctx.fillStyle = '#fff';
    this.ctx.font = '12px monospace';
    this.ctx.fillText('Controls:', 20, this.height - 90);
    this.ctx.fillText('SPACE - Thrust', 20, this.height - 70);
    this.ctx.fillText('W/S - Forward/Back', 20, this.height - 50);
    this.ctx.fillText('A/D - Rotate', 20, this.height - 30);

    this.ctx.restore();
  }

  /**
   * Get canvas dimensions
   */
  getDimensions() {
    return {
      width: this.width,
      height: this.height
    };
  }

  /**
   * Resize canvas
   */
  resize(width, height) {
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.matterRenderer.canvas.width = width;
    this.matterRenderer.canvas.height = height;
    this.matterRenderer.options.width = width;
    this.matterRenderer.options.height = height;
  }
}
