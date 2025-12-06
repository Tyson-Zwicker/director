//So this is basically just a map, but you can have more than one thing in it per key.  I use it to store time-based events
//because sometimes things happens at the same time, but I am mostly interest in finding "when" faster than "what".


export default class EventTracker {
  sortedTimes = [];
  map = new Map();
  //The last thing that happened is on the bottom of the array.
  add(time, event) {
    if (!this.map.has(time)) {
      this.map.set (time)=[];                       //Add array tto this "time property" to recieve new arrival..
      this.sortedTimes.push(time);               //add latest time to sorted times
    }
    this.map.get(time).push = [value];             //now add the event to the time property's arrray.
    event[sortedTimeIndex] = sortedTimes.length-1;  //And tell the event what its sortedTimeIndex was.
  }
  getEvents (time){
    if (this.map.has(time)) return map.get(time);
    return null;
  }
  removeFrom(someTime) {
    //Try to find the actual "someTime" in the map, but (when its not there) fallback to:
    //start from the top of sorted time, as it will be the oldest.  We'll probaly want to get rid of the old stuff not the new stuff.
    //once you find on that is => someTime, iterate tha map and remove the older stuff, using sortedTimes as key, reading from the top.
    //then splice the top off of the sortTimes array.
    let sortedTimesIndex = undefined;
    if (this.map.has(someTime)) {
      //Optimistic approach.
      let event = this.map.get(someTime);
      sortedTimesIndex = event.sortedTimesIndex;
      for (let i = sortedTimesIndex; i > 0; i--) {
        this.map.delete (sortedTimes[i]);
      }
    } else {
      //The brute force way..
      sortedTimesIndex = undefined
      for (let searchIndex = sortedTimes.length-1; searchIndex > 0 ; searchIndex++) {
        if (this.sortedTimes[i] <= someTime) {
          sortedTimesIndex = i;          
        }        
      }
      if (sortedTimesIndex === undefined) throw Error (`EventTracker.removeFrom: No events found at, or prior to, [${time}]`);
      for (let removeIndex = sortedTimesIndex; removeIndex--; removeIndex > 0) {
          this.map.delete (sortedTimes[removeIndex]);
      }
    }
    this.sortedTimes.splice(0, sortedTimesIndex + 1);
  }
  removeAt(time, index) {
    if (map.has(time)) {
      map.delete(time);
    }
  }
}
