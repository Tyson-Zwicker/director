const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

/* 
This primes the database with a second table 
that will be used to fill dropdown lists in the primary
table.
*/
const otherTable = {
  "things": [
    { "name": "thing1", "othrprop1": "something", "otherprop2": "apple" },
    { "name": "thing2", "othrprop1": "something more", "otherprop2": "apple" },
    { "name": "thing3", "othrprop1": "something less", "otherprop2": "apple" },
  ]
};
localStorage.setItem("things", JSON.stringify(otherTable));

const dbKey = 'templates';//Table name, and also the name of the one (and only) "outerfield" of 
// the JSON object that holds the array of items.
// FieldNames MUST match the element name, and are also going to be used as the json property 
// that will be used to deserialize things in the Director,
// SO the element name = the json name = class property
localStorage.removeItem(dbKey);
if (localStorage.getItem(dbKey) === null) {
  localStorage.setItem(dbKey, `{"${dbKey}":[]}`);
}

const fieldNames = ['name', 'property1', 'property2', 'foreign', 'parts'];

const items = new Map(); //items are Javascript objects
const fieldElements = new Map(); //items are HTML elements
const dropDownFields = new Map(); // items are HTML select elements with size<=1
const foreignTables = new Map();  // should contain tables for listbox-> not required for drop downs.
const listBoxFields = new Map();  // items are HTML select elements with size>1
//key is childtable name
// value is inner Map
//   inner key is child-table-record NAME property, 
//   inner value is js object containing childtable-record.
const childTables = new Map();
//key childtable name, value is MAP 
//  inner map values are HTML fields, keyed by childtable-record NAME
const childTableDivs = new Map(); //Items are HTML DIV elements belonging belonging to a listbox
//key childtable name, value is MAP 
//  inner map values are HTML fields, keyed by childtable-record NAME
const childTableFields = new Map();
//key childtable name, value is MAP 
//  inner map values are HTML fields, keyed by childtable-record NAME
const childTableDropDownLists = new Map();
getAllFields();
getListFields(); //must come aftter get All fields..



getChildTables(); //must come after getListFields();
getchildTableDivs(); //must come after getChildTables..
getChildFields(); //must come after getChildTables..
getChildDropDownLists();//must come after getChildFieldsTables..
findAndWireChildAddandRemoveButtons();
const btnClear = document.getElementById('btnClear');
const btnAdd = document.getElementById('btnAdd');
const btnRemove = document.getElementById('btnRemove');
const itemsListBox = document.getElementById('itemsListBox');

itemsListBox.addEventListener('change', () => {
  populateFields(itemsListBox.value);
});
btnRemove.addEventListener('click', () => {
  deleteItem(itemsListBox.value);
  populateItemsListBox();
  clearFields();
});
btnAdd.addEventListener('click', () => {
  if (fieldElements.get('name').value.trim() = '') {
    alert('No name specified.');
    return;
  };
  if (storeFields()) {
    clearFields();
    populateItemsListBox();
  } else {
    alert('Name already in use.');
  }
});
btnClear.addEventListener('click', () => {
  clearFields();
});



loadItems();
populateItemsListBox(); //must come after loadItems
loadForeignTables();
populateDropDownLists(); //must come after loadForeignTables


