import Boundry from './boundry.js';
import Appearance from './appearance.js';
import Button from './button.js';
import Director from './director.js';
import Draw from './draw.js'; //measures text..
export default class GUI {
  static paneNames = ['top', 'bottom', 'left', 'right'];
  constructor(colWidth, rowHeight, margin, gap, view) {
    if (typeof colWidth !== 'number' || typeof rowHeight !== 'number') throw new Error(`GUI.constructor colWidth and rowHeight should be numbers [${colWidth},${rowHeight}].`);
    if (typeof margin !== 'number') throw new Error(`GUI.constructor(): margin is not a number: ${margin}`);
    this.margin = margin;
    this.gap = gap;
    this.renderer = new Draw(view.context);
    this.fontSize = 16;
    this.fontName = 'monospace';
    this.view = view;
    this.colWidth = colWidth;
    this.rowHeight = rowHeight;
    this.panes = new Map();
    this.panes.set('top', { "boundry": this.#topBoundry(), "items": [], 'activeList': undefined });
    this.panes.set('bottom', { "boundry": this.#bottomBoundry(), "items": [], 'activeList': undefined });
    this.panes.set('left', { "boundry": this.#leftBoundry(), "items": [], 'activeList': undefined });
    this.panes.set('right', { "boundry": this.#rightBoundry(), "items": [], 'activeList': undefined });
    this.lists = new Map();
    this.controls = [];
  }
  #topBoundry() {
    return new Boundry(this.colWidth, 0, this.view.canvas.width - this.colWidth, this.rowHeight);
  }
  #bottomBoundry() {
    return new Boundry(this.colWidth, this.view.canvas.height - this.rowHeight, this.view.canvas.width - this.colWidth, this.view.canvas.height);
  }
  #leftBoundry() {
    return new Boundry(0, this.rowHeight, this.colWidth, this.view.canvas.height - this.rowHeight);
  }
  #rightBoundry() {
    return new Boundry(this.view.canvas.width - this.colWidth, this.rowHeight, this.view.canvas.width, this.view.canvas.height - this.rowHeight);
  }

  resize() {
    this.panes.get('top').boundry = this.#topBoundry();
    this.panes.get('bottom').boundry = this.#bottomBoundry();
    this.panes.get('left').boundry = this.#leftBoundry();
    this.panes.get('right').boundry = this.#rightBoundry();
  }
  measureItem(pane, text) {
    //list items use the "offset" - its the bounds of the button that shows the list..
    let textSize = this.renderer.getTextSize(text, this.fontSize, this.fontName);
    if (pane === 'top') {
      return new Boundry(0, 0, textSize.width + this.margin * 2, this.rowHeight);
    }
    if (pane === 'bottom') {
      return new Boundry(0, this.view.canvas.height - this.rowHeight, textSize.width + this.margin * 2, this.view.canvas.height);
    }
    if (pane === 'left') {
      return new Boundry(0, 0, this.colWidth, textSize.height + this.margin * 2);
    }
    if (pane === 'right') {
      return new Boundry(this.view.canvas.width - this.colWidth, 0, this.view.canvas.width, textSize.height + this.margin * 2);
    }
  }
  static isMouseIn(guiControl, point) {
    return guiControl.drawnBounds.isPointInside(point.x, point.y);
  }
  static isControl(guiControl) {
    return (typeof guiControl !== undefined && typeof guiControl.type !== undefined && (guiControl.type === 'text' || guiControl.type === 'button' || guiControl.type === 'list'));
  }
  getButton(label, normalAppearance, hoveredAppearance, pressedAppearance, toggle, fn, value) {
    if (typeof toggle !== 'boolean') throw new Error(`GUI.addButton: toggle must be boolean [${toggle}].`);
    let b = new Button(hoveredAppearance, pressedAppearance, fn, toggle, value);
    let newButton = {
      "type": 'button',
      "text": label,
      "appearance": normalAppearance,
      "button": b,
      "bounds": undefined,
      "drawnBounds": undefined,
      "visible": true,
      "value": value
    }
    b.guiControl = newButton;
    return newButton;
  }
  addButton(pane, label, normalAppearance, hoveredAppearance, pressedAppearance, toggle, fn, value) {
    if (!GUI.paneNames.includes(pane)) throw new Error(`GUI.addButton: Pane must be top,bottom,left, right or float [${pane}].`);
    let newButton = this.getButton(label, normalAppearance, hoveredAppearance, pressedAppearance, toggle, fn, value);
    newButton.bounds = this.measureItem(pane, label);
    this.panes.get(pane).items.push(newButton);
    this.controls.push(newButton);
  }
  getText(label, appearance) {
    let newText = {
      "type": 'text',
      "text": label,
      "appearance": appearance,
      "button": undefined,
      "bounds": undefined,
      "drawnBounds": undefined,
      "visible": true
    };
    return newText;
  }
  addText(pane, label, appearance) {
    if (!GUI.paneNames.includes(pane)) throw new Error(`GUI.addText: Pane must be top,bottom,left, right or float [${pane}].`);
    let newText = this.getText(label, appearance);
    newText.bounds = this.measureItem(pane, label);
    this.panes.get(pane).items.push(newText);
    this.controls.push(newText);
  }
  getList(paneName, label, normalAppearance, hoveredAppearance, pressedAppearance, listName, listItems, defaultValue) {
    if (!GUI.paneNames.includes(paneName)) throw new Error(`GUI.getList: invalid paneName: [${paneName}].`);
    if (!Array.isArray(listItems)) throw new Error(`GUI.getList: listItems should be an array: [${listItems}].`);
    if (this.lists.has(listName)) throw new Error(`GUI.getList: Unknown list  ${listName}.`);
    let listCallback = (e) => {
      Director.gui.showList(e.owner.listName);
    }
    let b = new Button(hoveredAppearance, pressedAppearance, listCallback, false, '');

    let newList = {
      "type": 'list',
      "listName": listName,
      "paneName": paneName,
      "text": label,
      "appearance": normalAppearance,
      "button": b,
      "bounds": undefined,
      "drawnBounds": undefined,
      "listItems": undefined,
      "selectedValue": defaultValue,
      "visible": true
    };
    b.guiControl = newList; //Binding the button to the new control.. so the function points at this.. so it can pass this list's name to showList()..
    //make sure items is itemsList are actually buttons and bind those buttons to this list..        
    let foundDefaultItem = false;
    for (let listItem of listItems) {
      if (typeof listItem.type !== undefined && listItem.type === 'button') {
        if (listItem.button.value === defaultValue) foundDefaultItem = true;
        listItem.listName = listName;
        listItem.visible = false;
        listItem.button.clickFn = (event) => {
          Director.gui.hideList(event.owner.listName);//event.owner is the GUIControl (type=button or list)           
          Director.gui.lists.get(event.owner.listName).selectedValue = event.value;//event.value is the Button's value (the actual button of class Button) - declared at Button's construction.
        }
      } else throw new Error(`GUI.addList: List item is not a button ${listItem}`);
    }
    if (!foundDefaultItem) throw new Error(`GUI.getList: Not list items match default value [${defaultValue}].`);
    newList.listItems = listItems;
    return newList;
  }
  addList(paneName, label, normalAppearance, hoveredAppearance, pressedAppearance, listName, listItems, defaultValue) {
    if (typeof defaultValue === 'undefined') throw new Error('GUI.addList: defaultValue is undefined.');
    if (!GUI.paneNames.includes(paneName)) throw new Error(`GUI.getList: Pane must be top,bottom,left, right or float [${paneName}].`);
    let newList = this.getList(paneName, label, normalAppearance, hoveredAppearance, pressedAppearance, listName, listItems, defaultValue);
    newList.paneName = paneName;
    newList.bounds = this.measureItem(paneName, label);
    for (let listItem of newList.listItems) {
      listItem.bounds = this.measureItem(paneName, listItem.text, newList.bounds);
      this.controls.push(listItem);  // Add list items to controls so they can be checked for mouse interaction
    }
    this.lists.set(listName, newList);
    this.panes.get(paneName).items.push(newList);
    this.controls.push(newList);
  }
  showList(listName) {
    //1. Hide the controls in this list's pane..
    if (!this.lists.has(listName)) throw new Error(`GUI.showList: listName [${listName}] not found.`);
    let list = this.lists.get(listName);
    let pane = this.panes.get(list.paneName);
    let paneItems = pane.items;
    for (let item of paneItems) {
      item.visible = false;
    }
    //2.. Make its items visible;
    let listItems = list.listItems;
    for (let listItem of listItems) {
      listItem.visible = true;
    }
    //3.. Set the active list for this pane..
    pane.activeList = listName;
  }
  hideList(listName) {
    //1. Show the controls in this list's pane..
    let list = this.lists.get(listName);
    let pane = this.panes.get(list.paneName);
    let paneItems = pane.items;
    for (let item of paneItems) {
      item.visible = true;
    }
    //2.. Make its items INvisible;
    let listItems = list.listItems;
    for (let listItem of listItems) {
      listItem.visible = false;
    }
    //3.. Set the active list for this pane.. to nothing..
    pane.activeList = undefined;
  }

  draw() {
    //TODO: Deal with the corners (fun idea: LCARS -> then apply to the lists!)

    let pane;
    let runningX, runningY, incX, incY;
    for (let paneName of GUI.paneNames) {
      let pane = this.panes.get(paneName);
      if (pane.items.length > 0) {
        this.renderer.fillBox(pane.boundry.x1, pane.boundry.y1, pane.boundry.x2, pane.boundry.y2, this.view.backgroundColor);

        runningX = 0;
        runningY = 0;

        if (typeof pane.activeList === 'undefined') {
          if (paneName === 'top' || paneName === 'bottom') {
            runningX = pane.boundry.x1;
            incX = true; incY = false;
          }
          if (paneName === 'left' || paneName === 'right') {
            runningY = pane.boundry.y1;
            incX = false; incY = true;
          }
          for (let item of pane.items) {
            if (item.visible) {
              this.#drawItem(item, runningX, runningY);
              if (incX) runningX += (item.bounds.width + this.gap)
              if (incY) runningY += (item.bounds.height + this.gap);
            }
          }
        } else {
          

          if (paneName === 'top' || paneName === 'bottom') {
            //TODO: make changes here. 
            runningX = pane.boundry.x1;
            incX = true; incY = false;
          }
          if (paneName === 'left' || paneName === 'right') {
            //TODO: and here.
            runningY = pane.boundry.y1;
            incX = false; incY = true;
          }

          let list = this.lists.get(pane.activeList);
          let listItems = list.listItems;
          for (let listItem of listItems) {
            if (listItem.visible) {
              this.#drawItem(listItem, runningX, runningY);
              if (incX) runningX += (listItem.bounds.width + this.gap);
              if (incY) runningY += (listItem.bounds.height + this.gap);
            }
          }
        }
      }
    }
  }
  #drawItem(item, runningX, runningY) {
    let drawnBounds = new Boundry(
      item.bounds.x1 + runningX,
      item.bounds.y1 + runningY,
      item.bounds.x2 + runningX,
      item.bounds.y2 + runningY
    );
    let appearance = item.appearance;
    if (item.type === 'list' || item.type === 'button') {
      if (item.button.hovered) appearance = item.button.hoveredAppearance;
      else if (item.button.pressed) appearance = item.button.pressedAppearance;
    }
    let text = item.text;
    if (item.type === 'list') text = `${item.text} : ${item.selectedValue}`;
    this.renderer.textBox(
      drawnBounds.x1,
      drawnBounds.y1,
      drawnBounds.x2,
      drawnBounds.y2,
      text,
      this.fontSize,
      this.fontName,
      appearance);
    item.drawnBounds = drawnBounds;
  }
}
//TODO: when showing list items,
          //draw the list items perpendicular to the list...?
          //Just swap incX and incY, but how to set starting point..?
          //  set runningX and Y at the top of this method!
          //Logic flipped to make the list items 1. go perpendicular and 2. start next to "list spawner"
          
          //EXTRA Complication: the list spawner should also be drawn.. it should have "drawnBounds"
          //property to use for this.. that's also where we need to get the start position for the
          //list items from...

          //EXTRA EXTRA Complication: it will look wierd if the only thing attached to the panel is
          //the list..  so it would be great if they could be rendered too, but in an "inactive" state
          //so the list would be modal.  Maybe have a "greyed out" appearance required for GUI controls..

          //1. IF active list.. draw the items, but in "grey" mode (except the list button can be drawn
          //  normal but still should be inactive..
          //2. THEN draw the list items, setting the runningX/Y pane appropriately and according to the 
          //   list components drawnBounds AND SWAPPED to make them run perpendicular.
          //   NOTE: They're bounds won't be normal because they'll adapt the width /height of parent.....
          //     OK... so maybe we know they're going to be perpedicular, so we make their BOUNDS (at the 
          //     get___() stage) reflect the parent list control.. taken care of..
          //