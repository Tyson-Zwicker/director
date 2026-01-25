import Color from './color.js';
export default class Draw {
  constructor(context2d) {
    this.g = context2d;
  }
  boxHex(x1, y1, x2, y2, hexColor) {
    if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) throw new Error(`line.draw bad: coordinates (${x1},${y1}) (${x2},${y2})`);

    this.g.strokeStyle = hexColor;
    this.g.beginPath();
    this.g.rect(x1, y1, x2 - x1, y2 - y1);
    this.g.stroke();
  }
  fillboxHex(x1, y1, x2, y2, hexColor) {
    if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) throw new Error(`line.draw bad: coordinates (${x1},${y1}) (${x2},${y2})`);

    this.g.fillStyle = hexColor;
    this.g.beginPath();
    this.g.fillRect(x1, y1, x2 - x1, y2 - y1);
    this.g.fill();
  }
  lineHex(line, hexColor) {
    this.g.strokeStyle = hexColor;
    this.g.beginPath();
    this.g.moveTo(line.p0.x, line.p0.y);
    this.g.lineTo(line.p1.x, line.p1.y);
    this.g.stroke();
  }
  circleHex(x, y, radius, hexColor) {
    this.g.fillStyle = hexColor;
    this.g.beginPath();
    this.g.arc(x, y, radius, 0, Math.PI * 2);
    this.g.fill();
  }
  box(x1, y1, x2, y2, colorOrGradient, lineWidth) {
    if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) throw new Error(`line.draw bad: coordinates (${x1},${y1}) (${x2},${y2})`);
    if (colorOrGradient instanceof Color) {
      this.g.strokeStyle = colorOrGradient.asHex();
    } else {
      this.g.strokeStyle = colorOrGradient;
    }
    this.g.lineWidth = lineWidth;
    this.g.beginPath();
    this.g.rect(x1, y1, x2 - x1, y2 - y1);
    this.g.stroke();
  }
  fillBox(x1, y1, x2, y2, colorOrGradient) {
    if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) throw new Error(`line.draw bad: coordinates (${x1},${y1}) (${x2},${y2})`);
    if (colorOrGradient instanceof Color) {
      this.g.fillStyle = colorOrGradient.asHex();
    } else {
      this.g.fillStyle = colorOrGradient;
    }
    this.g.beginPath();
    this.g.fillRect(x1, y1, x2 - x1, y2 - y1);
    this.g.fill();
  }
  line(x1, y1, x2, y2, w, colorOrGradient) {
    if (isNaN(w)) throw new Error('no width defined.');
    if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) throw new Error(`line.draw bad: coordinates (${x1},${y1}) (${x2},${y2})`);
    if (colorOrGradient instanceof Color) {
      this.g.strokeStyle = colorOrGradient.asHex();
    } else {
      this.g.strokeStyle = colorOrGradient;
    }
    this.g.lineWidth = w;
    this.g.beginPath();
    this.g.moveTo(x1, y1);
    this.g.lineTo(x2, y2);
    this.g.stroke();
  }
  //x,y are the upper left hand corner
  getTextSize(text, fontSize, fontName) {
    this.g.textBaseline = 'top';
    this.g.textAlign = 'left';
    this.g.font = `${fontSize}px ${fontName}`;
    let metrics = this.g.measureText(text);
    return { "width": metrics.width, "height": (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) ?? fontSize };
  }
  textBox(x1, y1, x2, y2, text, fontSize, fontName, appearance) {
    this.fillBox(x1, y1, x2, y2, appearance.fillHex);
    this.box(x1, y1, x2, y2, appearance.stokeHex, appearance.lineWidth);
    
    this.g.fillStyle = appearance.textHex;
    this.g.textBaseline = 'top';
    this.g.textAlign = 'left';
    this.g.font = `${fontSize}px ${fontName}`;
    let textSize = this.getTextSize(text, fontSize, fontName);
    let tx = x1 + ((x2 - x1) - textSize.width) / 2;
    let ty = y1 + ((y2 - y1) - textSize.height) / 2;
    this.g.fillText(text, tx, ty);
  }
}
