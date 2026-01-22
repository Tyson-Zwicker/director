//So this is basically just a map, but you can have more than one thing in it per key.  I use it to store time-based events
//because sometimes things happens at the same time, but I am mostly interest in finding "when" faster than "what".
export default class EventTracker {
  //sortedTimes is built in chronological order, so its already sorted by default.
  //The last thing that happened is on the bottom of the array.
  map = new Map();
  sortedTimes = [];
  add(time, event) {
    if (!this.map.has(time)) {
      this.map.set(time, []);                    //Give this time key an empty array, to hold events..
      this.sortedTimes.push(time);               //add latest time to sorted times
    }
    event['sortedTimeIndex'] = this.sortedTimes.length - 1;  //And tell the event what its sortedTimeIndex was.
    this.map.get(time).push(event);                //now add the event to the time property's arrray.
  }
  getEvents(time) {
    if (this.map.has(time)) {
      return this.map.get(time);
    }
    return null;
  }
  getEventsBefore(time) {    
    let i = 0;
    while (this.sortedTimes[i] < time && i < this.sortedTimes.length) {
      i++;
    }
    i--; //go back by 1 event..
    let result = [];
    for (let eventIndex = i; eventIndex >= 0; eventIndex--) { //work backwards through time..
      result.push(this.map.get(this.sortedTimes[eventIndex]));
    }
    return result;
  }
  getEventsAfter(time) {
    let i = 0;
    while ( this.sortedTimes[i]<time && i < this.sortedTimes.length) {
      i++;    
    }
    let result = [];
    for (let eventIndex = i; eventIndex < this.sortedTimes.length; eventIndex++) {
      result.push(this.map.get(this.sortedTimes[eventIndex]));
    }
    return result;
  }
  removeAt(time, index) {
    if (this.map.has(time)) {
      let events = this.map.get(time);
      if (index < 0 || index >= events.length) throw Error(`EventTracker.removeAt: no event at time [${time}] and index [${index}]`);
      events.splice(index, 1);
      if (events.length === 0) {
        this.map.delete(time); //Empty "time slots" need not be remembered.
      }
    }
  }
  removeFrom(someTime) {
    //return early if we're being asked to wipe out records preexissting any of the records..
    if (this.sortedTimes.length > 0 && this.sortedTimes[0] > someTime) return;
    let sortedTimeIndex = undefined;
    if (this.map.has(someTime) && this.map.get(someTime).length > 0) {
      //Optimistic approach.
      let events = this.map.get(someTime);
      //All the events here will share the same time index, because to be here, you got inserted at that time.
      sortedTimeIndex = events[0].sortedTimeIndex; //We already checked to make sure it has at least one cell to read..
      for (let i = sortedTimeIndex; i >= 0; i--) {
        this.map.delete(this.sortedTimes[i]);
      }
    } else {
      //The brute force way..
      sortedTimeIndex = undefined
      for (let searchIndex = 0; searchIndex < this.sortedTimes.length; searchIndex++) {
        if (this.sortedTimes[searchIndex] > someTime) {
          sortedTimeIndex = searchIndex - 1;
          if (sortedTimeIndex < 0) return; //<- nothing on record at or before the specified time.
          break;
        }
      }
      if (sortedTimeIndex === undefined) throw Error(`EventTracker.removeFrom: No events found at, or prior to, [${someTime}]`);
      for (let removeIndex = sortedTimeIndex; removeIndex >= 0; removeIndex--) {
        this.map.delete(this.sortedTimes[removeIndex]);
      }
    }
    this.sortedTimes.splice(0, sortedTimeIndex + 1);
  }
}
