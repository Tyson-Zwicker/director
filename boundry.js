import Point from './point.js';
export default class Boundry {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
    static getActorBounds(actor) {
        return new Boundry(
            actor.position.x - actor.radius(),
            actor.position.y - actor.radius(),
            actor.position.x + actor.radius(),
            actor.position.y + actor.radius()
        );
    }

    touches(otherBoundry) {
        //Horizontal boundry violation (left OR right) AND vertical boundry violation (top OR bottom) = touching.
        //basically, its just checking all four corners of the boundry.  This should include cases where it is entirely inside
        //of ther other bounrdry to.
        return (
            ((otherBoundry.x2 > this.x1 && otherBoundry.x2 < this.x2) ||
                (otherBoundry.x1 > this.x1 && otherBoundry.x1 < this.x2)) ||
            ((otherBoundry.y2 > this.y1 && otherBoundry.y2 < this.y2) ||
                (otherBoundry.y1 > this.y1 && otherBoundry.y1 < this.y2)));
    }
    isBoundry(){
        return (this.x2>this.x1) && (this.y2>this.y1) && (!isNaN (this.x1+this.x2+this.y1+this.y2)); 
    }
}
