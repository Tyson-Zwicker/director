//So this is basically just a map, but you can have more than one thing in it per key.  I use it to store time-based events
//because sometimes things happens at the same time, but I am mostly interest in finding "when" faster than "what".

class EventTracker {
  sortedTimes = [];
  map = {};
  //The last thing that happened is on the bottom of the array.
  add(time, event) {
    if (this.map.hasOwnProperty(time)) {
      if (sortedTime[sortedTime.length - 1] < time) {
        sortedTimes.push(time);
      }
      event[sortedTimesIndex] = sortedTimes.length - 1;
      map[time].push(event);
    }
    else map[time] = [value];
  }
  removeFrom(someTime) {
    //Try to find the actual "someTime" in the map, but (when its not there) fallback to:
    //start from the top of sorted time, as it will be the oldest.  We'll probaly want to get rid of the old stuff not the new stuff.
    //once you find on that is => someTime, iterate tha map and remove the older stuff, using sortedTimes as key, reading from the top.
    //then splice the top off of the sortTimes array.

    let sortedTimesIndex = undefined;
    if (map.has(someTime)) {
      //Optimistic approach.
      let event = map.get(someTime)
      sortedTimesIndex = event.sortedTimesIndex;
      for (let i = sortedTimesIndex; i > 0; i--) {
        map.delete(sortedTimes[i]);
      }
    } else {
      //The brute force way..
      for (let i = 0; i < sortedTimes.length; i++) {
        if (sortedTimes[i] > someTime) {
          sortedTimesIndex = i - 1;
          for (let removeIndex = sortedTimesIndex; removeIndex--; removeIndex > 0) {
            map.delete(sortedTimes[removeIndex]);
          }
        }
      }
    }
    sortedTimesIndex.splice(0, sortedTimesIndex + 1);
  }
  removeAt(time, index) {
    if (map.has(time)) {
      map.delete(time);
    }
  }
}
