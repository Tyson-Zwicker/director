import Check from './check.js';
export default class GUI{  
  static locations = ['top','bottom','left','right', 'float'];
  static renderer = undefined;
  static listElements = new Map();
  static elements = [];
  static panes = new Map();
  initialize (columnWidth, rowHeight, gap, padding, fontSize, fontName){
    if (!Check.num (columnWidth) || !Check.num(rowHeight)) throw new Error(`GUI.constructor colWidth and rowHeight should be numbers [${colWidth},${rowHeight}].`);
    if (!Check.num (margin)) throw new Error(`GUI.constructor(): margin is not a number: ${margin}`);        
    if (!Check.str(fontName) || !Check.num(fontSize)) throw new Error (`GUIConstructor: bad font name [${fontName}] or size [${fontSize}]`);
    GUI.columnWidth = columnWidth;
    GUI.rowHeight = rowHeight;
    GUI.gap = gap;
    GUI.padding = padding;    
    GUI.fontSize = fontSize;
    GUI.fontName = fontName;
    GUI.renderer = new Draw(view.context);
    this.#initializePanes(); 
  }
  #initializePanes(){
    this.panes.set ('top', new Pane ('top'));
    this.panes.set ('bottom', new Pane ('bottom'));
    this.panes.set ('left', new Pane ('left'));
    this.panes.set ('right', new Pane ('right'));
  }
  resize (){
    //Don't resize 'float' -floating panes are dismissed 
    //if a window is resized so they don't care..
    GUI.panes['top'].resize();
    GUI.panes['bottom'].resize();
    GUI.panes['left'].resize();
    GUI.panes['right'].resize();
  }
  isMouseIn (control, point){
    return control.drawnBounds.isPointInside (point.x, point.y);
  }
}