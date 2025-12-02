import View from './view.js';
import Quadtree from './quadtree.js';
import Collisions from './collisions.js';
import Boundry from './boundry.js';//<--TODO: move to quadtree. We could just pass the numbers.
import ActorField from './actorfields.js';
import Actor from './actor.js';
export default class Director {
  static initialize() {
    Director.MILLISECONDS = 1000;
    Director.continueAnimationLoop = false;
    Director.actors = new Map();
    Director.actorFields = new Map();
    Director.backgroundEffects = [];
    Director.foregroundEffects = [];

    Director.lastFrameTime = 0;
    Director.font = 'bold 12px monospace';
    Director.view = new View();
    Director.creatorFn = undefined;
    Director.quadtree = new Quadtree(
      new Boundry(0
        - Number.MAX_SAFE_INTEGER / 2,
        -Number.MAX_SAFE_INTEGER / 2,
        Number.MAX_SAFE_INTEGER,
        Number.MAX_SAFE_INTEGER
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
    if (Director.actorFields.has(actor.name)) Director.actorFields.delete(actor.name);
  }
  static addFieldToActor(actor, strength) {
    if (!(actor instanceof Actor)) throw Error(`Director.addFieldToActor: actor is not an actor. [${actor}]`);
    Director.actorFields.set(actor.name, new ActorField(actor, strength));
  }
  static removeFieldFromActor(actor) {
    if (Director.actorFields.has(actor.name)) Director.actorFields.delete(actor.name);
  }
  static addBackgroundEffect(effect) {
    Director.backgroundEffects.push(effect);
  }
  static addForegroundEffect(effect) {
    Director.foregroundEffects.push(effect);
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
    } 0
  }
  static draw(delta) {
    /*    MAYBE A GOOD TIME TO CONSIDER "LAYERS" FOR ACTORS.
      */
    //Draw background..
    let survivingBackgroundEffects = [];
    for (let i = 0; i < Director.backgroundEffects.length; i++) {
      let effect = Director.backgroundEffects[i];
      console.log(`Director.draw: effect ${effect}`)
      if (Director.view.canSee(p1) || Director.view.canSee(p2)) {
        if (!effect.draw(Director.view.context, delta)) {
          survivingBackgroundEffects.push(effect);
        }
      }
    }
    //Draw actors..
    for (let actor of Director.actors.values()) {
      if (Director.view.canSee(actor.position)) {
        actor.draw(Director.view);
      }
    }
    //Draw foreground
    let survivingForegroundEffects = [];
    for (let i = 0; i < Director.foregroundEffects.length; i++) {
      let effect = Director.foregroundEffects[i];
      console.log(`Director.draw: effect ${effect}`)      
      if (Director.view.canSee(p1) || Director.view.canSee(p2)) {
        if (!effect.draw(Director.view.context, delta)) {
          survivingForegroundEffects.push(effect);
        }
      }
      this.backgroundEffects = survivingBackgroundEffects;
      this.foregroundEffects = survivingForegroundEffects;
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
  static applyActorField(delta) {
    //TODO: I need a filter on this so it isn't iterating through EVERYTHING.
    //Basically how far away do you have to get where the force you exert hits a minimal threshold 
    //so it becomes irrelevent.  Then use the quadtree to get just whats inside that radius.

    for (let actorField of Director.actorFields.values()) {
      for (let otherActor of Director.actors.values()) {
        actorField.enactForce(otherActor);
      }
    }
  }
  static loop(currentTime) {
    const delta = (currentTime - Director.lastFrameTime) / Director.MILLISECONDS;
    Director.lastFrameTime = currentTime;
    Director.kinematics(delta); //This redraws the entire quadtree.
    Director.view.clear(); //<-- Only here. Do not clear the goddam screen anywhere else. It makes you shit be annoyingly invisibe..
    Director.draw(delta);
    Director.collisions(delta);
    if (Director.creatorFn) {
      Director.creatorFn(delta);
    }
    Director.applyActorField(delta);
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