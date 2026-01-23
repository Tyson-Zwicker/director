import Color from './color.js';

export default class Appearance {
  static default = new Appearance('default','#555', '#bbb', '#fff');

  constructor(name, fill, stroke, text, width=1) {
    this.name = name;
    this.fillHex = fill;
    this.strokeHex = stroke;
    this.textHex = text;
    this.fillColor = Color.fromHex(fill);
    this.strokeColor = Color.fromHex(stroke);
    this.textColor = (text) ? Color.fromHex(text) : new Color(15, 15, 15, 1);
    this.lineWidth = width;
  }
  setfillFromHex(value) {
    this.fill = Color.fromHex(value);
  }
  setStrokeFromHex(value) {
    this.stroke = Color.fromHex(value);
  }
  setTextFromHex(value) {
    this.text = Color.fromHex(value);
  }
  setTextFromHex(value) {
    this.text = Color.fromHex(value);
  }
}
