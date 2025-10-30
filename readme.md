# 2D Drone Simulation

A real-time 2D drone physics simulation built with HTML5 Canvas and vanilla JavaScript.

## Features

- **Realistic Physics**: Gravity, thrust, rotation, and damping
- **Interactive Controls**: Two independent propellers with power range from -1 to 1
- **Visual Design**: Drone with body, wings, and spinning propellers
- **Boundary Detection**: Drone stays within the screen boundaries
- **Multiple Input Methods**:
  - Sliders for precise propeller control
  - Keyboard controls (Arrow keys and WASD)

## Controls

### Sliders
- Adjust left and right propeller power individually from -1 to 1

### Keyboard
- **↑ / W**: Increase both propellers (fly upward)
- **↓ / S**: Decrease both propellers (descend)
- **← / A**: Increase left, decrease right (rotate/move left)
- **→ / D**: Decrease left, increase right (rotate/move right)

## How to Run

Simply open `index.html` in any modern web browser. No build steps or dependencies required!

## Demo

The drone floats against gravity and responds to propeller thrust. Differential thrust between the propellers causes rotation, simulating realistic 2D drone physics.
