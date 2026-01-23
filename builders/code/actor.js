import setUp from './main.js';

//You must define dbKey and fieldNames, and fieldNames must match html field name ids.
//And also will be the json file properties, so make sure they match the thing you plan
//on deserializing later.

const dbKey = 'actors';
const fieldNames = ['name', 'actorTypes','appearances','positionX','positionY','velocityX','velocityY', 'facing', 'spin'];

const polygonPropertyName ='undefined';
setUp(dbKey, fieldNames, false, polygonPropertyName); //--Leave this code -->
