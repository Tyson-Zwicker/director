import Quadtree from '../quadtree.js';
import Boundry from '../boundry.js';
import Rnd from '../rnd.js';

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

  let maxActors = 500;

  for (let i = 0; i < maxActors; i++) actors.push({"position":{"x":Rnd.int (-399,399), "y":Rnd.int (-399,399)}, "radius":Rnd.int (2,5)});

  let actorIndex = 0;
  const intervalId = setInterval(() => {
    //console.log ('index:'+actorIndex)
    //console.log ('before insert:'+qt.actors.length);
    qt.insert(actors[actorIndex]);
    //console.log ('after insert:'+qt.actors.length);
    qt.draw(context, 400, 400);//offset to center of canvas.
    actorIndex++;
    if (actorIndex === actors.length) clearInterval(intervalId);
  }, 100);
}
