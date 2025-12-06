import EventTracker from '../eventtracker.js';

startTest();

function startTest(){
  let tracker = new EventTracker();

  let time = 't1000000';
  
  tracker.add (time,{name: "power on"});

  time ='t1000001';
  tracker.add (time, {name: "initializing hardware"});

  time ='t1000013';
  tracker.add (time, {name: "reading OS"});
  
  time ='t1000015';
  tracker.add (time, {name: "checking last log"});
  tracker.add (time, {name: "confirming integrity"});
  
  time='t1000027';
  tracker.add (time, {name: "integrity confirmed"});
  tracker.add (time, {name: "presenting login screen"});
  
  time='t1000033';
  tracker.add (time, {name: "checking provided credentials"});

  time='t1000035';
  tracker.add (time, {name: "credential checks ok"});
  tracker.add (time, {name: "starting shell"});

  time='t1000110';
  tracker.add (time, {name: "file request."}); 
  tracker.add (time, {name: "requesting priviledges"});
  tracker.add (time, {name: "priveldges granted"});
  tracker.add (time, {name: "file sent."});
  console.log (tracker);
/*
  console.log ('   -------Show t1000015--------');
  let eventArray = tracker.getEvents('t1000015');
  console.log (eventArray);

  console.log ('   -------RemoveFrom "t1000027--------');
  tracker.removeFrom ('t1000027');
  console.log (tracker);
  */

}