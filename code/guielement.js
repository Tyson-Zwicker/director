

import Boundry from './boundry.js';
import Director from './director.js';
import GUI from './gui.js';
import Draw from './draw.js';
import Check from './check.js';

export default class GUIElement {
  constructor (direction, text, appearance, shadowAppearance, forceWidth, forceHeight){    
    if (Check.num (forceWidth) && Check.num (forceHeight)){
      this.bounds = new Boundry(0,0,forceWidth, forceHeight);
    }else{
      this.bounds =  this.measureItem(direction, text);
    }
    this.active = true;
    this.text = text;
    this.drawnBounds = undefined;
    this.appearance = appearance;
    this.shadowAppearance = shadowAppearance;
    //This is enough for the textbox, other Element Types (button and list)
    //require additional properties assigned in the get control methods..        
  }
  measureItem(direction,text) {
    return new Boundry (0,0,GUI.columnWidth, GUI.rowHeight);
    //This is the items personal bounds.  They are not screen coordinates,
    //they describe the shape of this one item, regardless of its position in the panel.
    let drawer = new Draw (Director.view.context);
    let textSize = drawer.getTextSize(text, GUI.fontSize, GUI.fontName);
    if (direction ==='up' || direction ==='down'){
      return new Boundry (0,0,GUI.columnWidth, textSize.height+GUI.padding);
    }else{
      return new Boundry (0,0,textSize.width+GUI.padding, GUI.rowHeight);
    }
  }
}
