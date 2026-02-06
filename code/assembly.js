
import Check from './check.js';
import Actor from './actor.js';
import Point from './point.js';
export default class Assembly {
  name = undefined;
  roles = new Map();
  position = undefined;
  centerOfMass = undefined;
  totalMass = 0;
  velocity = undefined;
  constructor(position, velocity = { x: 0, y: 0 }) {
    this.position = Point.from(position);
    this.velocity = Point.from(velocity);
    this.centerOfMass = Point.from(position);
  }
  addActor(actor) {
    if (Check.obj(actor, Actor, offset)) throw new Error(`Assembly.addActor: actor is not an actor [${actor}]`);
    if (!Point.isPointy(offset)) throw new Error(`Assembly.addActor: offset is not Pointy [${offset}]`);
    actor.assembly = this;
    actor.moves = true; //just in case.
    actor.collides = true;
    actor.velocity = new Point.zero() //TODO: How do we want to set up initial velocities to account for Assembly spin and velocity 
    // ..neither of which are real... they're just the emergent effect of  spin/velocity of the group of actors as a whole...
    let role = {
      "actor": actor,
      "offset": offset,
      "momentOfInertia": undefined //recalculate() sets this..
    }
    boundActors.set(actor.name, role);
    recalculate();
  }
  recalculate() {
    this.totalMass = 0;
    this.centerOfMass = Point.zero();
    this.momentOfInertia = 0;
    for (let role of this.roles.values()) {
      this.mass += role.actor.mass;
      Point.add(this.centerOfMass, Point.scale(Point.from(role.actor.position), role.actor.mass));
    }
    Point.scale(this.centerOfMass, 1 / this.totalMass)
    role.momentOfInertia = 0;
    for (let role of this.roles.values()) {
      role.momentOfInertia += role.actor.mass * Point.distance(role.actor.position, this.centerOfMass);
    }
  }
  move(delta) {
    let scaledVelocity = Point.scale(Point.from(this.velocity, delta));
    Point.add(this.position, scaledVelocity);
    for (let role of this.roles.values()) {
      role.actor.positon = Point.add(Point.from(this.position, role.offset));;
    }
  }

  applyForce(reciever, force, momentOfInertia, delta) {
    // reciever is the member of the assembly (an actor) that was collided with.   
    // force is the applied force vector.
    //TODO: An assembly can ONLY be moved through the application of force to one of its members.
    //so they DO in fact still move themselves.  They are bound only through the network of rigid connections.
    //ALSO when they are added to the assembly, they're velocity is changed to match the average velocity of the assembly members.
    //ALSO that average should be checked and fixed occaisionally? 

    const linearAcceleration = Point.from(force);
    Point.scale(linearAcceleration, 1 / this.totalMass);
    const relativeForcePosition = Point.sub(Point.from(reciever.position), this.centerOfMass);
    const torque = Point.cross(relativeForcePosition, force);
    const angularAcceleration = torque / reciever.role.momentOfInertia;

    //Update each object's velocity and position
    for (let role of this.roles.values()) {
      const relativePosition = Point.sub(Point.from(role.actor.position), centerOfMass);
      //Note angularAcceleration - in x and positive in y, thus the new point..
      const rotationalAcceleration = new Point(-angularAcceleration * relativePosition.y, angularAcceleration * relativePosition.x);
      const totalAcceleration = Point.add(linearAcceleration, rotationalAcceleration);
      Point.add(role.actor.velocity, Point.scale(totalAcceleration, delta));
    }


    // Return useful debug information
    return {
      linearAcceleration,
      torque,
      angularAcceleration
    };
  }

}
