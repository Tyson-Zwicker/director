import View from './view.js';
import Quadtree from './quadtree.js';
import Collisions from './collisions.js';
import Boundry from './boundry.js';
export default class Director {
  static initialize() {
    Director.MILLISECONDS = 1000;
    Director.continueAnimationLoop = false;
    Director.actors = new Map(); // Add a collection of Actor objects
    Director.lastFrameTime = 0;
    Director.font = 'bold 12px monospace'; // Default font
    Director.view = new View();
    Director.creatorFn = undefined;
    Director.quadtree = new Quadtree(
      new Boundry(
        -Number.MAX_SAFE_INTEGER,
        -Number.MAX_SAFE_INTEGER,
        2 * Number.MAX_SAFE_INTEGER,
        2 * Number.MAX_SAFE_INTEGER
      ),
      1, 10  // Default capacity and minimum size for the quadtree
    );
  }
  static addCreatorsFunction(fn) {
    Director.creatorFn = fn
  }
  static addActor(actor) {
    Director.actors.set(actor.name, actor);
    Director.quadtree.insert(actor); //This will automically remove the actor if it is already in the quadtree
  }
  static removeActor(actor) {
    Director.actors.delete(actor.name);
    //Director.quadtree.remove(actor);
  }
  static kinematics(delta) {
    for (let actor of Director.actors.values()) {
      actor.move(delta);
      Director.quadtree.insert(actor);
    }
  }
  static collisions(delta) {
    let collisions = Collisions.getCollisions(Director.quadtree);
    for (let collision of collisions.values()) {
      Collisions.callActorCollisionEvents(collision);
      Collisions.handleCollisionPhysics(collision);
    }
  }
  static draw(delta) {
    Director.view.clear();
    for (let actor of Director.actors.values()) {
      if (Director.view.canSee(actor.position)) {
        actor.draw(Director.view);
      }
    }
  }
  static checkUserActorInteraction() {
    let actorMouseInteraction = false;
    for (let actor of Director.actors.values()) {
      // Check if actor is in view before interacting
      if (
        Director.view.canSee(actor.position) &&
        actor.button &&
        actor.button.checkForMouse(Director.view.mouse)
      ) {
        actorMouseInteraction = true;
        break;
      }
    }
    Director.view.handleCameraDrag(actorMouseInteraction);
  }
  static applyFields(delta) {
    for (let actor of Director.actors.values()) {
      
    }
  }
  static loop(currentTime) {
    const delta = (currentTime - Director.lastFrameTime) / Director.MILLISECONDS;
    Director.lastFrameTime = currentTime;
    Director.applyFields(delta);
    Director.kinematics(delta); //This redraws the entire quadtree.
    Director.draw(delta);
    Director.collisions(delta);
    if (Director.creatorFn) {
      Director.creatorFn(delta);
    }
    Director.checkUserActorInteraction();
    Director.quadtree.clear();      //QuadTree is cleared (will be recreated begining next loop)
    if (Director.continueAnimationLoop) requestAnimationFrame(Director.loop.bind(Director));
  }
  static run() {
    Director.continueAnimationLoop = true;
    requestAnimationFrame(Director.loop.bind(Director));
  }
  static runOnce() {
    Director.continueAnimationLoop = false;
    requestAnimationFrame(Director.loop.bind(Director));
  }
}