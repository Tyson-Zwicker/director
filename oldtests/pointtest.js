import Point from '../point.js';

runTest();

function runTest() {
  try {
    let p = new Point(1,1);
    console.log ('p:');
    console.log (p);
    let comp = Point.fromPolar (45,1);
    console.log ('comp:\n');
    console.log (comp);
    p['extradata']='secret information';
    let copy = Point.copy (p);
    console.log ('copy:');
    console.log (copy);
    copy.x = 3;
    copy.y = 4;
    console.log ('copy after change:');
    console.log (copy);
    console.log ('original after change:');
    console.log (p);
    let fromcopy = Point.from (p);
    console.log ('point "frommed" original:');
    console.log (fromcopy);


  } catch (error) {
    console.log(error);
  }
}