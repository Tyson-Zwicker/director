import Director from '../../code/director.js';
import Deserializer from '../../code/deserializer.js';
import data from './test_data.js';

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
  Deserializer.importPolygonBank (data.polygons_json);
  console.log (`Director polygons = ${Director.polygonBank.size}`);
  Deserializer.importAppearanceBank (data.appearances_json);
  console.log (`Director appearances = ${Director.appearanceBank.size}`);
  console.log (Director.appearanceBank);
  Deserializer.importPartTypes (data.partTypes_json);
  console.log (`Director partTypes = ${Director.partTypes.size}`);
  
  Deserializer.importActorTypes (data.actorTypes_json);
  console.log (`Director actorTypes = ${Director.actorTypeBank.size}`);
  console.log (Director.actorTypeBank);
  
  Deserializer.importActors (data.actors_json);
  console.log (`Director actors = ${Director.actors.size}`);
  console.log (Director.actors);
}
