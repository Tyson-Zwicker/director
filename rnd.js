export default class Rnd {
  static int(min, max) { // max not inclusive..
    return Math.floor(min + Math.random() * (Math.abs(max) - min));
  }

  static float(min, max) { //max not inclusive..
    if (!max) max = 1;
    if (!min) min = 0;
    return min + Math.random() * (Math.abs(max) - min);
  }
  static hex(min, max) { //0-16 in string..
    if (!min) min =0;
    if (!max) max = 16;
    return Number.toString(Rnd.int(min, max));
  }
  static norm() {//A normalized vector
    return new Point(Rnd.float(-1, 1), Rnd.float(-1, 1));
  }
  static vect(minAngle, maxAngle, minMag, maxMag) {
    let a = Rnd.float(minAngle, maxAngle);
    let m = Rnd.float(minMag, maxMag);
    return Point.fromPolar(a, m);
  }
}