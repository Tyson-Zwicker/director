import View from './view.js';
import Quadtree from './quadtree.js';
import Collisions from './collisions.js';
import Boundry from './boundry.js';
import Field from './fields.js';
export default class Director {
  static initialize() {
    Director.MILLISECONDS = 1000;
    Director.continueAnimationLoop = false;
    Director.actors = new Map();
    Director.actorFields = new Map();
    Director.lastFrameTime = 0;
    Director.font = 'bold 12px monospace';
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
    if (Director.actorFields.has(actor.name)) Director.actorFields.delete(actor.actorName);
  }
  static addFieldToActor(actor, strength) {
    Director.actorFields.set(actor.name, strength);
  }
  static removeFieldFromActor(actor) {
    if (Director.actorFields.has(actor.name)) Director.actorFields.delete(actor.actorName);
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
  static applyActorFields(delta) {
    //TODO: I need a filter on this so it isn't iterating through EVERYTHING.
    //Basically how far away to do have to get where the force you exert hits a minimal threshold 
    //so it becomes irrelevent then then use the quadtree...
    for (let actorName of Director.actors.keys()){
      let field = Director.actorFields.get (actorName);
      let actor = Director.actors.get (actorName);
      for (otherActor in Director.actors.values()){
        let distance  = Point.distance (actor.position, otherActor.position);
        // a = F/m, F = strength/d^2
        // This is one sided. The other object may or may not also excert a force on this actor
        //THEY DO both get pulled though: Newton's 3rd law of motion.
      let force = field.strength/distance**2;
        let accleration = force/otherActor.mass;
        //You are here: you need to do this with components, without using trig if at all possible...
        
      }
    }
  }
  static loop(currentTime) {
    const delta = (currentTime - Director.lastFrameTime) / Director.MILLISECONDS;
    Director.lastFrameTime = currentTime;
  
    Director.kinematics(delta); //This redraws the entire quadtree.
    Director.draw(delta);
    Director.collisions(delta);
    if (Director.creatorFn) {
      Director.creatorFn(delta);
    }
    //Director.applyActorFields(delta);  <-- not ready.
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