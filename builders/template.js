import setUp from './main.js';

//You must define dbKey and fieldNames, and fieldNames must match html field name ids.
//And also will be the json file properties, so make sure they match the thing you plan
//on deserializing later.

const dbKey = 'templates';
const fieldNames = ['name', 'parts2', 'property1', 'property2', 'foreign', 'parts'];

//You can defined drop down tables like this
const otherTable = {
  "foreign": [
    { "name": "foreign1", "otherprop1": "something", "otherprop2": "apple" },
    { "name": "foreign2", "otherprop1": "something more", "otherprop2": "banana" },
    { "name": "foreign3", "otherprop1": "something less", "otherprop2": "orange" },
  ]
};
localStorage.setItem("foreign", JSON.stringify(otherTable));

setUp(dbKey, fieldNames, false); //--Leave this code -->
