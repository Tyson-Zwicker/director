import EventTracker from './eventtrackers.js';

export default class Keyboard {
  static initialize() {
    Keyboard.functions = new Map();
    window.onkeydown = function (e) {
      Keyboard.events.add({ key: e.key, when: Date.now(), action: 'press' });
      if (Keyboard.functions.has(e.key)) {
        let keyFunction = Keyboard.functions.get(e.key);
        keyFunction();
      }
    }
    window.onkeyup = function (e) {
      Keyboard.events.add({ key: e.key, when: Date.now(), action: 'release' });
      if (Keyboard.functions.has(e.key)) {
        let keyFunction = Keyboard.functions.get(e.key);
        keyFunction();
      }
    }
  }
  static setKeyFunction(key, fn) {
    Keyboard.functions.set(key, fn);
  }
}