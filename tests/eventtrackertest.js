import EventTracker from '../eventtracker.js';

startTest();

function startTest(){
  let tracker = new EventTracker();

  let time = 't1000000';
  let event1 ={a:1, b:2};
  let event2 ={a:3, b:4};
  let event3 ={a:5, b:6};
  tracker.add (time,event1);

  time ='t1000001';
  tracker.add (time, event2);

  time ='t1000013';
  tracker.add (time, event3);
  
  time ='t1000015';
  tracker.add (time, event1);
  tracker.add (time, event2);
  tracker.add (time, event3);
  //   't1000027'
  time='t1000027';
  tracker.add (time, event3);
  
  time='t1000028';
  tracker.add (time, event1);

  time='t1000038';
  tracker.add (time, event1);
  tracker.add (time, event2);

  console.log (tracker);
  console.log ('   -------RemoveFrom "t1000027--------');
  tracker.removeFrom ('t1000027');
  console.log (tracker);
  

}