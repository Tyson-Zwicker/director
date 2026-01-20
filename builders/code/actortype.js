import setUp from './main.js';

//You must define dbKey and fieldNames, and fieldNames must match html field name ids.
//And also will be the json file properties, so make sure they match the thing you plan
//on deserializing later.

const dbKey = 'actorTypes';
const fieldNames = ['name', 'polygon', 'mass','moves', 'collides', 'bouncecoefficient', 'parts'];

const polygonPropertyName ='undefined';
setUp(dbKey, fieldNames, polygonPropertyName); //--Leave this code -->