/*This can only be applied to an actor and only affects other actors..
World Physical Constants, such as they are:
F=ma, a= `v/t, d = 1 pixel, v= 1 pixel/second, and t is time in milliseconds (delta time).
*/
import Actor from './actor.js';
import Point from './point.js';
export default class ActorField {
    actor = undefined;
    strength = undefined;    
    constructor(actor, strength) {
        if (typeof strength !== 'number') throw Error(`Field.constructor: strength is not a number [${strength}]`);
        if (!(actor instanceof Actor)) throw Error(`Field.constructor:  Actor is not an actor [${actor}]`)
        this.strength = strength;
        this.actor = actor;
    }
    enactForce(otherActor) {
        if (this.actor !== otherActor) { //do not interact with yourself...
            let distance = Point.distance(this.actor.position, otherActor.position);
            if (distance === 0) {
                throw Error(`Director.applyActorField: Actor ${actor} and other actor ${otherActor} BOTH exist at (${actor.position.x},${actor.position.y}).`);
            }
            // a = F/m, F = strength/d^2
            // This is one sided. The other object may or may not also excert a force on this actor
            // They BOTH get pulled though: Newton's 3rd law of motion.
            let force = this.strength / distance ** 2;
            let otherActorAcceleration = -force / otherActor.mass;
            let actorAcceleration = force / this.actor.mass;
            let direction = Point.from(this.actor.position);
            Point.sub(direction, otherActor.position);
            Point.normalize(direction); //This vector now points FROM actor to other vector.
            let a1 = direction; //  RE-USING direction
            let a2 = Point.from(direction); //and getting a vector for the other actor..
            Point.scale(a1, actorAcceleration);
            Point.scale(a2, otherActorAcceleration);
            Point.add(this.actor.velocity, a1);  //Then add it to the actors' velocities.
            Point.add(otherActor.velocity, a2);
            
        }
    }   
    toString (){
        return `ActorField [actor:${this.actor.name}, strength:${this.strength}]`;
    }
}