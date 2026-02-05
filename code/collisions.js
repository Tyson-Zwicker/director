import Director from "./director.js";
import Point from "./point.js";
import Boundry from './boundry.js';

class Collision {
  constructor(actor, otherActor, overlap) {
    this.actor = actor;
    this.otherActor = otherActor;
    this.overlap = overlap;
  }
}
export default class Collisions {
  static initialize() {
    this.collisions = new Map();
  }
  static callActorCollisionEvents(collision) {
    if (collision.actor.collisionFn) {
      collision.actor.collisionFn(collision.otherActor);
    }
    if (collision.otherActor.collisionFn) {
      collision.otherActor.collisionFn(collision.actor);
    }
  }
  static getCollisions(quadTree) {
    let collisions = new Map();
    for (let actor of Director.actors.values()) {
      if (actor.collides) {
         let actorBoundry =  new Boundry(
          actor.position.x - actor.radius, actor.position.y - actor.radius, //upper left
          actor.position.x + actor.radius, actor.position.y + actor.radius//lower right
        );
        let potentialCollisions = quadTree.findInRange(actorBoundry);
        for (let otherActor of potentialCollisions) {
          if (actor !== otherActor) {
            let overlap = (actor.radius + otherActor.radius) - Point.distance(actor.position, otherActor.position);
            if (overlap >= 0) {
              let collisionID = Collisions.makeCollisionID(actor, otherActor);
              let altCollisionID = Collisions.makeAltCollisionID(actor, otherActor);
              if (!collisions.has(collisionID) && !collisions.has(altCollisionID)) {
                collisions.set(collisionID, new Collision(actor, otherActor, overlap));
              }
            }
          }
        }
      }
    }
    return collisions;
  }
  static handleCollisionPhysics(obj1, obj2, overlap) {
    let m1 = obj1.mass;
    let m2 = obj2.mass;
    let totalMass = m1 + m2;
    if (totalMass <= 0) return;
    //calculate the normal vector
    let p1 = Point.from(obj1.position);
    let p2 = Point.from(obj2.position);
    let normalAxis = Point.from(p1);
    Point.sub(normalAxis, p2);
    Point.normalize(normalAxis);
    //move the objects back along the normal axis by 1/2 of the offset.
    let partialOverlap = overlap / 2;
    let moveA = Point.from(normalAxis);
    Point.scale(moveA, partialOverlap);
    //Point.add(collision.actor.position, moveA);//TODO: returning  this instead...
    let moveB = Point.from(normalAxis);
    Point.scale(moveB, partialOverlap);
    //Point.sub(collision.otherActor.position, moveB);//TODO:returning this instead...
    //Transfer momentum and change velocities.
    let tangentAxis = new Point(-normalAxis.y, normalAxis.x);
    console.log (obj1.velocity);
    console.log ( normalAxis);
    let v1n = Point.dot(obj1.velocity, normalAxis);        //Get scalar velocity along each axis..
    let v1t = Point.dot(obj1.velocity, tangentAxis);
    let v2n = Point.dot(obj2.velocity, normalAxis);   //For both objects..
    let v2t = Point.dot(obj2.velocity, tangentAxis);
    let v1nF = (v1n * (m1 - m2) + 2 * m2 * v2n) / (totalMass);           //1-d tranfer of momentum but only on normal axis..
    let v2nF = (v2n * (m2 - m1) + 2 * m1 * v1n) / (totalMass);
    let v1nFV = Point.scale(Point.from(normalAxis), v1nF * obj1.bounceCoefficient);
    let v2nFV = Point.scale(Point.from(normalAxis), v2nF * obj2.bounceCoefficient);
    let v1tFV = Point.scale(Point.from(tangentAxis), v1t * obj1.bounceCoefficient);
    let v2tFV = Point.scale(Point.from(tangentAxis), v2t * obj2.bounceCoefficient);
    //TODO: Returning instead of directly applying to actors..
    //collision.actor.velocity = Point.add(v1nFV, v1tFV);              //final velocity is normal and tangent added back together.
    //collision.otherActor.velocity = Point.add(v2nFV, v2tFV);
    let result = {      
      "obj1": {"move": moveA, "velocity" : Point.add(v1nFV, v1tFV)},
      "obj2": {"move": moveB, "velocity" : Point.add(v2nFV, v2tFV)}
    }
    return result;
  }
  static makeAltCollisionID(actor, otherActor) {
    return `${otherActor.name}|${actor.name}`;
  }
  static makeCollisionID(actor, otherActor) {
    return `${actor.name}|${otherActor.name}`;
  }
}