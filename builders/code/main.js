import setUpCanvas from './canvas.js';

const items = new Map(); //items are Javascript objects
const fieldElements = new Map(); //items are HTML elements
const dropDownFields = new Map(); // items are HTML select elements with size<=1
const listBoxFields = new Map();  // items are HTML select elements with size>1
let dbKey = undefined;
let fieldNames = undefined;
let currentItem = undefined;
let childTables = undefined;
let overlayPolygonSelect = undefined;
let overlayPolygonButton = undefined;
const currentPolygonData = []; //Array of {x,y}, only used in Polygon builder..so far.
let polygonPropertyName = undefined; //The name of the property (of currentItem) used when the storeFields is called
let drawPolygonFunction = undefined;

export default function setUp(db, fldNames, showCanvas, polyPropertyName) {
  fieldNames = fldNames;
  dbKey = db;
  polygonPropertyName = polyPropertyName;
  //currentPolygonData gives canvas a reference to update this when "use points" is pressed.
  //drawPolygon is set to the name of a function that will draw the polygon.
  let readonly = (polyPropertyName === undefined);
  drawPolygonFunction = setUpCanvas(showCanvas, readonly, currentPolygonData);
  if (localStorage.getItem(dbKey) === null) localStorage.setItem(dbKey, `{"${dbKey}":[]}`);
  getAllFieldElements();
  getListFields(); //must come after get All fields..
  if (showCanvas) { //obviously don't update the invisible canvas...
    addDropDownCanvasEvents(); //some dropdowns can update the canvas.  This adds events and calls canvas to draw.
  }
  childTables = getChildTables(); //key is table name, has the HTML elements in a JS object.;
  makeNewCurrentItem();
  addEventListeners();
  loadItems();
  populateItemsListBox();
  populateDropDownLists(); //must come after loadForeignTables
  hideAndClearListBoxFields();//Do not populate listboxes until an item is selected from ItemList..
  const showPartsButton = document.getElementById('showPartsButton');
  if (showPartsButton) {
    addEventsforActorTypesBuilder();
  }
  overlayPolygonSelect = document.getElementById('overlayPolygonSelect');
  overlayPolygonButton = document.getElementById('overlayPolygon');
  if (overlayPolygonSelect && overlayPolygonButton) {
    addEventsForPolygonBuilder();
  }
}
function makeNewCurrentItem() {
  //If there are no items.. (first use edge case)
  //Add a make a blankItem, give it a name, set fields to blank, add to items and place in itemListsBox (as selected)., set all field names to blank. Make name field 'new (DBKEY))'.
  let newItem = {};
  for (let fieldName of fieldNames) {
    if (listBoxFields.has(fieldName)) {
      newItem[fieldName] = [];  //A place to store child table data..
    } else {
      newItem[fieldName] = '';  //A text of drop down property.
    }
  }
  newItem.name = 'New ' + dbKey;
  fieldElements.get('name').value = newItem.name;
  newItem.saved = false;
  currentItem = newItem;
  //Clear the polygon data for new items.
  if (polygonPropertyName) {
    currentPolygonData.length = 0;
    if (drawPolygonFunction) {
      drawPolygonFunction(currentPolygonData);
    }
  }
}
function makeCopyCurrentItem(newName) {
  //If there are field has changed, the current item should become a COPY of the old item.
  //Add a make a blankItem, give it a name, set fields to blank, add to items and place in itemListsBox (as selected)., set all field names to blank. Make name field 'new (DBKEY))'.
  let newItem = structuredClone(currentItem);
  if (currentItem && currentItem.saved !== true) { //In the event there no "curent item" because a new item has just added, we can ignore this..
    items.delete(currentItem.name);  //don't keep old unsaved version around.. which there won't be because it null or not add to items yet..
  }
  newItem.name = newName;       //replace with new one..  
  currentItem = newItem;
  currentItem.saved = false;    //mark this one as unsaved too
  itemsListBox.selectedIndex = -1;
}
function getAllFieldElements() {
  for (let fieldName of fieldNames) {
    const element = document.getElementById(fieldName);
    if (element === undefined || element === null) {
      alert(`getAllFieldElements:HTML element with name [${fieldName}] not found.`);
    }
    fieldElements.set(fieldName, element);
  }
}
function getListFields() {
  for (let fieldName of fieldNames) {
    const element = document.getElementById(fieldName);
    if (element === undefined || element === null) {
      alert(`getListFields:HTML SELECT element with name [${fieldName}] not found.`);
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
function addDropDownCanvasEvents() {
  for (let fieldName of dropDownFields.keys()) {
    if (fieldName.indexOf('polygon') !== -1) {
      console.log ('adding polygon field:'+fieldName);
      let element = dropDownFields.get(fieldName);
      element.addEventListener('change', () => {
        console.log ('polygon field event fired');
        let p = getPolygonPoints(element.value);
        drawPolygonFunction(p);
      });
    }
  }
}
function getPolygonPoints(polygonName) {
  let table = JSON.parse(localStorage.getItem('polygons'));
  let records = table.polygons;
  for (let record of records) {
    if (record.name === polygonName) return record.points;
  }
}
function populateItemsListBox() { //This is the SECOND COLUMN list that drives the whole show.
  itemsListBox.length = 0; //clears the list element..
  for (let itemName of items.keys()) {
    itemsListBox.appendChild(new Option(itemName, itemName));
  }
}
function hideAndClearListBoxFields() {
  for (let listBoxFieldName of listBoxFields.keys()) {
    let listBox = listBoxFields.get(listBoxFieldName);
    listBox.length = 0; //clear and..
    let div = childTables.get(listBoxFieldName).div; //hide the div..
    setDivVisibility(div, false);
  }
}
function populateDropDownLists() {
  //Find the drop down fields, and fill them from their own table
  for (let elementName of dropDownFields.keys()) {
    const dropDownList = fieldElements.get(elementName);
    console.log(dropDownList);
    let datakey = elementName;
    console.log(elementName);

    if (elementName.indexOf('polygon') !== -1) {
      datakey = 'polygons';
      console.log('polygon exception');
    };
    let foreignTable = JSON.parse(localStorage.getItem(datakey));
    console.log(foreignTable);
    for (let foreignItem of foreignTable[datakey]) {
      dropDownList.appendChild(new Option(foreignItem.name, foreignItem.name));
    }
  }
  for (let childTableName of childTables.keys()) {
    for (let dropDownListName of childTables.get(childTableName).dropDowns.keys()) {
      let dropDownElement = childTables.get(childTableName).dropDowns.get(dropDownListName);
      //get the REAL field name for values by removing the childtablename prefix..      
      let len = (childTableName + '_').length;
      let foreignTableName = dropDownListName.substring(len); //The dropDowns's "real name" is the name of the table it gets values from..
      let foreignTable;
      if (foreignTableName.indexOf('polygon') !== -1) { //exception for polygons..
        foreignTable = JSON.parse(localStorage.getItem('polygons'));
      } else {
        foreignTable = JSON.parse(localStorage.getItem(foreignTableName));
      }
      for (let foreignItem of foreignTable[foreignTableName]) {
        dropDownElement.appendChild(new Option(foreignItem.name, foreignItem.name));
      }
    }
  }
}

function populateListBoxes() {
  for (let childTableName of childTables.keys()) {
    let listbox = listBoxFields.get(childTableName);
    listbox.length = 0; //Clear it. Prevents duplicates from being added..
    let records = currentItem[childTableName]; //should return an array
    if (Array.isArray(records)) {
      for (let record of records) {
        let option = new Option(record.name, record.name)
        listbox.appendChild(option);
      }
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
    let listBox = document.getElementById(childTableName);
    let div = document.getElementById(`${childTableName}_div`);
    let subDiv = document.getElementById(`${childTableName}_subDiv`);
    let removeButton = document.getElementById(`${childTableName}_removeButton`);
    let cancelButton = document.getElementById(`${childTableName}_cancelButton`);
    let addButton = document.getElementById(`${childTableName}_addButton`);
    let newButton = document.getElementById(`${childTableName}_newButton`);
    let fields = getChildFields(childTableName);
    tables.set(childTableName,
      {
        "listBox": listBox,
        "div": div,
        "subDiv": subDiv,
        "new": newButton,
        "remove": removeButton,
        "cancel": cancelButton,
        "add": addButton,
        "fields": fields,
        "dropDowns": getChildDropDowns(fields)
      });
    addChildElementEvents(listBox, newButton, addButton, cancelButton, removeButton);
  }
  return tables;
}
function getChildDropDowns(fields) {
  let dropDowns = new Map();
  for (let element of fields.values()) {
    if (element.localName === 'select') {
      if (element.size <= 1) {
        dropDowns.set(element.id, element);
      }
    }
  }
  return dropDowns;
}
//Key = elementID (child_field), value is the HTML element.
function getChildFields(childTableName) {
  //get all that start with childTableName+_ that are of type input or select
  //this won't get the listbox because it does have the '_'... good because we don't want it included.
  let allElements = Array.from(document.getElementsByTagName('input'));
  allElements.push(...document.getElementsByTagName('select'));
  let childElements = new Map();
  for (let element of allElements) {
    if (element.localName === 'input' || element.localName === 'select') {
      if (element.id.startsWith(`${childTableName}_`)) {
        childElements.set(element.id, element);
      }
    }
  }
  return childElements;
}
function setDivVisibility(divElement, visible) {
  if (visible) {
    divElement.classList.remove('is-hidden');
    //if (subDivElement) {
    //  subDivElement.classList.remove('is-hidden');
    // }
  } else {
    divElement.classList.add('is-hidden');
    //if (subDivElement) {
    //  subDivElement.classList.add('is-hidden');
    // }
  }
}
function storeFields(replace = false) {
  let name = fieldElements.get('name').value;  //REMEMBER: Everything has name.
  if (items.has(name) && replace == false) {
    alert('StoredFields: name is use: ' + name);
    return false;
  }
  const newItem = {};
  for (let fieldName of fieldElements.keys()) {
    if (!listBoxFields.has(fieldName)) {// Drop downs and text fields..
      try {
        newItem[fieldName] = fieldElements.get(fieldName).value;
      } catch (e) {
        let errMsg = `Error in  storeFields: ${fieldName}`;
        alert('store fields:' + errMsg);
      }
    } else {                                //Now handle child tables..      
      newItem[fieldName] = currentItem[fieldName]; //We need to move all the children to the new item name.      
    }
  }
  if (polygonPropertyName) {
    //Give it a copy of the current Polygon (don't just hand it a reference..)
    newItem[polygonPropertyName] = structuredClone(currentPolygonData);
    console.log('store fields:');
    console.log(newItem[polygonPropertyName]);
  }

  //Commit new item..
  newItem.saved = true;
  items.set(name, newItem);
  saveItems();
  return true;
}
function clearFields() {
  for (let fieldName of fieldNames) {
    const fieldElement = fieldElements.get(fieldName);
    if (fieldElement.type === 'color') {
      fieldElement.value = '#505050';
    } else {
      fieldElement.value = '';
    }
  }
  hideAndClearListBoxFields();
}
function populateFieldsFromItemList(itemName) {
  //only called when itemsListBox is selected.
  const item = items.get(itemName);
  for (let fieldName of fieldNames) {
    const element = fieldElements.get(fieldName);
    element.value = item[fieldName];
  }
  
}
function findRecordInTable(tableName, recordName) {
  let raw = localStorage.getItem(tableName);
  let obj = JSON.parse(raw);
  let array = obj[tableName];
  for (let i = 0; i.array.length(); i++) {
    if (array[i].name = recordName) return array[i];
  }
  return null;
}
function addEventListeners() {
  //PRIMARY FUNCTION EVENSTS -not children..
  const btnClear = document.getElementById('btnClear');
  const btnAdd = document.getElementById('btnAdd');
  const btnRemove = document.getElementById('btnRemove');
  const itemsListBox = document.getElementById('itemsListBox');
  const btnCopyDB = document.getElementById('btnCopyDB');
  const fldName = document.getElementById('name');

  //Name Field Change
  fldName.addEventListener('change', (e) => {
    let newName = e.target.value;
    if (items.has(newName)) {
      alert(`A ${dbKey} named [${newName}] already exists.`);
      return;//Without DOING ANYTHING;
    } else {
      makeCopyCurrentItem(newName);
      itemsListBox.selectedIndex = -1;
    }
  });
  //PRIMARY COPY DB button
  btnCopyDB.addEventListener('click', () => {
    let itemsArray = [...items.values()];

    let obj = {};
    obj[dbKey] = itemsArray;
    let jsonString = JSON.stringify(obj);
    navigator.clipboard.writeText(jsonString).then(() => {
      alert("JSON copied to clipboard");
    });
  });
  //PRIMARY ListBox
  itemsListBox.addEventListener('change', () => {
    let selectedName = itemsListBox.value;
    if (!items.has(selectedName)) {
      alert('list box is corrupted.');
      return;
    }
    currentItem = items.get(selectedName);
    if (currentItem === null) alert(`${selectedName} not found in items!`);
    populateFieldsFromItemList(selectedName);
    populateListBoxes();
    if (polygonPropertyName != null) {//This is for anything that directly draws.. currently that is only the polygon table but who knows?
    
      currentPolygonData.length = 0;
      currentPolygonData.push(...currentItem[polygonPropertyName]);
      drawPolygonFunction(currentPolygonData);
    }
    //Now check for any "polygon dropdowns" to draw.. (currently actor and part type both have one).
    for (let fieldName of fieldNames){
      if (fieldName.indexOf('polygon'!==-1)){
        console.log ('drawing field'+fieldName);
        let element = fieldElements.get (fieldName);
        let p = getPolygonPoints(element.value);
        drawPolygonFunction(p);
      }
    }
  });
  itemsListBox.addEventListener('click', () => {
    if (itemsListBox.length === 1) {
      let selectedName = itemsListBox.options[0].value;
      currentItem = items.get(selectedName);
      populateFieldsFromItemList(selectedName);
      populateListBoxes();
      if (polygonPropertyName != null) {
        currentPolygonData.length = 0;
        currentPolygonData.push(...currentItem[polygonPropertyName]);
        drawPolygonFunction(currentPolygonData);
      }
    }
  });
  //PRIMARY Remove
  btnRemove.addEventListener('click', () => {
    deleteItem(itemsListBox.value);
    populateItemsListBox();
    clearFields();
    hideAndClearListBoxFields();
    itemsListBox.selectedIndex = -1;
    makeNewCurrentItem();
  });
  //PRIMARY ADD BUTTON
  btnAdd.addEventListener('click', () => {

    if (fieldElements.get('name').value.trim() === '') {
      alert('No name specified.');
      return;
    };
    //This will add primary table fields.
    if (storeFields()) {
      clearFields();
      hideAndClearListBoxFields();
      populateItemsListBox();
      itemsListBox.selectedIndex = -1;
      makeNewCurrentItem();
    } else {
      alert('Name already in use.');
    }
  });
  //PRIMARY Clear..
  btnClear.addEventListener('click', () => {
    console.log('clearing fields');
    clearFields();
    hideAndClearListBoxFields();
    populateItemsListBox();
    makeNewCurrentItem();
  });
}
function addChildElementEvents(listBox, newButton, addButton, cancelButton, removeButton) {
  //CHILD LISTBOX CHANGE
  listBox.addEventListener('change', (e) => {
    let childTableName = e.target.id;
    let selectedChildRecordName = listBox.value;
    let record = undefined;
    for (let i = 0; i < currentItem[childTableName].length; i++) {
      if (currentItem[childTableName][i].name === selectedChildRecordName) {
        record = currentItem[childTableName][i];
        break;
      }
    }
    //NOW SHOW IT..    
    let childTable = childTables.get(childTableName);
    let fields = childTable.fields;
    for (let fieldName of fields.keys()) {
      let field = fields.get(fieldName);
      let localFieldName = fieldName.substring(fieldName.indexOf('_') + 1);
      field.value = record[localFieldName];
    }
    let div = childTables.get(childTableName).div;
    setDivVisibility(div, true);
  });
  //CHILD NEW CHILD
  newButton.addEventListener('click', (e) => {
    let tableName = e.target.id.substring(0, e.target.id.indexOf('_'));
    let div = childTables.get(tableName).div;
    let fields = childTables.get(tableName).fields.values(); //a list of html elements..
    for (let element of fields) {
      element.value = ''; //clear the fields, deselect list boxes a new child record had been defined.
    }

    setDivVisibility(div, true);
  });
  //CHILD CANCEL BUTTON
  cancelButton.addEventListener('click', (e) => {
    let tableName = e.target.id.substring(0, e.target.id.indexOf('_'));
    let div = childTables.get(tableName).div;
    let fields = childTables.get(tableName).fields.values(); //a list of html elements..    
    for (let element of fields) {
      element.value = ''; //clear the fields, deselect list boxes..
    }
    let subDiv = childTables.get(tableName).subDiv;
    setDivVisibility(div, false);
  });
  //CHILD ADD CHILD
  addButton.addEventListener('click', (e) => {
    let childTableName = e.target.id.substring(0, e.target.id.indexOf('_'));
    let newObj = {};
    for (let fieldName of childTables.get(childTableName).fields.keys()) {
      let realFieldName = fieldName.substring(fieldName.indexOf('_') + 1);
      newObj[realFieldName] = childTables.get(childTableName).fields.get(fieldName).value;//get the value from html element, put in newObj..
    }
    let childProperty = currentItem[childTableName]; //This is should be an array of childRecords..
    for (let i = 0; i < childProperty.length; i++) {//check to make sure name not already in use..
      if (childProperty[i].name === newObj.name) {
        alert(`${childTableName} already instance of [${newObj.name}]`);
        return;
      }
    }
    childProperty.push(newObj);//Now we get push this in the array of the property called (childTableName) of the currently Selected Item.
    let div = childTables.get(childTableName).div;
    setDivVisibility(div, false);
    populateListBoxes();
  });
  //CHILD REMOVE CHILD
  removeButton.addEventListener('click', (e) => {
    let childTableName = e.target.id.substring(0, e.target.id.indexOf('_'));
    let childRecords = currentItem[childTableName];
    let recordToRemove = -1;
    let recordNameToMatch = listBoxFields.get(childTableName).value;
    for (let i = 0; i < childRecords.length; i++) {
      if (childRecords[i].name === recordNameToMatch) {
        recordToRemove = i;
        break;
      }
    }
    if (recordToRemove != -1) {
      childRecords.splice(recordToRemove, 1);
    }
    populateListBoxes();
  });
}

//Only for Actor Types builder:
function addEventsforActorTypesBuilder() {
  showPartsButton.addEventListener('click', function () {
    console.log('Show Parts button clicked');
    if (currentItem) {
      let parts = currentItem.parts;
      for (let i = 0; i < parts.length(); i++) {
        let x = parts[i].xOffset;
        let y = parts[i].yOffset;
        console.log(`part offset ${x},${y}`);
        let partType = findRecordInTable('partTypes', parts[i].partType);
        if (partType && partType !== null) {
          console.log(partType);
          let polygon = findRecordInTable('polygons', partType.polygon);
          if (polygon && polygon !== null) {
            console.log(polygon);
            drawPolygonFunction(polygonpolygon.points, x, y);
          }
        }
      }
    }
  });
}

//Only for Polygon Builder

function addEventsForPolygonBuilder() {
  for (let item of items.values()) {
    overlayPolygonSelect.appendChild(new Option(item.name, item.name));
  }
  overlayPolygonButton.addEventListener('click', function () {
    const overlaySelect = document.getElementById('overlayPolygonSelect');
    if (overlaySelect && overlaySelect.value) {
      console.log('Overlay Polygon button clicked, selected:', overlaySelect.value);
      let itemWithPolygon = items.get(overlaySelect.value);
      if (itemWithPolygon.points) {
        let x, y;
        try {
          x = parseInt(document.getElementById('xOverlayOffset').value);
          y = parseInt(document.getElementById('yOverlayOffset').value);
        }
        catch (e) {
          alert(`bad offsets ${x},${y} gave ${e.message}`);
        }
        drawPolygonFunction(itemWithPolygon.points, x, y);
      } else {
        alert(`Polygon ${itemWithPolygon.name} has no defined points.`);
      }
    } else {
      alert('Please select a polygon to overlay');
    }
  });
}
