import Director from '../../code/director.js';
import Deserializer from '../../code/deserializer.js';
import data from './test_data.js';
document.addEventListener('DOMContentLoaded', function () {
  Director.initialize();
  loadData();
  Director.run();
});

function loadData() {
  Deserializer.importPolygonBank(data.polygons_json);
  Deserializer.importAppearanceBank(data.appearances_json);
  Deserializer.importPartTypes(data.partTypes_json);
  Deserializer.importActorTypes(data.actorTypes_json);
  Deserializer.importActors(data.actors_json);
  console.log ('data loaded.');
}
