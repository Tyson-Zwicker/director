import Appearance from './appearance.js';
import Part from './part.js';
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
import Polygon from './polygon.js';
import Point from './point.js';

export default class Director {
  static keyboard = new KeyBoard();
  static initialize() {
    Director.MILLISECONDS = 1000;
    Director.continueAnimationLoop = false;
    Director.appearanceBank = new Map();
    Director.polygonBank = new Map();
    Director.actors = new Map();
    Director.actorFields = new Map();
    Director.partTypes = new Map();
    Director.bgEffects = [];
    Director.fgEffects = [];
    Director.pGenerators = new Map();
    Director.signals = new EventTracker();
    Director.lastFrameTime = 0;
    Director.font = 'bold 12px monospace';
    Director.view = undefined;  //Defined by a call to run() the director. If none is specified, the window is assumed empty and one is created to fill that window.
    Director.keyboard.bindEvents();
    Director.creatorFn = undefined;
    Director.quadtree = new Quadtree(new Boundry(- 1000000, - 1000000, 1000000, 1000000), 1, 50);  // Default capacity and minimum size for the quadtree
  }
  //json has "name (a string) and "points" an array, of {x,y}
  static importPolygonBank(json) {
    let jsonObj = undefined;
    try {
      jsonObj = JSON.parse(json);
    } catch (e) {
      throw new Error("Director.importPolyBank. Bad JSON.");
    }
    for (let poly of jsonObj.polygons) {
      Director.polygonBank.set(poly.name, new Polygon(poly.points));
    }
  }
  static importAppearanceBank(json) {
    let jsonObj = undefined;
    try {
      jsonObj = JSON.parse(json);
    } catch (e) {
      throw new Error("Director.importAppearanceBank. Bad JSON.");
    }
    for (let appr of jsonObj.appearances) {
      console.log(appr);
      Director.appearanceBank.set(appr.name, new Appearance(appr.fill, appr.stroke, appr.text, appr.width));
    }
  }
  static importPartTypes(json) {
    let jsonObj = undefined;
    try {
      jsonObj = JSON.parse(json);
    } catch (e) {
      throw new Error("Director.importPartTypes. Bad JSON.");
    }
    for (let partType of jsonObj.partTypes) {
      console.log(partType);
      Director.partTypes.set(partType.name, new Part(partType.name, partType.polygon));
    }
  }
  static importActors(json){
    let jsonObj = undefined;
    try {
      jsonObj = JSON.parse(json);
    } catch (e) {
      throw new Error("Director.importActors. Bad JSON.");
    }
    for (let actor of jsonObj.actors){
      if (!Director.polygonBank.has (actor.polygon)){
        throw new Error (`Director.importActors: unknown polygon name [${actor.polygon}]`);
      }
      if (!Director.appearanceBank.has(actor.appearance)) {
        throw new Error (`Director.importActors: unknown polygon name [${actor.appearance}]`);
      }
      let poly = Director.polygonBank.get (actor.polygon);
      let act = new Actor (
        actor.name,
        poly,
        Director.appearanceBank.get(actor.appearance),
        actor.mass
      );
      act.bounceCoefficient = actor.bounceCoefficient;
      act.collides = actor.collides;
      act.moves = true;
      act.position = new Point (actor.position.x, actor.position.y);
      act.facing = actor.facing;
      act.spin = actor.spin;
      act.velocity = new Point (actor.velocity.x, actor.velocity.y);

      for (let part of actor.parts){
          if (!Director.partTypes.has (part.partType)){
            throw new Error (`Director.importActors: unknown part Type [${part.partType}] for part [${part.name}]`);    
          }
          let prtType = Director.partTypes.get (part.partType);
          let prt = prtType.createInstance (
          act,
          part.name,
          new Point (part.position.x, part.position.y),
          part.facing,
          Director.appearanceBank.get (part.appearance)
        );
        act.attachPart (prt);
      }      
      Director.actors.set (act.name, act);
    }
  }
  static addCreatorsFunction(fn) {
    Director.creatorFn = fn
  }
  static addActor(actor) {
    if (Director.actors.has(actor.name)) throw Error(`Director:addActor: actor named [${actor.name}] already exists.`)
    Director.actors.set(actor.name, actor);
    Director.quadtree.insert(actor);
  }
  static getActor(actorName) {
    if (!Director.actors.has(actorName)) throw new Error(`Director.removeActor: unknown actor [${actorName}]`)
    return Director.actors.get(actorName);
  }
  static removeActor(actorName) {
    if (!Director.actors.has(actorName)) throw new Error(`Director.removeActor: unknown actor [${actorName}]`)
    Director.actors.delete(actorName);
  }
  static addAppearance(name, fillHexColor, strokeHexColor, textHexColor, lineWidth) {
    if (Director.appearanceBank.has(name)) throw new Error(`Appearance [${name}] already exists.`);
    let appearance = new Appearance(fillHexColor, strokeHexColor, textHexColor, lineWidth);
    Director.appearanceBank.set(name, appearance);
  }
  static getAppearance(appearanceName) {
    if (!Director.appearanceBank.has(appearanceName)) throw new Error(`Director.getAppearance: appearance [${appearanceName}] already exists.`);
    return Director.appearanceBank.get(appearanceName);
  }
  static addPartType(part) {
    if (Director.partTypes.has(part.partTypeName)) throw new Error(`Part Type [${part.partTypeName}] already added.`);
    Director.partTypes.set(part.typeName, part);
  }
  static addPartTypeToActor(partTypeName, actorName, partName, offsetFromActorOrigin, facing, appearanceName) {
    if (!Director.partTypes.has(partTypeName)) throw new Error(`Director.addPartTypeToActor: Unknown part type [${partTypeName}]`);
    if (!Director.actors.has(actorName)) throw new Error(`Director.addPartTypeToActor: Unknown actor ${actorName}`);
    let actor = Director.getActor(actorName);
    let appearance = Director.getAppearance(appearanceName);
    let partType = Director.partTypes.get(partTypeName);
    let part = partType.createInstance(actor, partName, offsetFromActorOrigin, facing, appearance);
    actor.attachPart(part);
  }
  static getPartOfActor(actorName, partName) {
    if (!Director.actors.has(actorName)) throw new Error(`Director.addPartTypeToActor: Unknown actor ${actorName}`);
    let actor = Director.actors.get(actorName);
    return actor.getPart(partName);
  }
  static removePartOfActor(actorName, partName) {
    if (!Director.actors.has(actorName)) throw new Error(`Director.addPartTypeToActor: Unknown actor ${actorName}`);
    let actor = Director.actors.get(actorName);
    actor.removePart(partName);
  }

