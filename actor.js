import Point from './point.js';
import EventTracker from './eventtracker.js';
export default class Actor {
  _mass = undefined;
  appearance = undefined;
  bounceCoefficient = 0.5; // How much velocity is retained after a collision.
  button = undefined;
  collides = true;
  collisionFn = undefined;
  moves = true;
  name = undefined;
  parts = [];
  polygon = undefined;
  position = new Point(0, 0); // world coordinates, defined in pixels.
  rotation = 0; // Defined in degrees
  sensorData = new EventTracker();
  sensors = undefined;
  spin = 0; // Defined in degrees per second.
  velocity = new Point(0, 0); // Point used as a component vector because they are the same thing.
  #label = undefined;
  constructor(name, polygon, appearance, mass) {
    this.name = name;
    this.polygon = polygon;
    this.appearance = appearance;
    this._mass = mass;
  }
  attachButton(b) {
    this.button = b;
    b.actor = this;
  }
  attachPart(prt) {
    prt.owner = this;
    this.parts.push(prt);
  }
  attachSensor(sensor) {
    if (!this.sensors) this['sensors'] = [];
    sensor['actor'] = this;
    this.sensors.push(sensor);
    return this.sensors.length;
  }
  removeSensor(i) {
    this.sensors.splice(i, 1);
  }
  draw(view) {
    let origin = Point.from(this.position);
    //Move the origin to the center of the screen, and scale it by the camera zoom
    Point.sub(origin, view.camera);
    Point.scale(origin, view.camera.zoom);
    Point.add(origin, view.screenCenter);
    let appearance = this.#drawChooseAppearance();
    this.polygon.draw(view, origin, this.rotation, appearance);

    this.#drawParts(view);
    this.#drawLabels(view);
  }
  #drawChooseAppearance() {
    let appearance = this.appearance;
    if (this.button) {
      if (this.button.hovered) appearance = this.button.hoveredAppearance;
      if (this.button.pressed || this.button.clicked) appearance = this.button.pressedAppearance;
    }
    if (!appearance) throw new Error(`Actor ${this.name} appearance is undefined :${this.appearance}`);
    return appearance;
  }
  #drawParts(view) {
    let origin = Point.from(this.position);
    for (let part of this.parts) {      
      let partOrigin = part.getWorldCoordinates (this, origin);      
      let appearance = (part.appearance) ? part.appearance : this.appearance;
      part.polygon.draw(view, partOrigin, part.rotation + this.rotation, appearance);
    }
  }
  #drawLabels(view) {
    if (this.#label) {
      //{ "text": text, "offset": offset ,"emSize":size};    
      let labelOrigin = Point.from(this.#label.offset);
      Point.add(labelOrigin, this.position);
      //make "paint" subroutine for this..
      Point.sub(labelOrigin, view.camera);
      Point.scale(labelOrigin, view.camera.zoom);
      Point.add(labelOrigin, view.screenCenter);
      let appearance = (this.#label.appearance) ? this.#label.appearance : this.appearance;
      view.context.fillStyle = appearance.text;
      view.context.textBaseline = "middle";
      view.context.textAlign = "center";
      view.context.font = (this.#label.emSize) ? `${this.#label.emSize}em monospace` : '0.75em monospace';
      view.context.fillText(this.#label.text, labelOrigin.x, labelOrigin.y);
    }
  }
  mass() {
    //If mass was not defined, use the polygon's area instead.
    if (this._mass == undefined || isNaN(this._mass)) {
      if (this.polygon?.radius === undefined || this.polygon.radius === null || isNaN(this.polygon.radius)) {
        throw new Error(`Actor ${this.name} has no radius/mass defined.`);
      } else {
        return Math.PI * Math.pow(this.polygon.radius, 2);
      }
    }
    return this._mass;
  }
  move(delta) {
    let scaledVelocity = Point.from(this.velocity);
    Point.scale(scaledVelocity, delta);
    Point.add(this.position, scaledVelocity);
    this.rotation += this.spin * delta;
    if (this.rotation > 360) this.rotation -= 360;
    if (this.rotation < 0) this.rotation += 360;
  }
  radius() {
    return this.polygon.radius;
  }
  setLabel(text, offset, emSize) {
    let size = (emSize) ? emSize : 1;
    this.#label = { "text": text, "offset": offset, "emSize": size };
  }
  toString() {
    return `[${this.name}], contains [${this.parts.length}] parts, label [${this.#label?.text}]`;
  }
}