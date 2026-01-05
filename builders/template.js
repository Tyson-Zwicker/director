const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const dbKey = 'templates';//Table name, and also the name of the one (and only) "outerfield" of the JSON object that holds the array of items.
//FieldNames MUST match the element name, and are also going to be used as the json property 
//that will be used to deserialize things in the Director, SO the element name = json name = director deserializer field name..

const fieldNames = ['name', 'property1', 'property2', 'property3'];
const items = new Map();
const fieldElements = new Map();
for (let fieldName of fieldNames) {
  const element = document.getElementById(fieldName);
  if (!element){
    alert (`HTML element with name [${fieldName}] not found.`);
  }
  fieldElements.set(fieldName, element);
}
const itemList = document.getElementById('itemList');
const btnClear = document.getElementById('btnClear');
const btnAdd = document.getElementById('btnAdd');
const btnRemove = document.getElementById('btnRemove');

itemList.addEventListener('change', () => {
  populateFields(itemList.value);
});
btnClear.addEventListener('click', () => {
  clearFields();
});
btnAdd.addEventListener('click', () => {
  if (storeFields()) {
    clearFields();
    populateItemList();
  } else {
    alert('Name already in use.');
  }
});
btnRemove.addEventListener('click', () => {
  deleteItem(itemList.value);
  populateItemList();
  clearFields();
});

loadItems();
populateItemList();

function populateItemList() {
  itemList.length = 0; //clears the list element..
  if (items.size > 0) {
    for (let itemName of items.keys()) {
      let option = new Option(itemName, itemName)
      itemList.appendChild(option);
    }
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
      alert (`ERROR:storeFields: ${elementName}`);
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