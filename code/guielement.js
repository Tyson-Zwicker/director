

import Boundry from './boundry.js';
import Point from './point.js';
import Check from './check.js';
import GUI from './gui_new.js';

export default class GUIElement {
  constructor (direction, text, appearance, shadowAppearance){
    let bounds =  measureItem(direction, text);
    this.bounds = bounds;
    this.active = true;
    this.text = text;
    this.drawnBounds = undefined;
    this.appearance = appearance;
    this.shadowAppearance = shadowAppearance;
    //This is enough for the textbox, other Element Types (button and list)
    //require additional properties assigned in the get control methods..        
  }
  measureItem() {
    //This is the items personal bounds.  They are not screen coordinates,
    //they describe the shape of this one item, regardless of its position in the panel.
    let textSize = GUI.renderer.getTextSize(text, GUI.fontSize, GUI.fontName);
    if (direction ==='up' || direction ==='down'){
      return new Boundry (0,0,GUI.columnWidth, textSize.height);
    }else{
      return new Boundry (0,0,textSize.width, GUI.rowHeight);
    }
  }
}
