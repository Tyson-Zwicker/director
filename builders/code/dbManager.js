const tablesList = document.getElementById('tablesList');
const recordsList = document.getElementById('recordsList');
const removeTableBtn = document.getElementById('removeTableBtn');
const removeRecordBtn = document.getElementById('removeRecordBtn');

let currentTableName = null; // Stores the name of the currently selected table
let currentTableData = null; // Stores the parsed JS object for the selected table

// Initialize the page by populating the tables dropdown
function init() {
  populateTablesDropdown();
}

// Populate the dropdown with all localStorage keys
function populateTablesDropdown() {
  tablesList.length = 0; // Clear existing options
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    tablesList.appendChild(new Option(key, key));
  }
}

// Handle table selection change
tablesList.addEventListener('change', (e) => {
  const selectedTable = e.target.value;
  if (selectedTable) {
    currentTableName = selectedTable;
    loadTableData(selectedTable);
  }
});

// Load and parse the selected table data
function loadTableData(tableName) {
  try {
    const jsonString = localStorage.getItem(tableName);
    if (jsonString) {
      currentTableData = JSON.parse(jsonString);
      populateRecordsList(currentTableData);
    }
  } catch (error) {
    alert(`Error loading table "${tableName}": ${error.message}`);
    recordsList.length = 0;
    currentTableData = null;
  }
}

// Populate the records listbox from the parsed data
function populateRecordsList(data) {
  recordsList.length = 0; // Clear existing options
  
  if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
    // If it's an object with a property that contains an array (like {tableName: [...]})
    const keys = Object.keys(data);
    
    if (keys.length === 1 && Array.isArray(data[keys[0]])) {
      // Single key with array value
      const records = data[keys[0]];
      for (let record of records) {
        const recordName = record.name || JSON.stringify(record);
        recordsList.appendChild(new Option(recordName, recordName));
      }
    } else if (Array.isArray(data)) {
      // Direct array
      for (let record of data) {
        const recordName = record.name || JSON.stringify(record);
        recordsList.appendChild(new Option(recordName, recordName));
      }
    } else {
      // Object with multiple keys - show the keys
      for (let key of keys) {
        recordsList.appendChild(new Option(key, key));
      }
    }
  } else if (Array.isArray(data)) {
    // Direct array
    for (let record of data) {
      const recordName = record.name || JSON.stringify(record);
      recordsList.appendChild(new Option(recordName, recordName));
    }
  }
}

// Remove Table button handler
removeTableBtn.addEventListener('click', () => {
  if (!currentTableName) {
    alert('Please select a table to remove.');
    return;
  }
  
  if (confirm(`Are you sure you want to remove the table "${currentTableName}"?`)) {
    localStorage.removeItem(currentTableName);
    currentTableName = null;
    currentTableData = null;
    recordsList.length = 0;
    populateTablesDropdown();
    tablesList.selectedIndex = -1;
  }
});

// Remove Record button handler
removeRecordBtn.addEventListener('click', () => {
  if (!currentTableName || !currentTableData) {
    alert('Please select a table first.');
    return;
  }
  
  const selectedRecord = recordsList.value;
  if (!selectedRecord) {
    alert('Please select a record to remove.');
    return;
  }
  
  // Find and remove the record from currentTableData
  const keys = Object.keys(currentTableData);
  let recordRemoved = false;
  
  if (keys.length === 1 && Array.isArray(currentTableData[keys[0]])) {
    // Single key with array value
    const arrayKey = keys[0];
    const records = currentTableData[arrayKey];
    const index = records.findIndex(r => (r.name || JSON.stringify(r)) === selectedRecord);
    
    if (index !== -1) {
      records.splice(index, 1);
      recordRemoved = true;
    }
  } else if (Array.isArray(currentTableData)) {
    // Direct array
    const index = currentTableData.findIndex(r => (r.name || JSON.stringify(r)) === selectedRecord);
    
    if (index !== -1) {
      currentTableData.splice(index, 1);
      recordRemoved = true;
    }
  }
  
  if (recordRemoved) {
    // Save back to localStorage
    localStorage.setItem(currentTableName, JSON.stringify(currentTableData));
    // Refresh the records list
    populateRecordsList(currentTableData);
    recordsList.selectedIndex = -1;
  } else {
    alert('Could not find record to remove.');
  }
});

// Initialize on page load
init();
