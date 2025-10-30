/**
 * Physics World Manager
 *
 * Handles the Matter.js physics engine setup and environment
 */

class PhysicsWorld {
  constructor(width, height) {
    this.width = width;
    this.height = height;

    // Create Matter.js engine
    this.engine = Matter.Engine.create();
    this.world = this.engine.world;

    // Configure gravity (Earth gravity)
    this.engine.world.gravity.y = 1;

    // Create boundaries (walls and floor)
    this.createBoundaries();

    // Create obstacles
    this.createObstacles();
  }

  /**
   * Create world boundaries
   */
  createBoundaries() {
    const wallThickness = 50;

    this.boundaries = {
      ground: Matter.Bodies.rectangle(
        this.width / 2,
        this.height - 25,
        this.width,
        50,
        {
          isStatic: true,
          friction: 0.5,
          render: {
            fillStyle: '#27ae60',
            strokeStyle: '#229954',
            lineWidth: 2
          }
        }
      ),
      leftWall: Matter.Bodies.rectangle(
        25,
        this.height / 2,
        50,
        this.height,
        {
          isStatic: true,
          render: {
            fillStyle: '#7f8c8d',
            strokeStyle: '#5d6d7e',
            lineWidth: 2
          }
        }
      ),
      rightWall: Matter.Bodies.rectangle(
        this.width - 25,
        this.height / 2,
        50,
        this.height,
        {
          isStatic: true,
          render: {
            fillStyle: '#7f8c8d',
            strokeStyle: '#5d6d7e',
            lineWidth: 2
          }
        }
      ),
      ceiling: Matter.Bodies.rectangle(
        this.width / 2,
        25,
        this.width,
        50,
        {
          isStatic: true,
          render: {
            fillStyle: '#34495e',
            strokeStyle: '#2c3e50',
            lineWidth: 2
          }
        }
      )
    };

    Matter.World.add(this.world, [
      this.boundaries.ground,
      this.boundaries.leftWall,
      this.boundaries.rightWall,
      this.boundaries.ceiling
    ]);
  }

  /**
   * Create obstacles in the world
   */
  createObstacles() {
    this.obstacles = [];

    // Platform 1
    const platform1 = Matter.Bodies.rectangle(200, 400, 150, 20, {
      isStatic: true,
      friction: 0.5,
      render: {
        fillStyle: '#e67e22',
        strokeStyle: '#d35400',
        lineWidth: 2
      }
    });

    // Platform 2
    const platform2 = Matter.Bodies.rectangle(600, 300, 150, 20, {
      isStatic: true,
      friction: 0.5,
      render: {
        fillStyle: '#e67e22',
        strokeStyle: '#d35400',
        lineWidth: 2
      }
    });

    // Landing pad
    const landingPad = Matter.Bodies.rectangle(400, this.height - 100, 100, 10, {
      isStatic: true,
      friction: 0.8,
      render: {
        fillStyle: '#9b59b6',
        strokeStyle: '#8e44ad',
        lineWidth: 2
      }
    });

    this.obstacles.push(platform1, platform2, landingPad);
    Matter.World.add(this.world, this.obstacles);
  }

  /**
   * Update physics simulation
   */
  update(deltaTime = 1000 / 60) {
    Matter.Engine.update(this.engine, deltaTime);
  }

  /**
   * Get the Matter.js world
   */
  getWorld() {
    return this.world;
  }

  /**
   * Get the Matter.js engine
   */
  getEngine() {
    return this.engine;
  }

  /**
   * Add a body to the world
   */
  addBody(body) {
    Matter.World.add(this.world, body);
  }

  /**
   * Remove a body from the world
   */
  removeBody(body) {
    Matter.World.remove(this.world, body);
  }

  /**
   * Clear all non-static bodies
   */
  clear() {
    const bodies = Matter.Composite.allBodies(this.world);
    bodies.forEach(body => {
      if (!body.isStatic) {
        Matter.World.remove(this.world, body);
      }
    });
  }
}
