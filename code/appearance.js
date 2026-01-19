import Color from './color.js';

export default class Appearance {
  static  default = new Appearance ('#555','#bbb','#fff');
  constructor(fill, stroke, text, width) {
    this.fill = Color.fromHex(fill);
    this.stroke = Color.fromHex(stroke);
    this.text = (text) ? Color.fromHex(text) : new Color(15, 15, 15, 1);
    this.lineWidth = (width) ? width : 1;
  }
  getFillAsHex() {
    return this.fill.asHex();
  }
  setfillAsHex(value) {
    this.fill = Color.fromHex(value);
  }
  getStrokeAsHex() {
    return this.stroke.asHex();
  }
  setStrokeAsHex(value) {
    this.stroke = Color.fromHex(value);
  }
  getText() {
    return this.text.asHex();
  }
  setText(value) {
    this.text = Color.fromHex(value);
  }
}
