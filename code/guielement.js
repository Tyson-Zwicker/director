

import Boundry from './boundry.js';
import Director from './director.js';
import GUI from './gui.js';
import Draw from './draw.js';
import Check from './check.js';

export default class GUIElement {
  constructor ( text, appearance, shadowAppearance){    
    this.bounds =  new Boundry (0,0,GUI.columnWidth, GUI.rowHeight); 
    this.active = true;
    this.text = text;
    this.drawnBounds = undefined;
    this.appearance = appearance;
    this.shadowAppearance = shadowAppearance;
    //This is enough for the textbox, other Element Types (button and list)
    //require additional properties assigned in the get control methods..        
  }
}
