import Color from './color.js';

export default class Appearance {
  static grey = new Appearance('default', '#555', '#bbb', '#fff');
  static red = new Appearance('red', '#a50', '#f00', '#f55');
  static green = new Appearance('green', '#090', '#0f0', '#5f5');
  static blue = new Appearance('blue', '#009', '#00f', '#77f');
  static cyan = new Appearance('cyan', '#099', '#0ff', '#5ff');
  static yellow = new Appearance('yellow', '#bb0', '#ff0', '#ff6');
  static purple = new Appearance('purple', '#909', '#b0b', '#f0f');
  constructor(name, fill, stroke, text, width = 1) {
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

  static color(i) {
    switch (i) {
      case 0: return Color.red();
        break;
      case 1: return Color.red();
        break;
      case 2: return Color.green();
        break;
      case 3: return Color.blue();
        break;
      case 4: return Color.cyan();
        break;
      case 5: return Color.red();
        break;
      case 6: return Color.red();
        break;
      case 7: return Color.red();
        break;
      case 8: return Color.red();
        break;
      case 9: return Color.red();
        break;
    }
  }
}
