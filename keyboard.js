import EventTracker from './eventtrackers.js';

export default class Keyboard {
  static initialize() {
    Keyboard.functions = new Map();
    Keyboard.events = new Map();
    window.onkeydown = function (e) {
      let eventInfo = {};
      if (Keyboard.events.has(e.key)) {
        eventInfo[key] = e.key;
        eventInfo[when] = Datetime.now;
        let lastEventOnThisKey = Map.get(e.key);
        if (lastEventOnThisKey.action === 'press' || lastEventOnThisKey.action === 'held') {
          eventInfo[action] = 'held';
          eventInfo[duration] = eventInfo[when] - lastEventOnThisKey.when;
        }
      } else {
        eventInfo[action] === 'press'
      }
      Keyboard.events.set(eventInfo);
      if (Keyboard.functions.has(e.key)) {
        let keyFunction = Keyboard.functions.get(e.key);
        keyFunction(eventInfo);
      }
    }
    window.onkeyup = function (e) {
      Keyboard.events.set({ key: e.key, when: Date.now(), action: 'release' });
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