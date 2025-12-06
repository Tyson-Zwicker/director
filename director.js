import View from './view.js';
import Quadtree from './quadtree.js';
import Collisions from './collisions.js';
import Boundry from './boundry.js';//<--TODO: move to quadtree. We could just pass the numbers.
import ActorField from './actorfields.js';
import Actor from './actor.js';
import EventTracker from './eventtracker.js';
export default class Director {
  static initialize() {
    Director.MILLISECONDS = 1000;
    Director.continueAnimationLoop = false;
    Director.actors = new Map();
    Director.actorFields = new Map();
    Director.bgEffects = [];
    Director.fgEffects = [];

    Director.signals = new EventTracker();
    Director.lastFrameTime = 0;
    Director.font = 'bold 12px monospace';
    Director.view = new View();
    Director.creatorFn = undefined;
    Director.quadtree = new Quadtree(
      new Boundry(
        - Number.MAX_SAFE_INTEGER / 2,
        - Number.MAX_SAFE_INTEGER / 2,
        Number.MAX_SAFE_INTEGER / 2,
        Number.MAX_SAFE_INTEGER / 2
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
    Director.bgEffects.push(effect);
  }
  static addForegroundEffect(effect) {
    Director.fgEffects.push(effect);
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
    //Draw background..
    let survivingBackgroundEffects = [];
    for (let effect of Director.bgEffects) {
      if (Director.view.canSee(effect.p1) || Director.view.canSee(effect.p2)) {
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
    for (let effect of Director.fgEffects) {
      if (Director.view.canSee(effect.p1) || Director.view.canSee(effect.p2)) {
        if (!effect.draw(Director.view.context, delta)) {
          survivingForegroundEffects.push(effect);
        }
      }
    }
    Director.bgEffects = survivingBackgroundEffects;
    Director.fgEffects = survivingForegroundEffects;
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
  static sensing(delta, currentTime) {
    for (let actor of Director.actors.values()) {
      if (actor.sensors) {
        for (let sensor of actor.sensors) {
          let result = sensor.sweep(delta);
          if (sensor.active) {
            Director.signals.add(currentTime, result); //<-- everything within distance will see this "ping"
          }
          actor.sensorData.add(currentTime, result); //<-- it needs its own list of things "it" sees.
        }
      }
    }
  }
  static loop(currentTime) {
    const delta = (currentTime - Director.lastFrameTime) / Director.MILLISECONDS;
    Director.lastFrameTime = currentTime;
    Director.kinematics(delta); //This redraws the entire quadtree.
    Director.applyActorField(delta);
    Director.view.clear(); //<-- Only here. Do not clear the goddamn screen anywhere else. It makes you shit be annoyingly invisibe..
    Director.draw(delta);
    Director.sensing(delta, currentTime);
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