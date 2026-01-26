import Appearance from './appearance.js';
import ActorType from './actortype.js';
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
import CircleEffect from './circleeffect.js';
import ParticleEffect from './particleeffect.js';
import RadialEffect from './radialeffect.js';
import Polygon from './polygon.js';
import Point from './point.js';
import Keyboard from './keyboard.js';
import GUI from './gui.js';

export default class Director {
  static initialize() {
    Director.MILLISECONDS = 1000;
    Director.continueAnimationLoop = false;
    Director.appearanceBank = new Map();
    Director.polygonBank = new Map();
    Director.actorTypeBank = new Map();
    Director.actors = new Map();
    Director.actorFields = new Map();
    Director.partTypes = new Map();
    Director.bgEffects = [];
    Director.fgEffects = [];
    Director.pGenerators = new Map();
    Director.signals = new EventTracker();
    Director.lastFrameTime = 0;
    Director.font = 'bold 12px monospace';
    let view = new View('#024');
    Director.view = view;
    Director.creatorFn = undefined;
    Director.quadtree = new Quadtree(new Boundry(- 1000000, - 1000000, 1000000, 1000000), 1, 50);  // Default capacity and minimum size for the quadtree
    Director.keyboard = new Keyboard();
    Director.gui = new GUI(160, 40, 5, view);//TODO: figure out good values (or better a function) to set these to..
  }

