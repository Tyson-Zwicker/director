const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

/* 
This primes the database with a second table 
that will be used to fill dropdown lists in the primary
table.
*/
const otherTable = {
  "foreign": [
    { "name": "foreign1", "othrprop1": "something", "otherprop2": "apple" },
    { "name": "foreign2", "othrprop1": "something more", "otherprop2": "banana" },
    { "name": "foreign3", "othrprop1": "something less", "otherprop2": "orange" },
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

// key is childtable name
// value is object with reference to HTML div, buttons, drop downs and listbox for that table

getAllFields();
getListFields(); //must come aftter get All fields..
const childTables = getChildTables(); //key is table name, has the HTML elements in a JS object.

const btnClear = document.getElementById('btnClear');
const btnAdd = document.getElementById('btnAdd');
const btnRemove = document.getElementById('btnRemove');
const itemsListBox = document.getElementById('itemsListBox');

itemsListBox.addEventListener('change', () => {
  populateFields(itemsListBox.value);
  populateListBoxes ();
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
  //This will add primary table fields.
  let success = storeFields() && storeChildren();
  if (success) {
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
//Do not populate listboxes until an item is selected from ItemList.
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

function populateListBoxes() {
  let item = items.get(itemsListBox.value);
  for (let childTableName of childTables.keys()) {
    //TODO
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
function getChildTables() {
  let tables = new Map();
  for (let childTableName of listBoxFields.keys()) {
    tables.set(childTableName, {});
    let div = document.getElementById(`${childTableName}_div`);
    let removeButton = document.getElementById(`${childTableName}_removeButton`);
    let cancelButton = document.getElementById(`${childTableName}_clearButton`);
    let addButton = document.getElementById(`${childTableName}_addButton`);
    let newButton = document.getElementById(`${childTableName}_newButton`);
    tables.set = (childTableName,
    {
      "div": div,
      "new": newButton,
      "remove": removeButton,
      "cancel": cancelButton,
      "add": addButton,
      "fields": getChildFields (childTableName)
    });
    addChildButtonEvents(childTableName, div, newButton, addButton, cancelButton, removeButton);
    return tables;
  }
}
function getChildFields (childName){
  //Search by element id for anything with name matching child+'_'....
  //and put in a map, and return it.
}
function addChildTableEvents(newButton, addButton, cancelButton, removeButton) {
  //When these events are called, they won't know what table they're for..
  //So they will have to use their own id's..

  newButton.addEventHandler('click', (e) => {
    let tableName = e.target.id.substring(0, e.target.id.indexOf('_'));
    childTables.get(tableName).div.hidden = false;
  });
  cancelButton.cancel.addEventHandler('click', () => {
    let tableName = e.target.id.substring(0, e.target.id.indexOf('_'));
    childTables.get(tableName).div.hidden = true;
  });

  addButton.addEventHandler('click', () => {
    let tableName = e.target.id.substring(0, e.target.id.indexOf('_'));
    let item = items.get (itemsListBox.value);
    let newObj ={"name":table};
    newObj.name 
    item.push (
      newObj);
  });
  removeButton.addEventHandler('click', () => {
    let tableName = e.target.id.substring(0, e.target.id.indexOf('_'));
    let item = items.get (itemsListBox.value);
    let foundRecord = undefined;
    for (let record in items.get (tableName)){
      if (record.name === tableName){
        foundRecord = record;
      }
    }
    if (foundRecord) items.get(tableName).delete (foundRecord.name);
  });
}
function saveItems() {
  const dataObj = {};
  dataObj[dbKey] = [];
  for (let item of items.values()) {
    //TODO: account for child object array...

    dataObj[dbKey].push(item);
  }
  localStorage.setItem(dbKey, JSON.stringify(dataObj));
}

function deleteItem(itemName) {
  items.delete(itemName);
  saveItems();
}

function storeFields(replace) {
  //TODO account for child tables
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