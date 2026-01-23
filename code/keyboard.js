export default class Keyboard {
  functions = new Map();
  events = new Map();

  bindEvents() {
    window.onkeydown = this.keyDown.bind(this);
    window.onkeyup = this.keyUp.bind(this);
  }

  keyDown(e) {
    let eventInfo;
    if (this.events.has(e.key)) {
      let lastEvent = this.events.get(e.key);
      if (lastEvent.action === 'press') {
        eventInfo = getHoldEvent(e, lastEvent.when);
      } else if (lastEvent.action === 'release') {
        eventInfo = getPressEvent(e);
      } else {
        eventInfo = getUpdateHoldEvent(e, lastEvent.holdstart);
      }
      events.set(e.key, eventInfo);      
    }
  }
  keyUp(e) {
    let eventInfo;
    if (this.events.has(e.key)) {
      let lastEvent = this.events.get(e.key);
      if (lastEvent.action === 'press') {
        eventInfo = getReleaseEvent(e, 0);
      } else if (lastEvent.action === 'hold') {
        eventInfo = getReleaseHoldEvent(e, lastEvent.duration);
      }
      events.set(e.key, eventInfo);     
    }
  }
  setKeyFunction(key, fn) {
    this.functions.set(key, fn);
  }
  getPressEvent(e) {
    return { "key": e.key, "when": DateTime.now, "duration": 0, "action": 'press' };
  }
  getHoldEvent(e, pressStartTime) {
    let now = Date.now();
    let dur = now - pressStartTime;
    return { "key": e.key, "when": now, "holdstart": pressStartTime, "duration": dur, "action": 'hold' };
  }
  getUpdateHoldEvent(e, holdStartTime) {
    let now = Date.now();
    let dur = now - holdStartTime;
    return { "key": e.key, "when": now, "holdstart": pressStartTime, "duration": dur, "action": 'hold' };
  }
  getReleaseEvent(e, duration) {
    return { "key": e.key, "when": now, "duration": duration, "action": 'release' };
  }
  getReleaseHoldEvent(e, duration) {
    return { "key": e.key, "when": now, "duration": duration, "action": 'release' };
  }
  callKeyFunctions(){
    for (let key  in this.events.keys()){
      if (this.functions.has(key)){
        this.functions.get(key)(this.events.keys);
      }
    }
    this.events.clear();
  }
}