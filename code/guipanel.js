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
    if (location === 'float') this.calculateFloat(parentElement);//DO NOT calc normal panes yet..the view isn't ready..
  }

  drawPanel() {
    if (this.elements.length > 0) {
      let drawer = new Draw(Director.view.context);
      drawer.fillBox(this.boundry.x1, this.boundry.y1, this.boundry.x2, this.boundry.y2, '#096');
      let cursor = Point.from(this.offset);
      for (let element of this.elements) {
        if (element.type === 'list' && element.listName === this.activeList) {
          this.drawElement(drawer, element, cursor, this.activeList !== undefined);
          this.listPanel.draw(); ////TODO: this iscalling itself to draw the list's floating panel..List panel is managed by show/hide List..
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
  }
  showList(listElement) {
    let floatingPanel = new Panel('float', listElement);
    this.listPanel = floatingPanel;
    this.activeList = listElement;
    for (let element of this.elements) element.active = true; //reactive the panels items..
    this.calculateFloat();
    this.recalculate();

  }

  hideList() {
    this.activeList = undefined;
    for (let element of this.elements) element.active = false; //deactive everything- floating list panel is active now..
    this.floatingPanel = undefined;
    this.recalculate;
  }

  calculateFloat(items, direction, listElement) {
    let itemsWidth = this.#getFloatElementsCollectiveWidth(direction, listElements);
    let itemsHeight = this.#getFloatElementsCollectiveHeight(direction.listElements);
    let elementBounds = listElement.bounds;
    if (direction === 'up') {
      direction = new Point(0, 1);
      this.boundry = new Boundry(
        elementBounds.x1, elementBounds.y1 - itemsHeight,
        elementBounds.x1 + itemsWidth, elementBounds.y1
      );
      this.offset = new Point(elementBounds.x1, elementBounds.y1);

    }
    if (direction === 'down') {
      direction = new Point(0, -1);
      this.boundry = new Boundry(
        elementBounds.x1, elementBounds.y2,
        elementBounds.x1 + itemsWidth, elementBounds.y2 + itemsHeight
      );
      this.offset = new Point(elementBounds.x1, elementBounds.y2);
    }
    if (direction === 'left') {
      direction = new Point(1, 0);
      this.boundry = new Boundry(
        elementBounds.x1 - itemsWidth, elementBounds.y1,
        elementBounds.x1, elementBounds.y1 + GUI.columnHeight,

      );
      this.offset = new Point(elementBounds.x1, elementBounds.y1);
    }
    if (direction === 'right') {
      direction = new Point(-1, 0);
      this.boundry = new Boundry(
        elementBounds.x2, elementBounds.y1,
        elementBounds.x2 + itemsWidth, elementBounds.y1 + GUI.columnHeight,
      );
      this.offset = new Point(elementBounds.x2, elementBounds.y1);
    }
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
      return listElement.bounds.width;
    } else {
      //They're going go to be based on column Width x items.;
      return GUI.columnWidth * listElement.items.length;
    }
  }

  #getFloatElementsCollectiveHeight(direction, listElement) {
    let hieght = 0;
    if (direction === 'up' || direction === 'down') {
      //They're going up and down so height is row Height x number of items..
      return GUI.rowHeight * listElement.items.length;
    } else {
      //Its going left to right so height if based on a single spawners height
      return listElement.bounds.height;
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

  //constructor (direction, text, appearance, shadowAppearance, hoverAppearance, pressedAppearance){
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
    let button = new Button(hoveredAppearance, pressedAppearance, fn, toggle, value);
    button.owner = buttonElement;
    buttonElement.button = button;
    return buttonElement;
  }
  //TODO: add lists..
  addList(text, appearance, shadowAppearance) {

  }
  getListItem() { }

}