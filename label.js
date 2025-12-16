import Director from './director.js';
import Point from './point.js'
import Appearance from './appearance.js';

export default class Label {
  constructor(parent, position, appearance, size, text) {
    if (!(Point.isPointy(parent.position))) throw new Error(`parent must be a Point.Pointy  ${parent.position}`);
    if (!(Point.isPointy(position))) throw new TypeError(`position must be a Point ${position}`);
    if (!(appearance instanceof Appearance)) throw new TypeError('appearance must be an Appearance instance');
    if (!(typeof size == 'number' || size <= 0)) throw new Error(`Label.constructor: size must be a number >0 ${size}`);
    this.parent = parent;
    this.position = position;
    this.appearance = appearance;
    this.text = text;
  }
  draw() {
    let screenPosition = Point.from(this.parent.position);
    let labelOffset = Point.from(this.position);
    Point.scale(labelOffset, Director.view.camera.zoom);
    Point.add(screenPosition, labelOffset);
    Point.sub(screenPosition, Director.view.camera);
    Point.scale(screenPosition, Director.view.camera.zoom);
    Point.add(screenPosition, Director.view.screenCenter);
    Director.view.context.fillStyle = this.appearance.text;
    Director.view.context.textBaseline = 'middle';
    Director.view.context.textAlign = 'center';
    Director.view.context.font =  `${this.size}em monospace`;
    Director.view.context.fillText (this.text, screenPosition.x, screenPosition.y);
  }
}
