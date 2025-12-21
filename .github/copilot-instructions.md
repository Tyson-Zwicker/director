# Director - 2D Physics Engine AI Coding Guide

## Project Overview
Pure JavaScript 2D physics engine with no external dependencies. Focuses on collision detection, kinematics, forces, and mouse interaction using canvas rendering. Zero-dependency philosophy is a core constraint.

## Core Architecture

### The Director Pattern (director.js)
Static singleton that orchestrates the entire engine via a centralized game loop:
- Manages global collections: `actors` (Map), `actorFields` (Map), `bgEffects`/`fgEffects` (Arrays), `pGenerators` (Map)
- Main loop sequence: kinematics → apply forces → clear screen → sensing → generate particles → draw → collisions → custom creator function → user interaction → quadtree clear
- Delta time calculated as `(currentTime - lastFrameTime) / MILLISECONDS` for frame-independent physics
- Single screen clear per loop (`Director.view.clear()`) - never clear elsewhere

### Actor System (actor.js)
Actors are the primary entities:
- Required: `name`, `polygon`, `appearance`, `_mass` (falls back to polygon area if undefined)
- Movement: `position` (Point), `velocity` (Point as vector), `facing` (degrees), `spin` (degrees/sec)
- Collision: `bounceCoefficient` (0-1, default 0.5), `collides` boolean, optional `collisionFn` callback
- Composition: `parts[]` for child objects, `sensors[]` for detection, `button` for interaction
- Private `#label` field for text labels positioned relative to actor

### Coordinate Systems (transpose.js)
Three coordinate spaces require explicit conversion:
- **World coordinates**: Physics simulation space (unlimited range)
- **Screen coordinates**: Canvas pixels for rendering
- **Child coordinates**: Local to parent actor (e.g., Parts attached to Actors)
- Key functions: `worldToScreen()`, `childToWorld()`, `childToScreen()`, `pointToWorld()`
- All conversions account for camera position, zoom, and rotation

### Point Mathematics (point.js)
**Critical**: Point operations are in-place mutations to avoid garbage collection:
```javascript
// WRONG - creates garbage
let result = Point.add(a, b);

// CORRECT - mutates first argument
let result = Point.from(a);  // Make copy first
Point.add(result, b);         // Mutate the copy
```
Common operations: `add()`, `sub()`, `scale()`, `rotate()`, `normalize()`, `dot()`, `distance()`, `fromPolar()`

### Collision Detection (collisions.js + quadtree.js)
Two-phase spatial partitioning:
1. **Quadtree**: Spatial hash for broad-phase collision detection
   - Rebuilt from scratch every frame (cleared after each loop)
   - Configurable `capacity` (objects per node) and `minimumSize` (world units)
   - Objects too large for subdivisions get "exemptions" and stay in parent node
2. **Narrow-phase**: Circle-based collision detection using radius overlap
3. **Physics resolution**: 1D elastic collision on normal axis, preserves tangent velocity, applies `bounceCoefficient`

### View & Camera (view.js)
- Camera drag: Right-click or click background, drag to pan (scales movement by `1/zoom`)
- Zoom: Mouse wheel, adjusts `camera.zoom` factor
- Viewport culling: `canSee(point, radius)` checks bounds before drawing
- Creates canvas element and appends to body automatically on construction

### Sensors (sensor.js)
Sweeping detection system for actor awareness:
- `centerAngle`: Offset from actor's forward direction (degrees)
- `fieldOfView`: Total sweep arc (degrees, splits ±)
- `speed`: Sweep rate (degrees/sec)
- `range`: Detection distance (world units)
- Returns `SensorResponse` objects with detected actors
- Active sensors emit to `Director.signals` event tracker for passive detection

### Buttons (button.js)
Mouse interaction system for actors:
- Requires three `Appearance` objects: default, hovered, pressed
- State machine: unhovered → hovered → pressed → clicked
- `clickFn` callback receives `this` as the button (access actor via `this.actor`)
- `toggle` mode for on/off switches
- Uses polygon hit testing (`polygon.isPointIn()`) on `drawnPoints` (screen space)

### Effects System
Three effect types (lineeffect.js, radialeffect.js, particleeffect.js):
- Background effects drawn first (under actors), foreground last (over actors)
- Effects return `true` to persist, `false` to be removed next frame
- Particle generators can recycle particles to reduce garbage collection
- Viewport culled before drawing

## Key Patterns

### Object Lifecycle
1. Create actor with `new Actor(name, polygon, appearance, mass)`
2. Add to simulation: `Director.addActor(actor)` (also inserts to quadtree)
3. Remove: `Director.removeActor(actor)` (also cleans up fields)
4. Actors auto-remove from quadtree when cleared each loop

### Testing Structure
- **tests/**: Current test files (HTML + JS module pairs)
- **oldtests/**: Deprecated tests (reference only)
- **sensor_tests/**: Sensor-specific tests
- Pattern: HTML loads JS as ES6 module, JS imports Director and calls `Director.initialize()` then `Director.run()`
- Test files typically create random actors in a range and demonstrate specific features

### ES6 Module System
All files use ES6 modules (`import`/`export`). Example initialization:
```javascript
import Director from './director.js';
import Actor from './actor.js';

document.addEventListener('DOMContentLoaded', () => {
  Director.initialize();
  // Create actors...
  Director.run();
});
```

### Custom Logic Integration
Use `Director.addCreatorsFunction(fn)` to inject per-frame custom logic:
- Called after collision detection in main loop
- Receives `delta` (fractional seconds since last frame)
- Example: Rotate parts, apply custom forces, check win conditions

### Part Attachment (part.js)
Parts are child objects that inherit parent rotation:
- Position is local offset from parent
- Drawn with combined rotation: `part.facing + parent.facing`
- Can have own `appearance` or inherit from parent
- Support particle generator attachment for exhaust effects

## Common Operations

### Creating Polygons
```javascript
Polygon.triangle(base, height)
Polygon.rectangle(width, height)
Polygon.makeIrregular(sides, minRadius, maxRadius)
```

### Applying Forces
```javascript
Director.addFieldToActor(actor, strength);  // Gravity-like field
// Fields apply force inversely proportional to distance
```

### Working with the Keyboard
```javascript
Director.keyboard.isKeyDown('w')  // Returns boolean
// Keyboard events auto-bound in Director.initialize()
```

## Gotchas

- **Zoom**: Affects drawing scale but not world physics
- **Rotation**: Always in degrees, never radians (except `Point.toRad` constant)
- **Quadtree clearing**: Happens at end of loop, so don't rely on persistent quadtree state
- **Mass fallback**: If undefined, calculated from `polygon.radius` as circle area
- **Facing normalization**: Auto-wraps to 0-360° in `Actor.move()`
- **Event timing**: Sensor data and signals timestamped with loop's `currentTime`
- **Draw order**: Background effects → actors (if in view) → foreground effects

## Builder Tools (builder/)
Scene/actor construction helpers - reference for understanding actor creation patterns.
