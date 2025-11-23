/*This can be applied to a static point OR an actor.
F=ma, a= dv/t, d = 1 pixel, v= 1 pixel/second, and t is.. time.
*/
class Field {
    force = undefined;
    oring = undefined;
    constructor(force, origin) {
        if (typeof force !== 'number') throw Error(`Field.constructor: force is not a number [${force}]`);
        if (!Point.isPointy(origin)) throw Error(`Field.constructor: origin is not a point. [${origin}]`)
        this.force = force;
        this.origin = origin;
    }
    
}