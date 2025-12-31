import EventTracker from '../classes/eventtracker.js';

startTest();

function startTest(){
  let tracker = new EventTracker();

  let time = 1000000;
  
  tracker.add (time,{name: "power on"});

  time =1000001;
  tracker.add (time, {name: "initializing hardware"});

  time =1000013;
  tracker.add (time, {name: "reading OS"});
  
  time =1000015;
  tracker.add (time, {name: "checking last log"});
  tracker.add (time, {name: "confirming integrity"});
  
  time=1000027;
  tracker.add (time, {name: "integrity confirmed"});
  tracker.add (time, {name: "presenting login screen"});
  
  time=1000033;
  tracker.add (time, {name: "checking provided credentials"});

  time=1000035;
  tracker.add (time, {name: "credential checks ok"});
  tracker.add (time, {name: "starting shell"});

  time=1000110;
  tracker.add (time, {name: "file request."}); 
  tracker.add (time, {name: "requesting priviledges"});
  tracker.add (time, {name: "priveldges granted"});
  tracker.add (time, {name: "file sent."});
  console.log (tracker);

  console.log ('   -------Show t1000027--------');
  let eventArray = tracker.getEvents(1000027);
  console.log (eventArray);

  console.log ('  --------Show before t1000028');
  let beforeArray = tracker.getEventsBefore (1000028)
  console.log (beforeArray);
  console.log ('  --------Show after t1000015');
  let afterArray = tracker.getEventsAfter (1000015);
  console.log (afterArray);
  console.log ('   -------RemoveFrom "t1000026--------');
  tracker.removeFrom (1000026);
  console.log (tracker);

  console.log ('   --------------------');
  console.log (tracker);
}