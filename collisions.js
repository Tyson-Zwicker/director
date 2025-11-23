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
  static getCollisions(quadTree) {
    //Avoid double counting of collisions by using a Map to store unique collision IDs.
    let collisions = new Map();
    for (let actor of Director.actors.values()) {
      if (actor.collides) {
        let bounds = new Boundry(
           actor.position.x - actor.polygon.radius,
           actor.position.y - actor.polygon.radius,
           actor.polygon.radius * 2,
           actor.polygon.radius * 2);
        
        let potentialCollisions = quadTree.findInRange(bounds);
        for (let otherActor of potentialCollisions) {
          if (actor !== otherActor) {
            let overlap = (actor.radius() + otherActor.radius()) - Point.distance(actor.position, otherActor.position);
            if (overlap >= 0) {
              let collisionID = this.#makeCollisionID(actor, otherActor);
              let altCollisionID = this.#makeAltCollisionID(actor, otherActor);
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


  static handleCollisionPhysics(collision) {
    let m1 = collision.actor.mass();
    let m2 = collision.otherActor.mass();
    let totalMass = m1 + m2;
    if (totalMass <= 0) return;

    //calculate the normal vector
    let p1 = Point.from(collision.actor.position);
    let p2 = Point.from(collision.otherActor.position);
    let normalAxis = Point.from(p1);
    Point.sub(normalAxis, p2);
    Point.normalize(normalAxis);

    //move the objects back along the normal axis by 1/2 of the offset.
    let partialOverlap = collision.overlap / 2;
    let moveA = Point.from(normalAxis);
    Point.scale(moveA, partialOverlap);
    Point.add(collision.actor.position, moveA);
    let moveB = Point.from(normalAxis);
    Point.scale(moveB, partialOverlap);
    Point.sub(collision.otherActor.position, moveB);

    //Transfer momentum and change velocities.
    let tangentAxis = new Point(-normalAxis.y, normalAxis.x);
    let v1n = Point.dot(collision.actor.velocity, normalAxis);        //Get scalar velocity along each axis..
    let v1t = Point.dot(collision.actor.velocity, tangentAxis);
    let v2n = Point.dot(collision.otherActor.velocity, normalAxis);   //For both objects..
    let v2t = Point.dot(collision.otherActor.velocity, tangentAxis);
    let v1nF = (v1n * (m1 - m2) + 2 * m2 * v2n) / (totalMass);           //1-d tranfer of momentum but only on normal axis..
    let v2nF = (v2n * (m2 - m1) + 2 * m1 * v1n) / (totalMass);
    let v1nFV = Point.scale(Point.from(normalAxis), v1nF);
    let v2nFV = Point.scale(Point.from(normalAxis), v2nF);
    let v1tFV = Point.scale(Point.from(tangentAxis), v1t);
    let v2tFV = Point.scale(Point.from(tangentAxis), v2t);
    collision.actor.velocity = Point.add(v1nFV, v1tFV);              //final velocity is normal and tangent added back together.
    collision.otherActor.velocity = Point.add(v2nFV, v2tFV);
  }
  static #makeCollisionID(actor, otherActor) {
    return `${actor.name}|${otherActor.name}`;
  }
  static #makeAltCollisionID(actor, otherActor) {
    return `${otherActor.name}|${actor.name}`;
  }
  static callActorCollisionEvents(collision) {
    if (collision.actor.collisionFn) {
      collision.actor.collisionFn(collision.otherActor);
    }
    if (collision.otherActor.collisionFn) {
      collision.otherActor.collisionFn(collision.actor);
    }
  }
}