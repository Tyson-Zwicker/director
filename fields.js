/*This can be applied to a static point OR an actor.
F=ma, a= `v/t, d = 1 pixel, v= 1 pixel/second, and t is time in milliseconds (delta time).
*/
import Actor from './actor.js';
export default class Field {

    strength = undefined;
    actorName = undefined;
    constructor(actorName, strength) {
        if (typeof strength !== 'number') throw Error(`Field.constructor: strength is not a number [${strength}]`);
        if (typeof actorName !=='string') throw Error(`Field.constructor: actorName is not a string. [${actorName}]`)
        this.strength = strength;
        this.actorName = actorName;
    }
    
}