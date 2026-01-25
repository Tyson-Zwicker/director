import Boundry from './boundry.js';
import Appearance from './appearance.js';
import Button from './button.js';
import Director from './director.js';
export default class GUI {
  static paneNames = ['top', 'bottom', 'left', 'right', 'float'];
  constructor(colWidth, rowHeight) {
    if (typeof colWidth !== 'number' || typeof rowHeight !== 'number') throw new Error(`GUI.constructor colWidth and rowHeight should be numbers [${colWidth},${rowHeight}].`);
    this.panes = new Map();
    //Boundries are calculated when the View calls resize, 
    //which it will call long before draw every looks for them.
    this.panes.set('top', { "boundry": undefined, "items": [], 'activeList': undefined });
    this.panes.set('bottom', { "boundry": undefined, "items": [], 'activeList': undefined });
    this.panes.set('left', { "boundry": undefined, "items": [], 'activeList': undefined });
    this.panes.set('right', { "boundry": undefined, "items": [], 'activeList': undefined });
    this.lists = new Map();
  }
  #topBoundry() {
    //The first time these are called, view is still constructing itself.. it will be called from draw() when needed
    //and view will be available then.
    if (typeof Director.view !== 'undefined') {
      let w = Director.view.canvas.width;
      let h = Director.view.canvas.height;
      return new Boundry(0, 0, w, rowHeight);
    }
    return undefined;
  }
  #bottomBoundry() {
    if (typeof Director.view !== 'undefined') {
      let w = Director.view.canvas.width;
      let h = Director.view.canvas.height;
      return new Boundry(0, h - rowHeight, w, h);
    }
    return undefined;
  }
  #leftBoundry() {
    if (typeof Director.view !== 'undefined') {
      let w = Director.view.canvas.width;
      let h = Director.view.canvas.height;
      return new Boundry(0, rowHeight, colWidth, h - rowHeight);
    }
    return undefined;
  }
  #rightBoundry() {
    if (typeof Director.view !== 'undefined') {
      let w = Director.view.canvas.width;
      let h = Director.view.canvas.height;
      return new Boundry(w - colWidth, rowHeight, w, h - rowHeight);
    }
    return undefined;
  }
  //This gets called from View.resizeCanvas().  That's the only place its called from. 2026-01-24
  resize() {
    this.panes.get('top').boundry = this.#topBoundry();
    this.panes.get('bottom').boundry = this.#bottomBoundry();
    this.panes.get('left').boundry = this.#leftBoundry();
    this.panes.get('right').boundry = this.#rightBoundry();
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
      "visible": true,
    }
    b.guiControl = newButton;
    return newButton;
  }
  addButton(pane, label, normalAppearance, hoveredAppearance, pressedAppearance, toggle, fn) {
    if (!GUI.paneNames.includes(pane)) throw new Error(`GUI.addButton: Pane must be top,bottom,left, right or float [${pane}].`);
    this.panes.get(pane).items.push(this.getButton(label, normalAppearance, hoveredAppearance, pressedAppearance, toggle, fn));
  }
  getText(label, appearance) {
    let newText = {
      "type": 'text',
      "text": label,
      "appearance": appearance,
      "button": undefined,
      "bounds": undefined,
      "visible": true
    };
  }
  addText(pane, label, appearance) {
    if (!GUI.paneNames.includes(pane)) throw new Error(`GUI.addText: Pane must be top,bottom,left, right or float [${pane}].`);
    this.panes.get(pane).items.push(this.getText(label, appearance));
  }
  getList(label, normalAppearance, hoveredAppearance, pressedAppearance, listName, listItems) {
    if (!Array.isArray(items)) throw new Error(`GUI.addList: Pane must be top,bottom,left, right or float [${pane}].`);
    if (this.lists.has(listName)) throw new Error(`GUI.addList: Pane ${pane} already contains list with name ${listName}`);
    let b = new Button(hoveredAppearance, pressedAppearance, (owner) => { Director.gui.showList(owner.listName); }, false);
    let newList = {
      "type": 'list',
      "listName": listName,
      "text": label,
      "appearance": normalAppearance,
      "button": b,
      "bounds": undefined,
      "visible": true
    };
    b.guiControl = this; //Binding the button to the new control.. so the function points at this.. so it can pass this list's name to showList()..
    //make sure items is itemsList are actually buttons and bind those buttons to this list..
    if (!Array.isArray(listItems)) throw new Error(`GUI.addList: Pane ${pane} already contains list with name ${listName}`);
    for (item of items) {
      if (typeof item.type === 'string' && item.type === 'button') {
        item.listName = listName;
      } else throw new Error(`GUI.addList: List item is not a button ${item}`);
    }
    newList.items = items;
    return newList;
  }
  addList(pane, label, normalAppearance, hoveredAppearance, pressedAppearance, listName, listItems) {
    if (!GUI.paneNames.includes(pane)) throw new Error(`GUI.addList: Pane must be top,bottom,left, right or float [${pane}].`);
    let newList = this.addTextgetList(label, normalAppearance, hoveredAppearance, pressedAppearance, listName, listItems);
    newList.paneName = pane;
    this.lists.set(listName, newList);
    this.panes.get(pane).items.push(newList);
  }
  showList(listName) {
    // Pane def: { "boundry": this.#topBoundry(), "items": [], 'activeList': undefined }
    //1. Hide the controls in this list's pane..
    let list = this.lists.get(listName);
    let pane = this.panes.get(list.paneName);
    let paneItems = pane.items;
    for (item of paneItems) {
      item.visible = false;
    }
    //2.. Make its items visible;
    let listItems = list.listItems;
    for (let listItem of listItems) {
      listItem.visible = true;
    }
    //3.. Set the active list for this pane..
    pane.activeList = listName;
    // Now next draw the list will be shown.  Its should probably be drawn with an offset so the list matches
    //where the button used to be...
  }
  hideList(listname) {
    //1. Show the controls in this list's pane..
    let list = this.lists.get(listName);
    let pane = this.panes.get(list.paneName);
    let paneItems = pane.items;
    for (item of paneItems) {
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
    //TODO.. I have to measure all these things and set 
    //the boundried before I can draw them...
    
    // if the boundries are undefined, call measure(), also
     //measure after resizing..

     //keep the sizes in the items because that won't change, 
     //when the window is resized, only the offset (based on where the
     //pane moved) will be different.


    //top and bottom go horizontally.
    let pane = this.panes['top'];
    
    if (typeof topItems.activeList === 'undefined') {
      let topItems = pane.items;
      for (item of topItems) {
        if (item.isVisible) {
          //draw the item..
        }
      }
    }else{
      for (item of topItems) {
        if (typeof item.listName !=='undefined') {
          if (item.listName === topItems.activeList){
            for (let listItem of item.listItems){
              //draw the listItem..
            }
          }
        }
      }
    }
    pane = this.panes['bottom'];
    let bottomItems = this.panes['bottom'].items;
    for (item in bottomItems) {

    }
    pane = this.panes['left'];
    let leftItems = this.panes['left'].items;
    for (item in leftItems) {

    }
    pane = this.panes['right'];
    let rightItems = this.panes['right'].items;
    for (item in rightItems) {

    }
    //calculate the width of all the parts put together..
    //use that to set an offset from the left side = (totalwidth-neededwidth) /2
    //the size something needs is basically just the width of the text + margin*2
    //draw.textBox(x1, y2, x2, y2, text, fontSize, fontName, appearance)
    //class Draw {
    //  constructor(context2d)

  }
}