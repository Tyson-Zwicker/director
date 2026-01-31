import Boundry from './boundry.js';
import Button from './button.js';
import Point from './point.js';
import Check from './check.js';
import GUI from './gui_new.js';
import GUIElement from './guielement.js';
import Director from './director.js';
import Draw from './draw.js';
import Appearance from './appearance.js';
export default class GUIPanel {
  elements = [];
  listElements = new Map();
  listPanel = undefined; //showList sets this..
  constructor(location, parentElement) {
    if (!Check.str(location) || !GUI.locations.includes(location)) throw new Error(`GUIPanel.constructor: location is invalid [${location}]`);
    this.location = location;
    this.activeList = undefined;
    if (location === 'float') {
      let direction;
      if (parentElement.panel.location === 'top') direction = 'down';
      if (parentElement.panel.location === 'bottom') direction = 'up';
      if (parentElement.panel.location === 'left') direction = 'right';
      if (parentElement.panel.location === 'right') direction = 'left';
      console.log(`GUIPANEL CONSTRUCTOR PARENT's PANEL ${parentElement.panel.location} so my direction = ${direction}`);
      let { offset, boundry } = this.calculateFloat(parentElement, direction);
      this.offset = offset;
      this.boundry = boundry;
      //1. Make the buttonElement for the list item..
      for (item in parentElement.listItemData) {
        let itemElement = new GUIElement(direction, item.text, parentElement.appearance, parentElement.shadowAppearance);
        itemElement.type = 'button';
        itemElement.callbackPanel = parentElement.panel;
        let callbackFn = function (result) {
          result.owner.callbackPanel.hideList(result.value);
        }
        let button = new Button(
          parentElement.button.hoveredAppearance,
          parentElement.button.pressedAppearance,
          callbackFn, false, item.value);
        button.guiElement = itemElement;
        itemElement.button = button;
        this.elements.push(itemElement);
      }
    }
  }

  drawPanel() {
    if (this.location === 'float') {
      console.log(this);
    }
    if (this.elements.length > 0) {
      let drawer = new Draw(Director.view.context);
      drawer.fillBox(this.boundry.x1, this.boundry.y1, this.boundry.x2, this.boundry.y2, '#022');
      let cursor = Point.from(this.offset);
      for (let element of this.elements) {
        if (element.type === 'list' && element === this.activeList) {
          this.drawElement(drawer, element, cursor, true); //So..draw the list button and now..
          //1. Create a floating pane. Its provide the listElement that spawned it, and the location of the spawning panel.
          this.listPanel.drawPanel();

        } else {
          this.drawElement(drawer, element, cursor, this.activeList !== undefined);//passing where to start drawing and if it should look "shadowed" or not.
        }
        cursor.x += this.direction.x * (GUI.gap + element.bounds.width);
        cursor.y += this.direction.y * (GUI.gap + element.bounds.height);
      }
    }
  }
  drawElement(draw, element, cursor, shadow) {
    let appearance = element.appearance;
    if (shadow) {
      appearance = element.shadowAppearance;
    } else if (element.type === 'button') {
      if (element.button.pressed) {
        appearance = element.button.pressedAppearance;
      } else if (element.button.hovered) {
        appearance = element.button.hoveredAppearance;
      }
    }
    draw.textBox(
      element.bounds.x1 + cursor.x, element.bounds.y1 + cursor.y,
      element.bounds.x2 + cursor.x, element.bounds.y2 + cursor.y,
      element.text,
      GUI.fontSize, GUI.fontName, appearance);
    element.drawnBounds = new Boundry(
      element.bounds.x1 + cursor.x, element.bounds.y1 + cursor.y,
      element.bounds.x2 + cursor.x, element.bounds.y2 + cursor.y);
  }
  showList(listElement) {
    console.log(`ONLY LIST HERE CALLS SHOWLIST PANEL's LOCATION:${listElement.panel.location}`);
    let floatingPanel = new GUIPanel('float', listElement); //floating panel just needs items..
    console.log('new floating panel:');
    console.log(floatingPanel);
    Director.continueAnimationLoop = false;
    this.listPanel = floatingPanel;
    this.activeList = listElement;
    for (let element of this.elements) element.active = false; //deactive everything so list is only active elemenet..    
  }

