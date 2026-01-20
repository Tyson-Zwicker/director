import setUp from './main.js';

//You must define dbKey and fieldNames, and fieldNames must match html field name ids.
//And also will be the json file properties, so make sure they match the thing you plan
//on deserializing later.

const dbKey = 'polygons';
const fieldNames = ['name'];
const polygonPropertyName ='points';
setUp(dbKey, fieldNames, true, polygonPropertyName); //--Leave this code -->
 