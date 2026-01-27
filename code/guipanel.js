import Boundry from './boundry.js';
import Point from './point.js';
import Check from './check.js';
import GUI from './gui.js';
import Director from './director.js';

class GUIPanel {
  elements = [];
  listElements = new Map();
  listPanel = undefined; //showList sets this..
  constructor(location, parentElement) {
    if (!Check.str(location) || !GUI.locations.contains(location)) throw new Error(`GUIPanel.constructor: location is invalid [${location}]`);
    this.location = location;
    this.activeList = undefined;
    if (location !== 'float') this.recalculate(); //Sets direction, boundry and offset.
    else if (location !== 'float') this.calculateFloat(parentElement);
  }

  draw() {
    let cursor = Point.from(this.offset);
    for (let element of this.elements) {
      if (element.type === 'list' && element.listName === this.activeList) {
        element.draw(cursor, this.activeList !== undefined);
        this.listPanel.draw(); //List panel is managed by show/hide List..
      } else {
        element.draw(cursor, this.activeList !== undefined);//passing where to start drawing and if it should look "shadowed" or not.
      }
      cursor.x += direction.x * (gap + element.bounds.width);
      cursor.y += direction.y * (gap + element.bounds.height);
    }
  }
  
  showList(listElement) {
    let floatingPanel = new Panel('float', listElement);
    this.listPanel = floatingPanel;
    this.activeList = listElement;
  }
  
  hideList() {
    this.activeList = undefined;
    this.floatingPanel = undefined;
  }
  
  calculateFloat(items, direction, listElement) {
    let itemsWidth = this.#getFloatElementsCollectiveWidth(direction);
    let itemsHeight = this.#getFloatElementsCollectiveHeight(direction);
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
        this.boundry = new Point(
          0, GUI.rowHeight,
          GUI.columnWidth, height - GUI.rowHeight
        );
        this.offset = new Point(this.boundry.x1, this.boundry.y1);
      case 'right':
        this.direction = new Point(0, 1);
        this.boundry(
          width - GUI.columnWidth, GUI.rowHeight,
          width, height - GUI.rowHeight
        );
        this.offset = new Point(this.boundry.x1, this.boundry.y1);
    }//end switch
  }
  
  #getFloatElementsCollectiveWidth(direction) {
    if (direction ==='up' || direction ==='down'){
//TODO: finish.
    }
  }
  
  #getFloatElementsCollectiveHeight(direction) {
//TODO: finish..
  }
  
  #getElementsCollectiveWidth() {
    if (this.location === 'top' || this.location === 'bottom') {
      let w = 0;
      for (let element in elements) w += element.bounds.width;
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
      for (let element in elements) h += element.bounds.height;
    }
  }
}