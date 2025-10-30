/**
 * Drone Physics Model
 *
 * This class represents a 2D quadcopter drone with realistic physics:
 * - 4 motors/propellers providing thrust
 * - Individual motor control for rotation
 * - Battery simulation
 * - Center of mass
 * - Air resistance
 */

class Drone {
  constructor(world, x, y) {
    this.world = world;

    // Drone physical properties
    this.config = {
      bodyWidth: 60,
      bodyHeight: 10,
      armLength: 40,
      motorRadius: 8,
      mass: 1.0,
      maxThrust: 0.002,        // Maximum thrust per motor
      rotationalForce: 0.0001, // Torque for rotation
      dragCoefficient: 0.0005,  // Air resistance
      batteryCapacity: 100,
      batteryDrainRate: 0.01
    };

    // Drone state
    this.battery = this.config.batteryCapacity;
    this.motors = {
      frontLeft: 0,   // 0-1 throttle
      frontRight: 0,
      backLeft: 0,
      backRight: 0
    };

    // Create drone body (main frame)
    this.body = Matter.Bodies.rectangle(x, y, this.config.bodyWidth, this.config.bodyHeight, {
      density: 0.001,
      frictionAir: 0.01,
      restitution: 0.3,
      render: {
        fillStyle: '#2c3e50',
        strokeStyle: '#34495e',
        lineWidth: 2
      }
    });

    // Create motors/propellers
    const hw = this.config.bodyWidth / 2;
    const al = this.config.armLength;

    this.motorBodies = {
      frontLeft: this.createMotor(x - hw/2, y - al, '#e74c3c'),
      frontRight: this.createMotor(x + hw/2, y - al, '#3498db'),
      backLeft: this.createMotor(x - hw/2, y + al, '#e74c3c'),
      backRight: this.createMotor(x + hw/2, y + al, '#3498db')
    };

    // Create arms connecting body to motors
    this.arms = {
      frontLeft: this.createArm(this.body, this.motorBodies.frontLeft),
      frontRight: this.createArm(this.body, this.motorBodies.frontRight),
      backLeft: this.createArm(this.body, this.motorBodies.backLeft),
      backRight: this.createArm(this.body, this.motorBodies.backRight)
    };

    // Add all parts to the world
    Matter.World.add(this.world, [
      this.body,
      this.motorBodies.frontLeft,
      this.motorBodies.frontRight,
      this.motorBodies.backLeft,
      this.motorBodies.backRight,
      this.arms.frontLeft,
      this.arms.frontRight,
      this.arms.backLeft,
      this.arms.backRight
    ]);
  }

  createMotor(x, y, color) {
    return Matter.Bodies.circle(x, y, this.config.motorRadius, {
      density: 0.0005,
      render: {
        fillStyle: color,
        strokeStyle: '#000',
        lineWidth: 1
      }
    });
  }

  createArm(bodyA, bodyB) {
    return Matter.Constraint.create({
      bodyA: bodyA,
      bodyB: bodyB,
      stiffness: 0.9,
      damping: 0.1,
      render: {
        strokeStyle: '#7f8c8d',
        lineWidth: 3
      }
    });
  }

  /**
   * Apply thrust from all motors
   */
  applyThrust(throttle = 0.5) {
    if (this.battery <= 0) return;

    // Equal thrust on all motors for vertical flight
    this.motors.frontLeft = throttle;
    this.motors.frontRight = throttle;
    this.motors.backLeft = throttle;
    this.motors.backRight = throttle;

    this.applyMotorForces();
  }

  /**
   * Move forward (tilt and thrust)
   */
  moveForward(power = 0.7) {
    if (this.battery <= 0) return;

    // Increase back motors, decrease front motors for forward tilt
    this.motors.frontLeft = power * 0.6;
    this.motors.frontRight = power * 0.6;
    this.motors.backLeft = power;
    this.motors.backRight = power;

    this.applyMotorForces();
  }

