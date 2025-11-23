import Boundry from './boundry.js';

export default class Quadtree {
  constructor(bounds, capacity, minimumSize = 1) {
    if (!bounds.isBoundry()) throw (`Quadtree boundry was not a boundry: ${bounds}`);
    this.bounds = bounds; // { x1, y1, x2, y2 }
    this.capacity = capacity; // Maximum objects before subdivision
    this.minimumSize = minimumSize; // Minimum size (the side of the square, defined in world coordinates) before subdivision
    this.actors = [];
    this.divided = false;
    this.canDivide = true;
    this.hasReachedMinimumSize = bounds.width <= minimumSize || bounds.height <= minimumSize;
  }
  subdivide() {
    const { x1, y1, x2, y2 } = this.bounds;
    const width = x2 - x1;
    const halfWidth = width / 2;
    const height = y2 - y1;
    const halfHeight = height / 2;
    this.northeast = new Quadtree(new Boundry(x1 + halfWidth, y1, x1 + width, y1 + height), this.capacity, this.minimumSize);
    this.northwest = new Quadtree(new Boundry(x1, y, x1 + halfWidth, y1 + halfHeight), this.capacity, this.minimumSize);
    this.southeast = new Quadtree(new Boundry(x1 + halfWidth, y1 + halfHeight, x1 + width, y1 + height), this.capacity, this.minimumSize);
    this.southwest = new Quadtree(new Boundry(x1, y1 + halfHeight, x1 + halfWidth, y1 + height), this.capacity, this.minimumSize);
    this.divided = true;
  }

  insert(actor) {
    //If the object is not in the quadtree, check if it is within the bounds
    let actorBoundry = Boundry.getActorBounds(actor);
    if (!this.bounds.touches(actorBoundry)) return false;

    //If this cannot be put into a subquadrant because it would be to big... it gets an exemption!

    let toBigtoSplit = actor.radius() >= Math.min(this.bounds.width / 2, this.bounds.height / 2);

    //Insert the actor in this quadrant ONLY if there is room, BUT exceed the capacity rule if:
    //  the quadrant cannot be reduced because it is at minimize allowed size
    //  or the object would not fit in a subdivision of this quadrant
    let rules = toBigtoSplit || this.actors.length < this.capacity || this.hasReachedMinimumSize || !this.canDivide;
    if (rules) {
      this.actors.push(actor);
      this.canDivide = false;
      return true;
    }
    //The quadrant is full, but the actor will fit in a subquarant,and there is space for another subdivision so find one for it...
    if (!this.divided) this.subdivide();
    return (
      this.northeast.insert(actor) ||
      this.northwest.insert(actor) ||
      this.southeast.insert(actor) ||
      this.southwest.insert(actor)
    );
  }
  clear() {
    this.actors = [];
    if (this.divided) {
      this.northeast = undefined;
      this.northwest = undefined;
      this.southeast = undefined;
      this.southwest = undefined;
      this.divided = false;
      this.canDivide = true;
    }
  }
  findInRange(otherBoundry, found = []) {
    if (!this.bounds.touches(otherBoundry)) return found;     //Safely ignore this whole quadrant..
    for (let actor of this.actors) {
      let actorBounds = Boundry.getActorBounds(actor);
      if (actorBounds.touches(otherBoundry)) {
        found.push(actor);         //Anything in the same quadrant is worth looking at more closely..
      }
    }
    if (this.divided) {                                                 //Probably nothing in the top level quadrant because it has been subdivided,
      this.northwest.findInRange(otherBoundry, found);                 //and the actors moved to other locations, so we check the subquadants
      this.northeast.findInRange(otherBoundry, found);
      this.southwest.findInRange(otherBoundry, found);
      this.southeast.findInRange(otherBoundry, found);
    }
    return found;                                                       //Recurse..
  }
}