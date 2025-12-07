import Color from './color.js';

export default class Appearance {
  _fill = undefined;
  _stroke = undefined;
  _text = undefined;
  constructor(fill, stroke, text, width) {
    this._fill = Color.fromHex(fill);
    this._stroke = Color.fromHex(stroke);
    this._text = (text) ? Color.fromHex(text) : new Color(15, 15, 15, 1);
    this.width = (width) ? width : 1;
  }
  get fill() {
    return this._fill.asHex();
  }
  set fill(value) {
    this._fill = Color.fromHex(value);
  }
  get stroke() {
    return this._stroke.asHex();
  }
  set stroke(value) {
    this._stroke = Color.fromHex(value);
  }
  get _text() {
    return this._text.asHex();
  }
  set text(value) {
    this._text = Color.fromHex(value);
  }
}

/*
add(kind, fill, stroke, text, width) {
  this[kind] = { "fill": fill, "stroke": stroke, "text": text, "width": width }
}
 
get(kind) {
  if (!kind) {
    return this;
  } else {
    return this[kind];
  }
}
  */