  /**
   * Move backward (tilt and thrust)
   */
  moveBackward(power = 0.7) {
    if (this.battery <= 0) return;

    // Increase front motors, decrease back motors for backward tilt
    this.motors.frontLeft = power;
    this.motors.frontRight = power;
    this.motors.backLeft = power * 0.6;
    this.motors.backRight = power * 0.6;

    this.applyMotorForces();
  }

  /**
   * Rotate clockwise
   */
  rotateClockwise(power = 0.6) {
    if (this.battery <= 0) return;

    // Increase left motors, decrease right motors
    this.motors.frontLeft = power;
    this.motors.backLeft = power;
    this.motors.frontRight = power * 0.4;
    this.motors.backRight = power * 0.4;

    this.applyMotorForces();
  }

  /**
   * Rotate counter-clockwise
   */
  rotateCounterClockwise(power = 0.6) {
    if (this.battery <= 0) return;

    // Increase right motors, decrease left motors
    this.motors.frontRight = power;
    this.motors.backRight = power;
    this.motors.frontLeft = power * 0.4;
    this.motors.backLeft = power * 0.4;

    this.applyMotorForces();
  }

  /**
   * Apply forces from all motors
   */
  applyMotorForces() {
    const motors = [
      { body: this.motorBodies.frontLeft, throttle: this.motors.frontLeft },
      { body: this.motorBodies.frontRight, throttle: this.motors.frontRight },
      { body: this.motorBodies.backLeft, throttle: this.motors.backLeft },
      { body: this.motorBodies.backRight, throttle: this.motors.backRight }
    ];

    motors.forEach(motor => {
      if (motor.throttle > 0) {
        // Apply upward thrust
        const thrust = motor.throttle * this.config.maxThrust;
        Matter.Body.applyForce(motor.body, motor.body.position, {
          x: 0,
          y: -thrust
        });

        // Drain battery
        this.battery -= this.config.batteryDrainRate * motor.throttle;
      }
    });

    // Reset motors for next frame
    this.resetMotors();
  }

  /**
   * Reset all motors to idle
   */
  resetMotors() {
    this.motors.frontLeft = 0;
    this.motors.frontRight = 0;
    this.motors.backLeft = 0;
    this.motors.backRight = 0;
  }

  /**
   * Apply air resistance
   */
  applyDrag() {
    const bodies = [
      this.body,
      this.motorBodies.frontLeft,
      this.motorBodies.frontRight,
      this.motorBodies.backLeft,
      this.motorBodies.backRight
    ];

    bodies.forEach(body => {
      const velocity = body.velocity;
      const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);

      if (speed > 0.1) {
        const drag = this.config.dragCoefficient * speed;
        const dragX = -velocity.x * drag;
        const dragY = -velocity.y * drag;

        Matter.Body.applyForce(body, body.position, {
          x: dragX,
          y: dragY
        });
      }
    });
  }

  /**
   * Update drone physics (called every frame)
   */
  update() {
    this.applyDrag();

    // Recharge battery slowly when idle
    if (this.battery < this.config.batteryCapacity) {
      this.battery = Math.min(this.config.batteryCapacity, this.battery + 0.005);
    }
  }

  /**
   * Get drone center position
   */
  getPosition() {
    return this.body.position;
  }

  /**
   * Get drone angle
   */
  getAngle() {
    return this.body.angle;
  }

  /**
   * Get battery level (0-100)
   */
  getBattery() {
    return Math.max(0, this.battery);
  }

  /**
   * Remove drone from world
   */
  destroy() {
    Matter.World.remove(this.world, [
      this.body,
      this.motorBodies.frontLeft,
      this.motorBodies.frontRight,
      this.motorBodies.backLeft,
      this.motorBodies.backRight,
      this.arms.frontLeft,
      this.arms.frontRight,
      this.arms.backLeft,
      this.arms.backRight
    ]);
  }
}
