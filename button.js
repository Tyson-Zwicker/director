import Point from './point.js';
export default class Button {
  hovered = false;
  pressed = false;
  clickFn = null;
  clicked = false;
  toggle = false;
  actor = null;
  constructor(hoveredAppearance, pressedAppearance, clickFn = null, toggle = false) {
    this.hoveredAppearance = hoveredAppearance;
    this.pressedAppearance = pressedAppearance;
    this.clickFn = clickFn;
    this.toggle = toggle;
  }
  #click() {
    if (!this.toggle) {
      if (this.clickFn) {
        this.clickFn();
      }
    } else {
      this.clicked = !this.clicked;
      if (this.clicked) {
        if (this.clickFn) {
          this.clickFn();
        }
      } 
    }
  }
  checkForMouse(mouse) {
    let interaction = false;
    if (this.actor.polygon.isPointIn(new Point(mouse.x, mouse.y))) {
      if (mouse.buttonDown && !this.hovered) {
        //*Must* be checked first.. mouse went down somewhere else, but not here.. doesn't affect this actor..
        return false;
      }
      else if (!mouse.buttonDown && !this.hovered) {
        //mouse hovers over actor, not button pressed..
        this.hovered = true
        interaction = true;
      }
      else if (mouse.buttonDown && this.hovered && !this.pressed) {
        //they just pressed on this button, which was being hovered over..
        this.pressed = true;
        interaction = true;
      }
      else if (!mouse.buttonDown && this.pressed) {
        //they just let up on the button after pressing.. that is a click.
        this.#click();
        this.hovered = false;
        this.pressed = false;
        interaction = true;
      } else {
        interaction = true;
      }
    } else {
      this.pressed = false; // So it can't be clicked if its not on it..
      this.hovered = false;
    }
    return interaction;
  }
}