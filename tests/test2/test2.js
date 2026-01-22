import Director from '../../code/director.js';
import data from './test2_data.js';
document.addEventListener('DOMContentLoaded', function () {
  Director.initialize();
  loadData();
  Director.run();

});

function loadData() {
  Director.importPolygonBank(data.polygons_json);
  Director.importAppearanceBank(data.appearances_json);
  Director.importPartTypes(data.partTypes_json);
  Director.importActorTypes(data.actorTypes_json);
  Director.importActors(data.actors_json);
  console.log ('data loaded.');
}
