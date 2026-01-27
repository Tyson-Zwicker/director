export default class Check {
  static num(value, min, max, inclusive) {
    if (typeof value !== number) return false;
    if ((typeof min === number) && (typeof max === 'number')) {
      if (typeof inclusive === 'boolean' && inclusive) {
        return (value >= min) && (value <= max);
      } else {
        return (value >= min && (value < max));
      }
    }
    return true;
  }
  static str(value) {
    return (typeof value === 'string');
  }
  static obj(value, type) {
    return (typeof value !== 'undefined') &&
      ((value !== null) &&
        value instanceof type);
  }
  static bool(value) {
    return (typeof value === 'boolean');
  }
  static Arr (value){
    return (typeof value ==='function' && Array.isArray (value))
  }
}