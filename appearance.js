export default class Appearance {
  constructor(fill, stroke, text, width) {
    this.fill = (fill) ? fill : "#444";
    this.stroke = (stroke) ? stroke : "#888";
    this.text = (text) ? text : "#fff";
    this.width = (width) ? width : 1;
  }
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
}