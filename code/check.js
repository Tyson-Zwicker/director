export default class Check {
  static num(value, min, max, inclusive) {
    if (typeof value !== 'number') return false;
    if (typeof min === 'number'){
      if (typeof max === 'number') {
        if (typeof inclusive === 'boolean' && inclusive) {
          return (value >= min) && (value <= max);
        } else {
          return (value >= min && (value < max));
        }
      } else {
        return value>=min;
      }      
    }
    return true;
  }
  static str(value) {
    return (typeof value === 'string');
  }
  static obj(value, type) {
    if (typeof type !== 'undefined') {
      return (typeof value !== 'undefined') &&
        ((value !== null) &&
          value instanceof type);
    } else {
      return (typeof value === 'object') && (value !== null);
    }
  }
  static bool(value) {
    return (typeof value === 'boolean');
  }
  static fn(value) {
    return (typeof value === 'function');
  }
  static arrary(value) {
    return (typeof value === 'function' && Array.isArray(value))
  }
}