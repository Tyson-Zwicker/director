import Appearance from './appearance.js';
import ActorType from './actortype.js';
import Part from './part.js';
import Polygon from './polygon.js';
import Point from './point.js';
import Director from './director.js';
export default class Deserializer {
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
}