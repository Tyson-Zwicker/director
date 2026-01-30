import Check from './check.js';
import Director from './director.js';
import GUIPanel from './guipanel.js';
import GUIElement from './guielement.js';
import Draw from './draw.js';
export default class GUI{  
  static locations = ['top','bottom','left','right', 'float'];
  static renderer = undefined;
  static listElements = new Map();
  static elements = [];
  static panes = new Map();
  
  static initialize (columnWidth, rowHeight, gap, padding, fontSize, fontName){
    if (!Check.num (columnWidth) || !Check.num(rowHeight)) throw new Error(`GUI.constructor colWidth and rowHeight should be numbers [${colWidth},${rowHeight}].`);
    if (!Check.num (padding)) throw new Error(`GUI.constructor(): padding is not a number: ${padding}`);        
    if (!Check.str(fontName) || !Check.num(fontSize)) throw new Error (`GUIConstructor: bad font name [${fontName}] or size [${fontSize}]`);
    GUI.columnWidth = columnWidth;
    GUI.rowHeight = rowHeight;
    GUI.gap = gap;
    GUI.padding = padding;    
    GUI.fontSize = fontSize;
    GUI.fontName = fontName;    
    this.panes.set ('top', new GUIPanel ('top'));
    this.panes.set ('bottom', new GUIPanel ('bottom'));
    this.panes.set ('left', new GUIPanel ('left'));
    this.panes.set ('right', new GUIPanel ('right'));  
    this.controls =[];
  }
  static isMouseIn (GUIElement,mouse){
   return GUIElement.drawnBounds.isPointInside (mouse.x,mouse.y);
  }
  static isControl (element){
    return Check.obj (element , GUIElement);
  }
  static draw(){}
  static resize (){
    if (typeof GUI.renderer ==='undefined') GUI.renderer = new Draw(view.context); //called from view.resize (so a good 
    //Don't resize 'float' -floating panes are dismissed 
    //if a window is resized so they don't care..
    GUI.panes['top'].recaclulate();
    GUI.panes['bottom'].recalculate();
    GUI.panes['left'].recalculate();
    GUI.panes['right'].recalculate();
    GUI.panes['top'].draw();
    GUI.panes['bottom'].draw();
    GUI.panes['left'].draw();
    GUI.panes['right'].draw();
  }
  //TODO: addText(){}
  //TODO: addButton{}
  //TODO: addList(){}
  //ToDO: addListElement(){
}