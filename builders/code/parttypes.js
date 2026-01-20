import setUp from './main.js';

const dbKey = 'partTypes';
const fieldNames = ['name', 'polygon'];

//This tells it to tell the canvas to be "read only", so it hides 
//the buttons, and also makes it so the itemslist doesn't drive the canvas.
let polygonPropertyName = 'points';
setUp(dbKey, fieldNames, true, polygonPropertyName);

