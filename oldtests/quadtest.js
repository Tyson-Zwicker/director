import Quadtree from '../quadtree.js';
import Boundry from '../boundry.js';

// ----------> PRIME MOVER <-------------

init();
export default function init() {
  let canvas = document.getElementById('canvas');
  canvas.width = 800;
  canvas.height = 800;
  let context = canvas.getContext('2d');
  context.fillStyle = '#223';
  context.fillRect(0, 0, canvas.width, canvas.height);
  let boundry = new Boundry(-400, -400, 400, 400);
  let qt = new Quadtree(boundry, 1, 10);
  let actors = [];
  /*actors.push({ "x": 100, "y": 100, "radius": 20 });
  actors.push({ "x": -200, "y": 250, "radius": 20 });
  actors.push({ "x": 300, "y": -150, "radius": 20 });
  actors.push({ "x": 200, "y": 200, "radius": 20 });
  actors.push({ "x": -300, "y": -250, "radius": 20 });
  actors.push({ "x": 200, "y": -300, "radius": 20 });
  actors.push({ "x": -150, "y": -350, "radius": 20 });*/

  for (let i = 0; i < 50; i++) actors.push({"x":rnd (-399,399), "y":rnd (-399,399), "radius":rnd (2,20)});

  let actorIndex = 0;
  const intervalId = setInterval(() => {
    qt.insert(actors[actorIndex]);
    qt.draw(context, 400, 400);//offset to center of canvas.
    actorIndex++;
    if (actorIndex === actors.length) clearInterval(intervalId);
  }, 1000);
}
function step() {

}
function rnd(min, max) {
  return Math.floor(min + (max - min) * Math.random());
}
