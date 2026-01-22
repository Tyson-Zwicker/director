import Color from './color.js';

export default class Appearance {
  static default = new Appearance('#555', '#bbb', '#fff');

  constructor(fill, stroke, text, width) {
    this.fillHex = fill;
    this.strokeHex = stroke;
    this.textHex = text;
    this.fillColor = Color.fromHex(fill);
    this.strokeColor = Color.fromHex(stroke);
    this.textColor = (text) ? Color.fromHex(text) : new Color(15, 15, 15, 1);
    this.lineWidth = (width) ? width : 1;
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
