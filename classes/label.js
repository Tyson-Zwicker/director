import Director from './director.js';
import Point from './point.js'
import Appearance from './appearance.js';
import Transpose from './transpose.js';
export default class Label {
  constructor(parent, position, appearance, size, text) {    
    if (!(Point.isPointy(parent.position))) throw new Error(`parent must be a Point.Pointy  ${parent.position}`);
    if (!(Point.isPointy(position))) throw new Error(`position must be a Point ${position}`);
    if (!(appearance instanceof Appearance)) throw new Error('appearance must be an Appearance instance');
    if (!(typeof size == 'number' || size <= 0)) throw new Error(`Label.constructor: size must be a number >0 ${size}`);
    this.parent = parent;
    this.position = position;
    this.facing = 90; //defaults to being "under" the actor its attached to 
    this.appearance = appearance;
    this.text = text;
  }
  draw() {
    let screenPosition = Transpose.childToScreen (this,this.parent);
    Director.view.context.fillStyle = this.appearance.text;
    Director.view.context.textBaseline = 'middle';
    Director.view.context.textAlign = 'center';
    Director.view.context.font =  `${this.size}em monospace`;
    Director.view.context.fillText (this.text, screenPosition.x, screenPosition.y);
  }
}