  /* MOVE THIS TO DIRECTOR FROM PART
  attachParticleGenerator(generator) {
    this.particleGenerator = generator;
    generator.attachedPart = this;
    return this;
  }
  
  updateParticleGenerator() {
    if (this.particleGenerator) {      
      let worldCoords = Transpose.childToWorld (this,this.parent);
      this.particleGenerator.setPosition(worldCoords);
      this.particleGenerator.setFacing(this.parent.facing + this.facing);
    }
  }
    */
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
  static addParticleGenerator(generator) {
    this.pGenerators.set(generator.name, generator);
  }
  static removeParticalGenerator(generatorName) {
    this.pGenerators.delete(generatorName);
  }
  //------------------------- Workers called by main loop
  static runParticleGenerators(now) {
    for (let pg of this.pGenerators.values()) {
      pg.generate(now);
    }
  }
  static applyActorField(delta) {
    for (let actorField of Director.actorFields.values()) {
      for (let otherActor of Director.actors.values()) {
        actorField.enactForce(otherActor);
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
  static collisions(delta) {
    let collisions = Collisions.getCollisions(Director.quadtree);
    for (let collision of collisions.values()) {
      Collisions.callActorCollisionEvents(collision);
      Collisions.handleCollisionPhysics(collision);
    }
  }
  static draw(delta) {
    Director.#draw_backgroundEffects(delta);
    for (let actor of Director.actors.values()) {
      if (Director.view.canSee(actor.position, actor.radius)) {
        actor.draw(Director.view);
      }
    }
    Director.#draw_foregroundEffects(delta);
  }
  static #draw_foregroundEffects(delta) {
    let survivingForegroundEffects = [];
    for (let effect of Director.fgEffects) {
      if (effect instanceof LineEffect) {       //----------lines
        if (Director.view.canSee(effect.p0) || Director.view.canSee(effect.p1)) {
          if (effect.draw(Director.view.context, delta)) {
            survivingForegroundEffects.push(effect);
          }
        }
      }
      if (effect instanceof RadialEffect) {     //----------circle
        if (Director.view.canSee(effect.position, effect.radius)) {
          if (effect.draw(Director.view.context, delta)) {
            survivingForegroundEffects.push(effect);
          }
        }
      }
      if (effect instanceof ParticleEffect) {   //---------Particles
        if (Director.view.canSee(effect.position)) {
          if (effect.draw(Director.view.context, delta)) {
            effect.move(delta); //Particles move themselves if you let them..
            survivingForegroundEffects.push(effect);
          } else {
            if (effect.generator) {
              effect.generator.recycle(effect);
            }
          }
        }
      }
    }
    Director.fgEffects = survivingForegroundEffects;
  }
  static #draw_backgroundEffects(delta) {
    //Draw background..
    let survivingBackgroundEffects = [];
    for (let effect of Director.bgEffects) {
      if (effect instanceof LineEffect) {
        if (Director.view.canSee(effect.p0) || Director.view.canSee(effect.p1)) {
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
      //Particles are lost when they go off screen becauase, if they don't drawn, they don't get preserved...
      if (effect instanceof ParticleEffect) {
        if (Director.view.canSee(effect.position)) {
          if (effect.draw(Director.view.context, delta)) {
            effect.move(delta); //Particles move themselves if you let them..
            survivingBackgroundEffects.push(effect);
          } else {
            if (effect.generator) {
              effect.generator.recycle(effect);
            }
          }
        }
      }
    }
    Director.bgEffects = survivingBackgroundEffects;
  }
  static kinematics(delta) {
    for (let actor of Director.actors.values()) {
      actor.move(delta);
      // Update particle generators attached to parts
      for (let part of actor.parts) {
        part.updateParticleGenerator();
      }
      Director.quadtree.insert(actor);
    }
  }
  static sensing(delta, currentTime) {
    for (let actor of Director.actors.values()) {
      if (actor.sensors) {
        for (let sensor of actor.sensors) {
          let result = sensor.detect(delta);
          if (result) {
            //TODO:  Store the results with the sensor owner.    
            //TODO: Use event tracker to store data on active sensors
          }
        }
      }
    }
  }

  //------------------------- loop
  static loop(currentTime) {
    const delta = (currentTime - Director.lastFrameTime) / Director.MILLISECONDS;
    Director.delta = delta; //Need to be able to see this from external JS sometimes..
    Director.lastFrameTime = currentTime;
    Director.kinematics(delta); //This redraws the entire quadtree.
    Director.applyActorField(delta);
    Director.view.clear(); //<-- Only here. Do not clear the screen anywhere else.    
    Director.sensing(delta, currentTime); //<- do this before draw, because it adds effects..
    Director.runParticleGenerators(currentTime);
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
  static run(canvas, canvasContainer) {
    if (!canvas && !canvasContainer) {
      console.log('making own canvas')
      Director.view = new View('#000');
    }
    else if (!canvas || !canvasContainer) {
      throw new Error(`Define both a canvas and container, or neither! ${canvas}, ${container}`);
    }
    else {
      Director.view = new View('#000', canvas, canvasContainer);
    }
    Director.continueAnimationLoop = true;
    requestAnimationFrame(Director.loop.bind(Director));
  }
  static runOnce(canvas, canvasContainer) {
    if (!canvas && !canvasContainer) {
      Director.view = new View('#000');
    }
    else if (!canvas || !canvasContainer) {
      throw new Error(`Define both a canvas and container, or neither! ${canvas}, ${container}`);
    }
    else {
      Director.view = new View('#124', canvas, canvasContainer);
    }
    Director.continueAnimationLoop = false;
    requestAnimationFrame(Director.loop.bind(Director));
  }
}