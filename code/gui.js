import Boundry from './boundry.js';
import Appearance from './appearance.js';
import Button from './button.js';
import Director from './director.js';
import Draw from './draw.js'; //measures text..
export default class GUI {
  static paneNames = ['top', 'bottom', 'left', 'right'];
  constructor(colWidth, rowHeight, margin, view) {
    if (typeof colWidth !== 'number' || typeof rowHeight !== 'number') throw new Error(`GUI.constructor colWidth and rowHeight should be numbers [${colWidth},${rowHeight}].`);
    if (typeof margin !== 'number') throw new Error(`GUI.constructor(): margin is not a number: ${margin}`);
    this.margin = margin;
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
  getButton(label, normalAppearance, hoveredAppearance, pressedAppearance, toggle, fn) {
    if (typeof toggle !== 'boolean') throw new Error(`GUI.addButton: toggle must be boolean [${toggle}].`);
    let b = new Button(hoveredAppearance, pressedAppearance, fn, toggle);
    let newButton = {
      "type": 'button',
      "text": label,
      "appearance": normalAppearance,
      "button": b,
      "bounds": undefined,
      "drawnBounds": undefined,
      "visible": true,
    }
    b.guiControl = newButton;
    return newButton;
  }
  addButton(pane, label, normalAppearance, hoveredAppearance, pressedAppearance, toggle, fn) {
    if (!GUI.paneNames.includes(pane)) throw new Error(`GUI.addButton: Pane must be top,bottom,left, right or float [${pane}].`);
    let newButton = this.getButton(label, normalAppearance, hoveredAppearance, pressedAppearance, toggle, fn);
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
  getList(label, normalAppearance, hoveredAppearance, pressedAppearance, listName, listItems) {
    if (!Array.isArray(listItems)) throw new Error(`GUI.addList: Pane must be top,bottom,left, right or float [${pane}].`);
    if (this.lists.has(listName)) throw new Error(`GUI.addList: Pane ${pane} already contains list with name ${listName}`);
    let b = new Button(hoveredAppearance, pressedAppearance, (owner) => { Director.gui.showList(owner.listName); }, false);
    let newList = {
      "type": 'list',
      "listName": listName,
      "text": label,
      "appearance": normalAppearance,
      "button": b,
      "bounds": undefined,
      "drawnBounds": undefined,
      "listItems": undefined,
      "selectedItem": undefined,
      "visible": true
    };
    b.guiControl = newList; //Binding the button to the new control.. so the function points at this.. so it can pass this list's name to showList()..
    //make sure items is itemsList are actually buttons and bind those buttons to this list..    

    if (!Array.isArray(listItems)) throw new Error(`GUI.addList: Pane ${pane} already contains list with name ${listName}`);
    for (let item of listItems) {
      if (typeof item.type === 'string' && item.type === 'button') {
        item.listName = listName;
        item.visible = false;       
        item.button.clickFn = (owner) => {
          console.log(`list item click.. trying to hide list.${owner}`);
          Director.gui.hideList(owner.listName);
          Director.gui.lists.get(owner.listName).selectedItem = owner.text;
        }
      } else throw new Error(`GUI.addList: List item is not a button ${item}`);
    }
    newList.listItems = listItems;
    console.log(newList);
    return newList;
  }
  addList(pane, label, normalAppearance, hoveredAppearance, pressedAppearance, listName, listItems) {
    if (!GUI.paneNames.includes(pane)) throw new Error(`GUI.addList: Pane must be top,bottom,left, right or float [${pane}].`);
    let newList = this.getList(label, normalAppearance, hoveredAppearance, pressedAppearance, listName, listItems);
    newList.paneName = pane;
    newList.bounds = this.measureItem(pane, label);
    for (let listItem of newList.listItems) {
      listItem.bounds = this.measureItem(pane, listItem.text, newList.bounds);
      this.controls.push(listItem);  // Add list items to controls so they can be checked for mouse interaction
    }
    this.lists.set(listName, newList);
    this.panes.get(pane).items.push(newList);
    this.controls.push(newList);
  }
  showList(listName) {
    //1. Hide the controls in this list's pane..
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
    console.log(`a list item called back to close its list: ${listName}`)
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
    let pane;
    let runningX, runningY, incX, incY;
    for (let paneName of GUI.paneNames) {
      let pane = this.panes.get(paneName);
      if (pane.items.length > 0) {
        this.renderer.fillBox(pane.boundry.x1, pane.boundry.y1, pane.boundry.x2, pane.boundry.y2, this.view.backgroundColor);

        runningX = 0;
        runningY = 0;
        if (paneName === 'top' || paneName === 'bottom') {
          runningX = pane.boundry.x1;
          incX = true; incY = false;
        }
        if (paneName === 'left' || paneName === 'right') {
          runningY = pane.boundry.y1;
          incX = false; incY = true;
        }
        if (typeof pane.activeList === 'undefined') {
          for (let item of pane.items) {
            if (item.visible) {
              this.#drawItem(item, runningX, runningY);
              if (incX) runningX += item.bounds.width;
              if (incY) runningY += item.bounds.height;
            }
          }
        } else {
          let list = this.lists.get(pane.activeList);
          let listItems = list.listItems;
          for (let listItem of listItems) {
            if (listItem.visible) {
              this.#drawItem(listItem, runningX, runningY);
              if (incX) runningX += listItem.bounds.width;
              if (incY) runningY += listItem.bounds.height;
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
    this.renderer.textBox(
      drawnBounds.x1,
      drawnBounds.y1,
      drawnBounds.x2,
      drawnBounds.y2,
      item.text,
      this.fontSize,
      this.fontName,
      appearance);
    item.drawnBounds = drawnBounds;
  }
}
