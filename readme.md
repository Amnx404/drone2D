# Drone2D - Physics-Based Drone Simulator

A realistic 2D quadcopter drone physics simulation built with Matter.js. Control a fully-simulated drone with individual motor thrust, battery management, and realistic physics including gravity and air resistance.

![Drone2D Banner](https://img.shields.io/badge/Physics-Matter.js-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## Features

### Realistic Physics Simulation
- **4 Independent Motors**: Each motor can be controlled individually for precise flight dynamics
- **Differential Thrust**: Real quadcopter behavior with tilting and rotation through motor speed variation
- **Battery System**: Finite battery that drains during flight and slowly recharges when idle
- **Air Resistance**: Realistic drag forces that affect flight at different speeds
- **Gravity**: Earth-like gravity simulation (9.8 m/s²)
- **Collision Detection**: Full physics-based collision with environment

### Drone Mechanics
- **Vertical Thrust**: All motors working together for altitude control
- **Forward/Backward**: Differential thrust for tilting and horizontal movement
- **Rotation Control**: Left/right rotation through opposing motor pairs
- **Structural Integrity**: Motors connected to body via constraints (arms)

### Interactive Environment
- **Platforms**: Multiple landing platforms at different heights
- **Boundaries**: Floor, ceiling, and walls with collision
- **Landing Pad**: Special target zone for precision landing
- **Real-time HUD**: Position, angle, battery level, and FPS display

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)
- A modern web browser (Chrome, Firefox, Safari, Edge)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/drone2D.git
   cd drone2D
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the simulator**
   ```bash
   npm start
   ```

   This will start a local web server and automatically open the simulator in your browser at `http://localhost:8080`.

## Controls

| Key | Action | Description |
|-----|--------|-------------|
| `SPACE` or `↑` | Thrust | Apply vertical thrust to all motors |
| `W` | Forward | Tilt forward and thrust |
| `S` | Backward | Tilt backward and thrust |
| `A` or `←` | Rotate Left | Counter-clockwise rotation |
| `D` or `→` | Rotate Right | Clockwise rotation |

### Advanced Maneuvers
- **Hover**: Tap `SPACE` to maintain altitude
- **Precision Landing**: Combine rotation and forward/backward for gentle landings
- **Quick Turn**: Use rotation keys while applying forward thrust

## Project Structure

```
drone2D/
├── index.html              # Main HTML page
├── package.json            # Node.js dependencies
├── readme.md              # This file
├── src/
│   ├── Drone.js           # Drone physics model and motor control
│   ├── PhysicsWorld.js    # Matter.js world setup and environment
│   ├── Renderer.js        # Canvas rendering and HUD
│   ├── InputController.js # Keyboard input handling
│   └── index.js           # Main application loop
└── public/                # Static assets (currently empty)
```

## Architecture

### Drone Physics Model (`src/Drone.js`)

The drone is composed of:
- **Main Body**: Central frame (60x10 pixels)
- **4 Motors**: Individual physics bodies connected via constraints
- **Arms**: Matter.js constraints acting as structural connections

Each motor applies force independently, allowing for:
- Vertical flight when all motors thrust equally
- Tilting when front/back motors have different thrust
- Rotation when left/right motors have different thrust

### Physics World (`src/PhysicsWorld.js`)

Manages the Matter.js physics engine:
- World boundaries (floor, ceiling, walls)
- Static obstacles and platforms
- Gravity and physics properties
- Update loop for physics simulation

### Renderer (`src/Renderer.js`)

Handles all visual output:
- Canvas-based rendering using Matter.js renderer
- Custom HUD overlay with real-time stats
- Battery indicator with color coding
- FPS counter

### Input Controller (`src/InputController.js`)

Keyboard input system:
- Key state tracking
- Multi-key support for complex maneuvers
- Input processing and drone control mapping

## Technical Details

### Physics Configuration

```javascript
{
  gravity: { x: 0, y: 1 },           // Earth-like gravity
  maxThrust: 0.002,                  // Per-motor thrust
  dragCoefficient: 0.0005,           // Air resistance
  batteryCapacity: 100,              // Full battery
  batteryDrainRate: 0.01             // Drain per frame
}
```

### Performance

- Target: 60 FPS
- Physics update rate: 60 Hz
- Typical performance: 55-60 FPS on modern hardware
- Canvas size: 800x600 pixels

## Customization

### Modifying Drone Properties

Edit `src/Drone.js` to change drone characteristics:

```javascript
this.config = {
  bodyWidth: 60,           // Increase for larger drone
  armLength: 40,           // Longer arms = more stable
  maxThrust: 0.002,        // Higher = more powerful
  dragCoefficient: 0.0005, // Higher = more air resistance
  batteryCapacity: 100     // Battery capacity
};
```

### Adding Obstacles

Edit `src/PhysicsWorld.js` to add platforms or obstacles:

```javascript
const newPlatform = Matter.Bodies.rectangle(x, y, width, height, {
  isStatic: true,
  render: { fillStyle: '#color' }
});
Matter.World.add(this.world, newPlatform);
```

### Changing Environment

Modify gravity, world size, or physics properties:

```javascript
// In PhysicsWorld constructor
this.engine.world.gravity.y = 1; // Change gravity
```

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Dependencies

- **[Matter.js](https://brm.io/matter-js/)** (v0.19.0): 2D physics engine
- **http-server** (v14.1.1): Local development server

## Development

### Running in Development Mode

```bash
npm run dev
```

### Project Goals

This simulator was designed to:
1. Demonstrate realistic 2D physics simulation
2. Model quadcopter flight dynamics accurately
3. Provide an educational tool for understanding drone physics
4. Create an engaging, interactive experience

## Future Enhancements

Potential features for future versions:
- [ ] Autonomous flight modes (hover, waypoint navigation)
- [ ] Multiple drones with collision avoidance
- [ ] Wind simulation and turbulence
- [ ] Damage model and repair system
- [ ] Mission objectives and challenges
- [ ] Touch/mobile controls
- [ ] Level editor
- [ ] Multiplayer races

## License

MIT License - Feel free to use this project for learning, teaching, or building upon!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Built with [Matter.js](https://brm.io/matter-js/) by Liam Brummitt
- Inspired by real quadcopter flight dynamics
- Physics concepts from robotics and aerospace engineering

## Support

If you encounter any issues or have questions:
1. Check the browser console for error messages
2. Ensure you're using a supported browser
3. Try refreshing the page
4. Open an issue on GitHub

---

**Enjoy flying! Remember: real drones are harder to control than this simulation!**