  static importPolygonBank(json) {
    let jsonObj = undefined;
    try {
      jsonObj = JSON.parse(json);
    } catch (e) {
      throw new Error("Director.importPolyBank. Bad JSON.");
    }
    //You must convert EVERYTHING to a number manually or else it might do "Javascript" math with a string..

    for (let poly of jsonObj.polygons) {
      let points = [];
      for (let strPoint of poly.points) {
        let point = { "x": parseFloat(strPoint.x), "y": parseFloat(strPoint.y) };
        points.push(point);
      }
      Director.polygonBank.set(poly.name, new Polygon(poly.name, points));
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
      Director.appearanceBank.set(appr.name, new Appearance(appr.name, appr.fill, appr.stroke, appr.text, parseInt(appr.width)));
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
      Director.partTypes.set(partType.name, new Part(partType.name, Director.polygonBank.get(partType.polygon)));
    }
  }
  static importActorTypes(json) {
    let jsonObj = undefined;
    try {
      jsonObj = JSON.parse(json);
    } catch (e) {
      throw new Error("Director.importActorTypes. Bad JSON.");
    }
    for (let actorTypeElement of jsonObj.actorTypes) {
      if (!Director.polygonBank.has(actorTypeElement.polygon)) {
        throw new Error(`Director.importActorTypes: unknown polygon name [${actorTypeElement.polygon}]`);
      }
      let poly = Director.polygonBank.get(actorTypeElement.polygon);
      if (actorTypeElement.bounceCoefficient > 1 || actorTypeElement.bounceCoefficient < 0) {
        throw error(`Director.importActorTypes: bounce Coefficient ${actorTypeElement.bounceCoefficient} out of bounds for ${actorTypeElement.name}`);
      }
      let actorType = new ActorType(
        actorTypeElement.name,
        poly,
        parseInt(actorTypeElement.mass),
        parseFloat(actorTypeElement.bounceCoefficient),
        (actorTypeElement.collides === 'true'),
        (actorTypeElement.moves === 'true')
      );
      for (let partElement of actorTypeElement.parts) {
        if (!Director.partTypes.has(partElement.partTypes)) {
          throw new Error(`Director.importActorTypes: unknown part Type [${partElement.partTypes}] for part [${partElement.name}]`);
        }
        if (!Director.appearanceBank.has(partElement.appearances)) {
          throw new Error(`Director.importActorTypes: unknown appearance [${partElement.appearances} for part ${partElement.name}]`);
        }
        let partType = Director.partTypes.get(partElement.partTypes);
        //createInstance ( name, appearance, offsetFromActorOrigin, facing, spin){
        let part = partType.createInstance(
          partElement.name,
          Director.appearanceBank.get(partElement.appearances),
          new Point(parseFloat(partElement.xOffset), parseFloat(partElement.yOffset)),
          parseFloat(partElement.facing),
          parseFloat(partElement.spin)
        );
        actorType.attachPart(part);
      }
      Director.actorTypeBank.set(actorType.name, actorType);
    }
  }
  static importActors(json) {
    let jsonObj = undefined;
    try {
      jsonObj = JSON.parse(json);
    } catch (e) {
      throw new Error("Director.importActors. Bad JSON.");
    }
    for (let actorElement of jsonObj.actors) {
      if (!Director.appearanceBank.has(actorElement.appearances)) {
        throw new Error(`Director.importActors: unknown appearance name [${actorElement.appearance}] for actor [${actorElement.name}]`);
      }
      if (!Director.actorTypeBank.has(actorElement.actorTypes)) {
        throw new Error(`Director.importActors: unknown actor typeName [${actorElement.actorType}] for actor [${actorElement.name}]`);
      }
      let appearance = Director.appearanceBank.get(actorElement.appearances);
      let actorType = Director.actorTypeBank.get(actorElement.actorTypes);
      // createActorInstance (name, appearance, position, velocity, facing, spin){
      let actor = actorType.createActorInstance(
        actorElement.name, appearance,
        new Point(parseFloat(actorElement.positionX), parseFloat(actorElement.positionY)),
        new Point(parseFloat(actorElement.velocityX), parseFloat(actorElement.velocityY)),
        parseFloat(actorElement.facing), parseFloat(actorElement.spin));
      Director.actors.set(actor.name, actor);
    }
  }
  static importScene(json) {
    let jsonObj = undefined;
    try {
      jsonObj = JSON.parse(json);
    } catch (e) {
      throw new Error("Director.importScene. Bad JSON.");
    }
    Director["scene"] = {
      name: jsonObj.name,
      description: jsonObj.description,
      text: jsonObj.text,
    };
    for (let appearance of jsonObj.appearances) {
      if (!Director.appearanceBank.has(appearance.name)) throw new Error(`Director.importScene: appearance ${appearance.name} does not exist`);
    }
    for (let polygon of jsonObj.polygons) {
      if (!Director.polygonBank.has(polygon.name)) throw new Error(`Director.importScene: polygon ${polygon.name} does not exist`);

    }
    for (let actor of jsonObj.actors) {
      if (!Director.actors.has(actor.name)) throw new Error(`Director.importScene: actor ${actor.name} does not exist`);
    }

  }
  static addPolygon(polygon) {
    if (Director.polygonBank.has(polygon.name)) throw new Error(`Director.addPolygon: Polygon [${polygon.name} already exists.`);
    Director.polygonBank.set(polygon.name, polygon);
  }
  static getPolygon(polygonName) {
    if (!Director.polygonBank.has(polygonName)) throw new Error(`Director.addPolygon: Polygon [${polygonMame} does not exist.`);
    return Director.polygonBank.get(polygonName);
  }
  static addActorType(actorType) {
    if (Director.actorTypeBank.has(actorType.name)) throw new Error(`Director.addActorType: actorType [${actorType.name}] already exists.`);
    Director.actorTypeBank.set(actorType.name, actorType);
  }
  static getActorType(actorTypeName) {
    if (!Director.actorTypeBank.has(actorTypeName)) throw new Error(`Director.getActorType: actorType [${actorTypeName}] does not exist.`);
    return Director.actorTypeBank.get(actorTypeName);
  }
  static addCreatorsFunction(fn) {
    Director.creatorFn = fn
  }
  static addActor(actor) {
    if (Director.actors.has(actor.name)) throw new Error(`Director:addActor: actor named [${actor.name}] already exists.`);
    Director.actors.set(actor.name, actor);
    Director.quadtree.insert(actor);
  }
  static getActor(actorName) {
    if (!Director.actors.has(actorName)) throw new Error(`Director.removeActor: unknown actor [${actorName}]`);
    return Director.actors.get(actorName);
  }
  static removeActor(actorName) {
    if (!Director.actors.has(actorName)) throw new Error(`Director.removeActor: unknown actor [${actorName}]`);
    Director.actors.delete(actorName);
  }
  static addAppearance(appearance) {
    if (Director.appearanceBank.has(appearance.name)) throw new Error(`Director.addAppearance: Appearance [${appearance.name}] already exists.`);
    Director.appearanceBank.set(appearance.name, appearance);
  }
  static getAppearance(appearanceName) {
    if (!Director.appearanceBank.has(appearanceName)) throw new Error(`Director.getAppearance: unknown appearance [${appearanceName}].`);
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
  attachParticleGeneratorToPart(generator, part) {
    part.attachParticleGenerator(generator);
  }
  static addFieldToActor(actor, strength) {
    if (!(actor instanceof Actor)) throw new Error(`Director.addFieldToActor: actor is not an actor. [${actor}]`);
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
  static bindKey(key, fn) {
    Director.keyboard.setKeyFunction(key, fn);
  }
  static unbindKey(key) {
    Director.keyboard.delete(key);
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
  static checkMouseActorInteraction() {
    let actorMouseInteraction = false;
    for (let actor of Director.actors.values()) {
      if (
        typeof actor.button === 'object' &&
        Director.view.canSee(actor.position) &&
        actor.button.checkForMouse(Director.view.mouse)
      ) {
        actorMouseInteraction = true;
        break;
      }
    }
    return actorMouseInteraction;
  }
  static checkMouseGuiInteraction() {
    let guiInteraction = false;
    for (let guiControl of Director.gui.controls) {
      if ((guiControl.type === 'button' || guiControl.type === 'list')) {
        //Don't check hiden items.
        if (guiControl.visible && guiControl.button.checkForMouse(Director.view.mouse)){
          guiInteraction = true;
          break;
        }
      }
    }
    return guiInteraction;
  }
  static checkMouseInteractions() {
    let mouseInteractedWithSomething = this.checkMouseActorInteraction() || this.checkMouseGuiInteraction();
    Director.view.handleCameraDrag(mouseInteractedWithSomething);
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

    Director.gui.draw();
    this.#drawMillisInTheCorner(delta);
  }
  static #drawMillisInTheCorner(delta) {
    Director.view.context.textBaseline = 'top';
    Director.view.context.fillStyle = '#FFFFFF';
    Director.view.context.strokeStyle = '#FFFFFF';
    let oldfont = Director.view.context.font;
    Director.view.context.font = "bold 16px Arial"
    Director.view.context.fillText('Δ' + (String(Math.trunc(delta * 1000)).padStart(4, '0')), 5, 5);
    Director.view.context.font = oldfont;
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
      if (effect instanceof CircleEffect) {     //----------circle
        if (Director.view.canSee(effect.position, effect.radius)) {
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
      if (effect instanceof CircleEffect) {
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
      for (let part of actor.parts.values()) {
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
    if (Director.creatorFn) Director.creatorFn(delta);
    Director.checkMouseInteractions();
    Director.keyboard.callKeyFunctions(delta);
    Director.quadtree.clear();
    if (Director.continueAnimationLoop) requestAnimationFrame(Director.loop.bind(Director));
  }
  //------------------------- runners
  static run() {
    Director.continueAnimationLoop = true;
    requestAnimationFrame(Director.loop.bind(Director));
  }
  static runOnce(canvas, canvasContainer) {
    Director.continueAnimationLoop = false;
    requestAnimationFrame(Director.loop.bind(Director));
  }
}