  hideList(selectedValue) {
    this.activeList.value = selectedValue;
    this.activeList = undefined;
    for (let element of this.elements) element.active = true; //Re-active everything- floating panel is gone..
    this.floatingPanel = undefined;
    this.recalculate;
  }

  addText(text, appearance, shadowAppearance) {
    let direction = 'left'; //Not the same as the point vector "this.direction"
    if (location === 'right' || this.location === 'left') direction = 'down';
    let textElement = new GUIElement(direction, text, appearance, shadowAppearance);
    textElement.type = 'text';
    this.elements.push(textElement);
    return textElement;
  }
  addButton(text, appearance, shadowAppearance, hoveredAppearance, pressedAppearance, toggle, fn, value) {
    let direction = 'left'; //Not the same as the point vector "this.direction"
    if (location === 'right' || this.location === 'left') direction = 'down';
    let buttonElement = new GUIElement(direction, text, appearance, shadowAppearance);
    buttonElement.type = 'button';
    this.elements.push(buttonElement);
    //extra button stuff..
    let button = new Button(hoveredAppearance, pressedAppearance, fn, toggle, value);
    button.guiElement = buttonElement;
    buttonElement.button = button;
    return buttonElement;
  }
  addList(text, appearance, shadowAppearance, hoveredAppearance, pressedAppearance, listItems, defaultValue) {
    let direction = 'left'; //Not the same as the point vector "this.direction"
    if (location === 'right' || this.location === 'left') direction = 'down';
    let listElement = new GUIElement(direction, text, appearance, shadowAppearance);
    listElement.listItemsData = listItems;//{text, value}
    listElement.type = "list"
    listElement.panel = this;
    console.log(`ONLY LIST HERE HAS A PANEL LOCATION:${listElement.panel.location}`);
    this.elements.push(listElement);
    let listCallback = (e) => {
      e.owner.panel.showList(e.owner);
    }
    let listButton = new Button(hoveredAppearance, pressedAppearance, listCallback, false, defaultValue);
    listButton.guiElement = listElement;;
    listElement.button = listButton;
    return listElement;
  }
  calculateFloat(listElement, dir) {
    let itemsWidth = this.#getFloatElementsCollectiveWidth(dir, listElement);
    let itemsHeight = this.#getFloatElementsCollectiveHeight(dir, listElement);
    console.log('listElement= ');
    console.log(listElement);
    console.log('itemsWidth calculated:' + itemsWidth);
    console.log('itemsHeight calculated:' + itemsHeight);
    console.log('direction given: ' + dir);
    let direction = undefined;
    let boundry = undefined;
    let offset = undefined;
    if (dir === 'up') {
      direction = new Point(0, 1);
        let x1 = listElement.drawnBounds.x1 - itemsWidth;
      let y1 = listElement.drawnBounds.y1;
      let x2 = listElement.drawnBounds.x1;
      let y2 = listElement.drawnBounds.y1 + GUI.columnHeight;
      boundry = new Boundry(x1,y1,x2,y2);
      offset = new Point(listElement.drawnBounds.x1, listElement.drawnBounds.y1);
    }
    if (dir === 'down') {
      direction = new Point(0, -1);
      let x1 = listElement.drawnBounds.x1 - itemsWidth;
      let y1 = listElement.drawnBounds.y1;
      let x2 = listElement.drawnBounds.x1;
      let y2 = listElement.drawnBounds.y1 + GUI.columnHeight;
      boundry = new Boundry(x1, y1, x2, y2);

      offset = new Point(listElement.drawnBounds.x1, listElement.drawnBounds.y2);
    }
    if (dir === 'left') {
      direction = new Point(1, 0);
      let x1 = listElement.drawnBounds.x1 - itemsWidth;
      let y1 = listElement.drawnBounds.y1;
      let x2 = listElement.drawnBounds.x1;
      let y2 = listElement.drawnBounds.y1 + GUI.columnHeight;
      boundry = new Boundry(x1, y1, x2, y2);
      offset = new Point(listElement.drawnBounds.x1, listElement.drawnBounds.y1);
    }
    if (dir === 'right') {
      direction = new Point(-1, 0);
      let x1 = listElement.drawnBounds.x2;
      let y1 = listElement.drawnBounds.y1;
      let x2 = listElement.drawnBounds.x2 + itemsWidth;
      let y2 = listElement.drawnBounds.y1 + GUI.columnHeight;
      console.log(x1, y1, x2, y2);
      boundry = new Boundry(x1, y1, x2, y2)
      offset = new Point(listElement.drawnBounds.x2, listElement.drawnBounds.y1);
      console.log('SETTING :');
      console.log(listElement);
      console.log(offset);
      console.log(boundry);
      console.log(direction);
    }
    console.log('calculateFloat calculated: (offset&boundry&direction)');
    console.log(offset);
    console.log(boundry);
    console.log(direction);
    return { offset: offset, boundry: boundry, direction: direction };
  }

