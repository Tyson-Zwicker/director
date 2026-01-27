

class GUIElement {
  constructor (direction, text, appearance, shadowAppearance, hoverAppearance, pressedAppearance, button, value){
    let bounds =  measureItem(direction, text);
    this.bounds = bounds;
    this.active = true;//TODO: this replaces what "visible" used to do.
    this.text = text;
    this.drawnBounds = undefined;
    this.appearance = appearance;
    this.shadowAppearance = shadowAppearance;
    //This is enough for the textbox, other Element Types (button and list)
    //require additional properties assigned in the get control methods..    
    this.hoveredAppearance = hoveredAppearance;
    this.pressedAppearance = pressedAppearance;    
    this.button = undefined; //assign at get when button is created depending on type..
    this.selectedValue = undefined //Only used by lists..
  }
  measureItem() {
    //This is the items personal bounds.  They are not screen coordinates,
    //they describe the shape of this one item, regardless of its position in the panel.
    let textSize = this.renderer.getTextSize(text, this.fontSize, this.fontName);
    if (direction ==='up' || direction ==='down'){
      return new Boundry (0,0,GUI.columnWidth, textSize.height);
    }else{
      return new Boundry (0,0,textSize.width, GUI.rowHeight);
    }
  }
}
