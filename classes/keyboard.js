export default class Keyboard {
  functions = new Map();
  events = new Map();
  lastKey = undefined;

  bindEvents(){
    window.onkeydown = this.keyDown.bind (this);
    window.onkeyup = this.keyUp.bind (this);
  }

  keyDown(e) {
    this.lastKey = e.key;
    let eventInfo = {};
    if (this.events.has(e.key)) {
      eventInfo['key'] = e.key;
      eventInfo['when'] = Datetime.now;
      let lastEventOnThisKey = Map.get(e.key);
      if (lastEventOnThisKey.action === 'press' || lastEventOnThisKey.action === 'held') {
        eventInfo['action'] = 'held';
        eventInfo['duration'] = eventInfo[when] - lastEventOnThisKey.when;
      }
    } else {
      eventInfo['action'] === 'press';
    }
    this.events.set(eventInfo);
    if (this.functions.has(e.key)) {
      let keyFunction = this.functions.get(e.key);
      keyFunction(eventInfo);
    }
  }
  keyUp(e) {
    this.lastKey = e.key;
    this.events.set({ key: e.key, when: Date.now(), action: 'release' });
    if (this.functions.has(e.key)) {
      let keyFunction = this.functions.get(e.key);
      keyFunction();
    }
  }
  setKeyFunction(key, fn) {
    this.functions.set(key, fn);
  }
}