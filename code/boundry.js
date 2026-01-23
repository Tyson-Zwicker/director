import Point from './point.js';
export default class Boundry {
  constructor(x1, y1, x2, y2) {
    //Ensure (this.x1,this.y1) is upper right and (this.x2, this.y2) is lower left
    if (!(typeof x1 ==='number' &&
      typeof y1 ==='number' &&
      typeof x2 ==='number' &&
      typeof y2 ==='number')){
        throw new Error (`One of the parameters is not a number x1 ${x1}, y1 ${y1}, x2 ${x2}, y2 ${y2}`);
      }
    if (x2 - x1 > 0 && y2 - y1 > 0) { //x1,y1 = upper left, and x2,y2 = bottom right..
      this.x1 = x1;
      this.x2 = x2;
      this.y1 = y1;
      this.y2 = y2;
    }
    if (x2 - x1 < 0 && y2 - y1 > 0) {  //x1,y1 = upper right, and x2,y2 = bottom left
      this.x1 = x2;
      this.x2 = x1;
      this.y1 = y1;
      this.y2 = y2;
    }
    if (x2 - x1 > 0 && y2 - y1 < 0) { //x1,y1 = bottom left, x2,y2 == upper right
      this.x1 = x1;
      this.x2 = x2;
      this.y1 = y2;
      this.y2 = y1;
    }
    if (x2 - x1 < 0 && y2 - y1 < 0) {// x1,y1 = bottom right, x2,y2 = upper left}
      this.x1 = x2;
      this.x2 = x1;
      this.y1 = y2;
      this.y2 = y1;
    }
  }

  get width() {
    return this.x2 - this.x1;
  }

  get height() {
    return this.y2 - this.y1;
  }

  isBoundry() {
    return (this.x2 > this.x1) && (this.y2 > this.y1) && (!isNaN(this.x1 + this.x2 + this.y1 + this.y2));
  }
  isPointInside(x, y) {
    return (x > this.x1 && x < this.x2 && y > this.y1 && y < this.y2);
  }
  isPointOnEdge(x, y) {
    if (x === this.x1 && y > this.y1 && y < this.y2) return true; //left edge
    if (x === this.x2 && y > this.y1 && y < this.y2) return true; //right edge
    if (y === this.y1 && x > this.x1 && x < this.x2) return true //top edge
    if (y === this.y2 && x > this.x1 && x < this.x2) return true //top edge
    return false;
  }
  isOverlapping(boundry){
    //return true If BOTH of the boundry's x are OUTSIDE but BOTH of the y's ARE INSIDE. 
    //OR IF y's are BOTH outside and x's are BOTH inside
    return false;
  }
  static touches(boundry1, boundry2) {
    let x = []; let y = [];

    x[0] = boundry1.x1; y[0] = boundry1.y1;//top left
    x[1] = boundry1.x2; y[1] = boundry1.y1;//top right
    x[2] = boundry1.x1; y[2] = boundry1.y2//bottom left
    x[3] = boundry1.x2; y[3] = boundry1.y2;//botttom right
    for (let i = 0; i < 4; i++) {
      if (boundry2.isPointInside(x[i], y[i]) || boundry2.isPointOnEdge(x[i], y[i])) return true;
    }
    x[0] = boundry2.x1; y[0] = boundry2.y1;//top left
    x[1] = boundry2.x2; y[1] = boundry2.y1;//top right
    x[2] = boundry2.x1; y[2] = boundry2.y2//bottom left
    x[3] = boundry2.x2; y[3] = boundry2.y2;//botttom right
    for (let i = 0; i < 4; i++) {
      if (boundry1.isPointInside(x[i], y[i]) || boundry1.isPointOnEdge(x[i], y[i])) return true;
    }
    return false;
  }
}