function getAllFields() {
  for (let fieldName of fieldNames) {
    const element = document.getElementById(fieldName);
    if (element === undefined || element === null) {
      alert(`HTML element with name [${fieldName}] not found.`);
    }
    fieldElements.set(fieldName, element);
  }
}
function getListFields() {
  for (let fieldName of fieldNames) {
    const element = document.getElementById(fieldName);
    if (element === undefined || element === null) {
      alert(`HTML element with name [${fieldName}] not found.`);
    }
    if (element.localName === 'select') {
      if (element.size <= 1) {
        dropDownFields.set(fieldName, element);
      } else {
        listBoxFields.set(fieldName, element);
      }
    }
  }
}
function getchildTableDivs() {
  for (let listName of listBoxFields.keys()) {
    const divElement = fieldElements.get(listName + '_');
    if (element === undefined || element === null) {
      alert(`HTML list with name [${listName}] not found.`);
    }
    if (!element.localName === 'div') {
      alert(`element id corresponds to expected list div, but it is not a div [${list}_]`);
    }
    childTableDivs.add(listName, element);
  }
}
function getInnerChildFields() {
  for (let tableName of childTables.keys()) {
    const divElement = fieldElements.get(tableName + '_');
    if (element === undefined || element === null) {
      alert(`HTML list with name [${listName}] not found.`);
    }
    if (!element.localName === 'div') {
      alert(`element id corresponds to expected list div, but it is not a div [${list}_]`);
    }
    childTableDivs.add(listName, element);
  }
}
function findAndWireChildAddandRemoveButtons() {
  for (let tableName of childTables.keys()) {
    const divElement = fieldElements.get(tableName + '_');
    if (element === undefined || element === null) {
      alert(`HTML list with name [${listName}] not found.`);
    }
    childTableDivs.add(listName, element);
  }
}
function loadForeignTables() {
  //Currently only used to show the names of the things
  //in the other table (like appearance)
  //The elementName of a dropdown IS/MUST be the dbKey for the table it derives its values from..
  for (let foreignDbKey of dropDownFields.keys()) {
    const foreignTable = JSON.parse(localStorage.getItem(foreignDbKey));
    foreignTables.set(foreignDbKey, new Map());
    for (let foreignItem of foreignTable[foreignDbKey]) {
      for (let foreignItemProperyName of foreignItem) {
        foreignTables.get(foreignDbKey).set(foreignItemProperyName, foreignItem[foreignItemProperyName])
      }
    }
  }
  console.log('load foreign tables:');
  console.log(foreignTables);
}
function populateListBoxes() {

}
function populateDropDownLists() {
  console.log(dropDownFields.keys);
  //Find the drop down fields, and fill them from their own table
  for (let elementName of dropDownFields.keys()) {
    const dropDownList = fieldElements.get(elementName);
    const foreignTable = JSON.parse(localStorage.getItem(elementName));
    for (let foreignItem of foreignTable[elementName]) {
      dropDownList.appendChild(new Option(foreignItem.name, foreignItem.name));
    }
  }
}

function populateItemsListBox() {
  itemsListBox.length = 0; //clears the list element..
  for (let itemName of items.keys()) {
    itemsListBox.appendChild(new Option(itemName, itemName));
  }
}

function loadItems() {
  const dataRead = localStorage.getItem(dbKey); //used as db key..
  if (dataRead) {
    const storedItems = JSON.parse(dataRead);
    for (let item of storedItems[dbKey]) {
      items.set(item.name, item);  //REMEMBER: Everything has name.
    }
  }
}
function saveItems() {
  const dataObj = {};
  dataObj[dbKey] = [];
  for (let item of items.values()) {
    dataObj[dbKey].push(item);
  }
  localStorage.setItem(dbKey, JSON.stringify(dataObj));
}

function deleteItem(itemName) {
  items.delete(itemName);
  saveItems();
}

function storeFields(replace) {
  let name = fieldElements.get('name').value;  //REMEMBER: Everything has name.
  if (items.has(name) && replace != true) {
    return false;
  }
  const newItem = {};
  for (let elementName of fieldElements.keys()) {
    try {
      newItem[elementName] = fieldElements.get(elementName).value;
    } catch (e) {
      console.log(`storeFields: ${elementName}`);
      alert(`ERROR:storeFields: ${elementName}`);
    }
  }
  items.set(name, newItem);
  saveItems();
  return true;
}
function clearFields() {
  for (let fieldName of fieldNames) {
    const fieldElement = fieldElements.get(fieldName);
    fieldElements.get(fieldName).value = '';
  }
}
function populateFields(itemName) {
  const item = items.get(itemName);
  for (let fieldName of Object.getOwnPropertyNames(item)) {
    const element = fieldElements.get(fieldName);
    element.value = item[fieldName];
  }
}