//So this is basically just a map, but you can have more than one thing in it per key.  I use it to store time-based events
//because sometimes things happens at the same time, but I am mostly interest in finding "when" faster than "what".


export default class EventTracker {
  sortedTimes = [];
  map = new Map();
  //The last thing that happened is on the bottom of the array.
  add(time, evt) {
    if (!this.map.has(time)) {
      this.map.set (time,[]);                    //Give this time key an empty array, to hold events..
      this.sortedTimes.push(time);               //add latest time to sorted times
    }
    evt['sortedTimeIndex'] = this.sortedTimes.length-1;  //And tell the event what its sortedTimeIndex was.
    this.map.get(time).push ( evt);                //now add the event to the time property's arrray.
    console.log (evt);
    console.log (this.map);
  }
  getEvents (time){
    if (this.map.has(time)) {
      console.log (this.map.get(time));
      return this.map.get(time);
    }
    return null;
  }
  removeFrom(someTime) {
    //Try to find the actual "someTime" in the map, but (when its not there) fallback to:
    //start from the top of sorted time, as it will be the oldest.  We'll probaly want to get rid of the old stuff not the new stuff.
    //once you find on that is => someTime, iterate tha map and remove the older stuff, using sortedTimes as key, reading from the top.
    //then splice the top off of the sortTimes array.
    let sortedTimeIndex = undefined;
    if (this.map.has(someTime)) {
      //Optimistic approach.
      let evt = this.map.get(someTime);
      sortedTimeIndex = evt.sortedTimeIndex;
      for (let i = sortedTimeIndex; i > 0; i--) {
        this.map.delete (this.sortedTimes[i]);
      }
    } else {
      //The brute force way..
      sortedTimeIndex = undefined
      for (let searchIndex = this.sortedTimes.length-1; searchIndex > 0 ; searchIndex++) {
        if (this.sortedTimes[searchIndex] <= someTime) {
          sortedTimeIndex = searchIndex;          
        }        
      }
      if (sortedTimeIndex === undefined) throw Error (`EventTracker.removeFrom: No events found at, or prior to, [${time}]`);
      for (let removeIndex = sortedTimeIndex; removeIndex>0; removeIndex--) {
          this.map.delete (this.sortedTimes[removeIndex]);
      }
    }
    this.sortedTimes.splice(0, sortedTimeIndex + 1);
  }
  removeAt(time, index) {
    if (this.map.has(time)) {
      let events = this.map.get(time);
      if (events.length-1>index) throw error (`EventTracker.removeAt: no event at time [${time}] and index [${index}]`);
      events.splice (index,1);
    }
  }
}
