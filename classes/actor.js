import Point from './point.js';
import EventTracker from './eventtracker.js';
import Label from './label.js';
import Boundry from './boundry.js';
import Transpose from './transpose.js';
export default class Actor {
  typeName = undefined;
  name = undefined;
  mass = undefined;
  polygon = undefined;
  appearance = undefined;
  bounceCoefficient = 0.5; // How much velocity is retained after a collision.
  button = undefined;
  collides = true;
  collisionFn = undefined;
  moves = true;
  parts = new Map();
  
  position = new Point(0, 0); // world coordinates, defined in pixels.
  facing = 0; // Defined in degrees
  spin = 0; // Defined in degrees per second.
  velocity = new Point(0, 0); // Point used as a component vector because they are the same thing.
  #label = undefined;
  radius = undefined;
  sensorData = new EventTracker();
  sensors = undefined;
  sensorBoundry = undefined;
  maxSensorRange =0;
  constructor(typeName, polygon, mass, bounceCoefficient=0.5, collides=true, moves=true) {
    this.typeName = typeName;
    this.polygon = polygon;
    this.appearance = Appearance.default;
    this.mass = mass;
    this.bounceCoefficient = bounceCoefficient;
    this.collides = collides;
    this.moves = moves;
    this.radius = polygon.radius;
    if (this.mass<=0 || this.radius<=0) throw new Error (`Actor.constructor: Actors must have a phsyical presence.  mass: [${_this.mass}] radius [${this.radius}]!`)
  }
  createInstanceOf (name, appearance, position, velocity, facing,spin){
    let actor = new Actor (this.actorTypeName, this.polygon, this.mass, this.bounceCoefficient, this.collides, this.moves);
    actor.name = name;
    actor.appearance = appearance;
    actor.position =position;
    actor.velocity = velocity;
    actor.facing = facing;
    actor.spin = spin;
    return actor;
  }
  setLabel(text, position, appearance, size) {
    this.#label = new Label (this, position, appearance, size, text);
  }
  attachButton(b) {
    this.button = b;
    b.actor = this;
  }
  attachPart(part) {
    if (this.parts.has (part.name)) throw new Error (`Actor.attachPart: part names [${part.name}] already exists.`);
    this.parts.set (part.name, part);

  }
  getPart (partName){
    if (!this.parts.has (partName)) throw new Error (`Actor.getPart: part names [${partName}] does not exist`);
    return this.parts.get (partName)
  }
  removePart (partName){
    if (!this.parts.has (partName)) throw new Error (`Actor.removePart: part names [${partName}] does not exist`);
    this.parts.delete (partName);
  }
  attachSensor(sensor) {
    if (!this.sensors) this['sensors'] = [];
    sensor['actor'] = this;
    if (sensor.range > this.maxSensorRange){
      this.maxSensorRange = sensor.range;
      this.sensorBoundry = new Boundry (-sensor.range, -sensor.range, sensor.range, sensor.range);
    }
    this.sensors.push(sensor);
    return this.sensors.length;
  }
  removeSensor(i) {
    //TODO: recalc range and boundry..
    this.sensors.splice(i, 1);
  }
  draw(view) {
    let origin = Point.from(this.position);
    
    let appearance = this.#drawChooseAppearance();
    this.polygon.draw (Transpose.worldToScreen (this.position),this.facing, appearance);
    this.#drawParts(view);
    this.#drawLabel(view);
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
    for (let part of this.parts) {      
      let appearance = (part.appearance) ? part.appearance : this.appearance;
      part.polygon.draw (Transpose.childToScreen (part, this), part.facing+this.facing, appearance);
    }
  }
  #drawLabel() {
    if (this.#label) {
      this.#label.draw();
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
    this.facing += this.spin * delta;
    if (this.facing > 360) this.facing -= 360;
    if (this.facing < 0) this.facing += 360;
  }
  toString() {
    return `[${this.name}], contains [${this.parts.length}] parts, label [${this.#label?.text}]`;
  }
}