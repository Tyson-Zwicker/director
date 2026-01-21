import Director from '../../code/director.js';
import data from './test1_data.js';
document.addEventListener('DOMContentLoaded', function () {
  Director.initialize();
  runTest();
});

function runTest() {
  console.log(`found polygon data. Length: ${data.polygons_json.length}`);
  console.log(`found appearances data. Length: ${data.appearances_json.length}`);
  console.log(`found partTypes data. Length: ${data.partTypes_json.length}`);
  console.log(`found actorTypes data. Length:${data.actorTypes_json.length}.`);
  console.log(`found actors data. Length: ${data.actors_json.length}`);
  Director.importPolygonBank (data.polygons_json);
  console.log (`Director polygons = ${Director.polygonBank.size}`);
  Director.importAppearanceBank (data.appearances_json);
  console.log (`Director appearances = ${Director.appearanceBank.size}`);
  Director.importPartTypes (data.partTypes_json);
  console.log (`Director partTypes = ${Director.partTypes.size}`);

  //TODO:  see notes in obsidian about the requirement for another class..
  //Import actorTypes not working due to name fuckery.  
  Director.importActorTypes (data.actorTypes_json);
  console.log (`Director actorTypes = ${Director.actorTypes.size}`);
  
  Director.importActors (data.actors_json);
  console.log (`Director actors = ${Director.actors.size}`);
  console.log ('actor1:');
  console.log (Director.actors.get('Actor1'));
  console.log ('actor2:');
  console.log (Director.actors.get('Actor2'));
}
