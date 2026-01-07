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
// value is ARRAY of childtable's field names.
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
getChildTablesandFields(); //must come after getListFields();
getChildDivs(); //must come after getChildTables..
getChildDropDownLists();//must come after getChildFieldsTables..
findAndWireChildButtons(); //must come after get ChildTables()..
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
function getChildTablesandFields() {
  for (let childTableName in listBoxFields.keys()) {    
    var allInputElements = document.getElementsByTagName("input");
    for (var i = 0; i < allInputElements.length; i++) {
      if (allInputElements[i].name.indexOf(childTableName+'_') == 0) {         
        if (childTables.get(childTableName)===null) childTables.set (childTableName, []);
        if (childTableFields.get(childTableName)===null) childTables.set (childTableName, new Map());
        let fieldName = allInputElements[i].name.substring (allInputElements[i].indexOf('_')+1);
        childTables.get(childTableName).push (fieldName);
        childTableFields.get(childTableName).set(fieldName, allInputElements[i]);
      }
    }
  }
}
function getChildDropDownLists() {//TODO: LAST -> Then uncomment the HTML field that goes with it..
}

function getChildDivs() {
  for (let tableName of childTables.keys()) {
    const divElement = fieldElements.get(tableName + '_');
    if (divElement === undefined || divElement === null) {
      alert(`getChildDivs: HTML list with name [${tableName}_] not found.`);
    }
    if (!element.localName === 'div') {
      alert(`getChildDivs: element id corresponds to expected list div, but it is not a div [${tableName}_].`);
    }
    childTableDivs.add(listName, element);
  }
}

function findAndWireChildButtons() {
  //TODO: FINISH
  //ALSO: have it change the innerText attribute of the button say Add {ChildTable name}
  //to help differentiate it from the add button below it.
  for (let childTableName of childTables.keys()) {
    let addButton = document.getElementById(childTableName+'_addBtn');
    let cancelButton = document.getElementById(childTableName+'_cancelBtn');
    let removeButton = document.getElementById(childTableName+'_removeBtn');
    let newButton = document.getElementById(childTableName+'_newBtn');
    newButton.innerText = 'New '+childTableName;
    newButton.addEventListener ('click',()=>{
      childTableDivs.get (childTableName).hidden = false;
      for (let childFieldName of childTableFields.get (childTableName).keys()){
        childTableFields.value = '';
      }
    });
    cancelButton.addEventListener ('click' , ()=>{
      childTableDivs.get (childTableName).hidden = true;
      for (let childFieldName of childTableFields.get (childTableName).keys()){
        childTableFields.value = '';
      }
    });
    addButton.innerText = 'Add '+childTableName;
    addButton.addEventListener ('click', ()=>{
      //TODO: Tomorrow..
    });
    removeButton.addEventListener ('click', ()=>{
      //TODO:Tomorrow..
    });
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
  //TODO: account for child tables.
  const dataRead = localStorage.getItem(dbKey); //used as db key..
  if (dataRead) {
    const storedItems = JSON.parse(dataRead);
    for (let item of storedItems[dbKey]) {
      items.set(item.name, item);  //REMEMBER: Everything has name.
    }
  }
}
function saveItems() {
  //TODO account for child tables
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