import Appearance from './appearance.js';
import Director from './director.js';
import Part from './part.js';
import Polygon from './polygon.js';
document.addEventListener('DOMContentLoaded', function () {
  init();
});

function init() {
  Director.initialize();
  //Add an Appearance to the director
  //  Director.AppearanceBank.set(appr.name, new Appearance(appr.fill, appr.stroke, appr.text, appr.width));
  let appearanceData = `
    {"appearances":[
      {
      "name":"red",
      "fill": "#900",
      "stroke": "#f00",
      "text": "#fff",
      "width": 1
      },
      {
      "name":"green",
      "fill": "#090",
      "stroke": "#0f0",
      "text": "#fff",
      "width": 1
      },
      {
      "name":"blue",
      "fill": "#009",
      "stroke": "#00f",
      "text": "#fff",
      "width": 1
      }
    ]}
  `;
  let polygonData = `
    {"polygons": [
      {
      "name":"triangle",
      "points": [
        {"x": -100, "y": 100},
        {"x": 100, "y": 100},
        {"x": 0, "y": -100}
      ]
      },
      {
      "name":"smallbox",
      "points": [
        {"x": -20, "y": -20},
        {"x": 20, "y": -20},
        {"x": 20, "y": 20},
        {"x": -20, "y": 20}
      ]
      },
      {
      "name":"smalltriangle",
      "points": [
        {"x": -20, "y": 20},
        {"x": 20, "y": 20},
        {"x": 0, "y": -20}
      ]
      }
    ]}
  `;

  let partTypeData = `
    {"partTypes" :[
      {"name" : "partType1", "polygon": "smalltriangle"},
      {"name" : "partType2", "polygon": "smallbox"}
    ]}
  `;
  let actorData = `
  {
  "actors": [
    {
      "name": "testActor1",
      "appearance": "red",
      "polygon" : "triangle",
      "bounceCoefficient": 0.5,
      "mass": 100,
      "collides": true,
      "moves": true,
      "parts": [       
        {
          "partType": "partType1",
          "name": "blueTriangle",
          "position": {
            "x": 0,
            "y": -50
          },
          "facing": -60,                    
          "appearance": "blue"
        },
        {
          "partType": "partType2",
          "name": "greenbox",
          "position": {
            "x": 0,
            "y": 50
          },
          "facing": 45,                    
          "appearance": "green"
        }     
      ],
      "position": {
        "x": -500,
        "y": 0
      },
      "facing": 45,
      "spin": -10,
      "velocity": {
        "x": 0,
        "y": 0
      }
    },
     {
      "name": "testActor2",
      "appearance": "green",
      "polygon": "triangle",
      "mass": 100,
      "bounceCoefficient": 0.5,
      "collides": true,
      "moves": true,
      "parts": [],
      "position": {
        "x": 0,
        "y": 500
      },
      "facing": 0,
      "spin": 5,
      "velocity": {
        "x": 0,
        "y": 0
      }
    }
  ]}
  `;
  console.log('Adding appearances..');
  Director.importAppearanceBank(appearanceData);
  console.log(Director.appearanceBank);
  //Add a Polygon to the director
  console.log('adding polygons.');
  Director.importPolygonBank(polygonData);
  console.log(Director.polygonBank);
  //Add a partType to the director
  console.log('adding partTypes');
  Director.importPartTypes(partTypeData);
  console.log(Director.partTypes);

  //Add a Actor to the director
  console.log('adding actors');
  Director.importActors(actorData);
  console.log(Director.actors);

  //bind them.
}