  recalculate() {
    this.activeList = undefined; //If a list was opened, close it when they start fiddling with the window..
    let width = Director.view.canvas.width;
    let height = Director.view.canvas.height;
    let itemsWidth = this.#getElementsCollectiveWidth();
    let itemsHeight = this.#getElementsCollectiveHeight();
    switch (this.location) {
      case 'top':
        this.direction = new Point(1, 0);
        this.boundry = new Boundry(
          GUI.columnWidth, 0,
          width - GUI.columnWidth, GUI.rowHeight
        );
        this.offset = new Point(this.boundry.x1, this.boundry.y1);
        break;
      case 'bottom':
        this.direction = new Point(1, 0);
        this.boundry = new Boundry(
          GUI.columnWidth, height - GUI.rowHeight,
          width - GUI.columnWidth, height
        );
        this.offset = new Point(this.boundry.x1, this.boundry.y1);
        break;
      case 'left':
        this.direction = new Point(0, 1);
        this.boundry = new Boundry(
          0, GUI.rowHeight,
          GUI.columnWidth, height - GUI.rowHeight
        );
        this.offset = new Point(this.boundry.x1, this.boundry.y1);
        break;
      case 'right':
        this.direction = new Point(0, 1);
        this.boundry = new Boundry(
          width - GUI.columnWidth, GUI.rowHeight,
          width, height - GUI.rowHeight
        );
        this.offset = new Point(this.boundry.x1, this.boundry.y1);
        break;
      default:
        throw new Error('GUIPanel:calculate(): unknown location :' + this.location);
    }//end switch
  }


  #getFloatElementsCollectiveWidth(direction, listElement) {
    let width = 0;
    if (direction === 'up' || direction === 'down') {
      //They're going up and down so width is based on width of spawner..
      return listElement.drawnBounds.width;
    } else {
      //They're going go to be based on column Width x items.;
      return GUI.columnWidth * listElement.listItemsData.length;
    }
  }

  #getFloatElementsCollectiveHeight(direction, listElement) {
    let hieght = 0;
    if (direction === 'up' || direction === 'down') {
      //They're going up and down so height is row Height x number of items..
      return GUI.rowHeight * listElement.listItemsData.length;
    } else {
      //Its going left to right so height if based on a single spawners height
      return listElement.drawnBounds.height;
    }
  }

  #getElementsCollectiveWidth() {
    if (this.location === 'top' || this.location === 'bottom') {
      let w = 0;
      for (let element of this.elements) w += element.bounds.width;
      return w;
    } else if (this.location === 'left' || this.location === 'right') {
      return GUI.columnWidth;
    }
  }

  #getElementsCollectiveHeight() {
    if (this.location === 'top' || this.location === 'bottom') {
      return GUI.columnWidth;
    } else if (this.location === 'left' || this.location === 'right') {
      let h = 0;
      for (let element of this.elements) h += element.bounds.height;
    }
  }
}