import View from './view.js';
import Quadtree from './quadtree.js';
import Collisions from './collisions.js';
import Boundry from './boundry.js';
import ActorField from './actorfields.js';
import Actor from './actor.js';
import EventTracker from './eventtracker.js';
import KeyBoard from './keyboard.js';
import LineEffect from './lineeffect.js';
import RadialEffect from './radialeffect.js';
import ParticleEffect from './particleeffect.js';

export default class Director {
  static keyboard = new KeyBoard();
  static initialize() {
    Director.MILLISECONDS = 1000;
    Director.continueAnimationLoop = false;
    Director.actors = new Map();
    Director.actorFields = new Map();
    Director.bgEffects = [];
    Director.fgEffects = [];
    Director.particleGenerators = new Map();
    Director.signals = new EventTracker();
    Director.lastFrameTime = 0;
    Director.font = 'bold 12px monospace';
    Director.view = new View();
    Director.keyboard.bindEvents();
    Director.creatorFn = undefined;
    Director.quadtree = new Quadtree(
      new Boundry(
        - Number.MAX_SAFE_INTEGER / 2,
        - Number.MAX_SAFE_INTEGER / 2,
        Number.MAX_SAFE_INTEGER / 2,
        Number.MAX_SAFE_INTEGER / 2
      ),
      1, 1  // Default capacity and minimum size for the quadtree
    );
  }
  static addCreatorsFunction(fn) {
    Director.creatorFn = fn
  }
  static addActor(actor) {
    Director.actors.set(actor.name, actor);
    Director.quadtree.insert(actor);
  }
  static removeActor(actor) {
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
  static applyActorField(delta) {
    for (let actorField of Director.actorFields.values()) {
      for (let otherActor of Director.actors.values()) {
        actorField.enactForce(otherActor);
      }
    }
  }
  static addParticleGenerator(generator) {
    Director.particleGenerators.set(generator.name, generator);
  }
  //------------------------- Workers called by main loop
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
      if (effect instanceof LineEffect) {
        if (Director.view.canSee(effect.p1) || Director.view.canSee(effect.p2)) {
          if (effect.draw(Director.view.context, delta)) {
            survivingBackgroundEffects.push(effect);           
          }
        }
      }
      if (effect instanceof RadialEffect) {
        if (Director.view.canSee(effect.position, effect.radius)) {
          if (effect.draw(Director.view.context, delta)) {
            survivingBackgroundEffects.push(effect);
          }
        }
      }
      //Particles are lost when they go off screen becauase, if they don't drawn, they
      //don't get preserved...  I don't think this will matter much because particles are going
      //to be produced on mass from "particle sprayers" so it just making more when the sprayer
      //comes back on screen.  If it is a big deal at some point we just change how the survival
      //system works so it doesn't care about being drawn or not.  
      if (effect instanceof ParticleEffect) {
        if (Director.view.canSee(effect.position)) {
          if (effect.draw(Director.view.context, delta)) {
            effect.move(delta); //Particles move themselves if you let them..
            survivingBackgroundEffects.push(effect);                        
          }
        }
      }
    }
    //Draw actors..
    for (let actor of Director.actors.values()) {
      if (Director.view.canSee(actor.position, actor.radius())) {
        actor.draw(Director.view);
      }
    }
    //Draw foreground
    let survivingForegroundEffects = [];
    for (let effect of Director.fgEffects) {
      if (effect instanceof LineEffect) {
        if (Director.view.canSee(effect.p1) || Director.view.canSee(effect.p2)) {
          if (effect.draw(Director.view.context, delta)) {
            survivingForegroundEffects.push(effect);
          }
        }
      }
      if (effect instanceof RadialEffect) {
        if (Director.view.canSee(effect.position, effect.radius)) {
          if (effect.draw(Director.view.context, delta)) {
            survivingForegroundEffects.push(effect);
          }
        }
      }
      if (effect instanceof ParticleEffect) {        
        if (Director.view.canSee(effect.position)) {
          if (effect.draw(Director.view.context, delta)) {            
            effect.move(delta); //Particles move themselves if you let them..
            survivingBackgroundEffects.push(effect);            
          }
        }
      }
    }
    Director.bgEffects = survivingBackgroundEffects;
    Director.fgEffects = survivingForegroundEffects;
  }
  static kinematics(delta) {
    for (let actor of Director.actors.values()) {
      actor.move(delta);
      Director.quadtree.insert(actor);
    }
  }
  static particles() {
    for (let particleGenerator of Director.particleGenerators.values()) {
      particleGenerator.generate();
    }
  }
  static removeOldSensorData(currentTime) {
    //TODO:  This...
  }
  static sensing(delta, currentTime) {
    for (let actor of Director.actors.values()) {
      if (actor.sensors) {
        for (let sensor of actor.sensors) {
          let result = sensor.sweep(delta);
          //If they sensor is active, its shine like a beacon, everything knows "something" is there.
          if (sensor.active) {
            //It knows where it came from, when, and what its "signature" is.
            //This works regardless of wether or not the result returned anything to the one using the sensor.
            Director.signals.add(currentTime, { position: actor.position, sensor: sensor.name });
          }
          if (result !== undefined) {                  // Sometimes the sensor doesn't see anything..
            actor.sensorData.add(currentTime, result); //<-- it needs its own list of things "it" sees.         
          }
        }
      }
    }
  }
  //------------------------- loop
  static loop(currentTime) {
    const delta = (currentTime - Director.lastFrameTime) / Director.MILLISECONDS;
    Director.lastFrameTime = currentTime;
    Director.kinematics(delta); //This redraws the entire quadtree.
    Director.applyActorField(delta);
    Director.view.clear(); //<-- Only here. Do not clear the screen anywhere else.
    Director.removeOldSensorData(currentTime);
    Director.sensing(delta, currentTime); //<- do this before draw, as it may add effects..
    Director.particles();
    Director.draw(delta);
    Director.collisions(delta);
    if (Director.creatorFn) {
      Director.creatorFn(delta);
    }
    Director.checkUserActorInteraction();
    Director.quadtree.clear();      //QuadTree is cleared (will be recreated begining next loop)
    if (Director.continueAnimationLoop) requestAnimationFrame(Director.loop.bind(Director));
  }
  //------------------------- runners
  static run() {
    Director.continueAnimationLoop = true;
    requestAnimationFrame(Director.loop.bind(Director));
  }
  static runOnce() {
    Director.continueAnimationLoop = false;
    requestAnimationFrame(Director.loop.bind(Director));
  }
}