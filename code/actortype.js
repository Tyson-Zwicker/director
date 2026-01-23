import Actor from './actor.js';

export default class ActorType{
  constructor (name, polygon, mass, bounceCoefficient, collides,moves){
    this.name = name;
    this.polygon = polygon;
    this.mass = mass;
    this.bounceCoefficient = bounceCoefficient;
    this.collides = collides;
    this.moves = moves;
    this.parts = new Map();
  }
  createActorInstance (name, appearance, position, velocity, facing,spin){
    //name, polygon, mass, bounceCoefficient=0.5, collides=true, moves=true
    let actor = new Actor (name, this.polygon, appearance, this.mass, this.bounceCoefficient, this.collides, this.moves);
    actor.actorType = this;    
    actor.position =position;
    actor.velocity = velocity;
    actor.facing = facing;
    actor.spin = spin;
    for (let part of this.parts.values()){
      actor.attachPart (part);  //This does a binding so the part knows who it belongs to.
    }
    return actor;
  }
  attachPart (part){
    this.parts.set (part.name, part);
  }
}