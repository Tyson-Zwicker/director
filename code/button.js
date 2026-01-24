import Point from './point.js';
export default class Button {
  actor = undefined;
  guiControl = undefined;
  clicked = false;
  clickFn = undefined;
  hovered = false;
  pressed = false;
  toggle = false;

  //Must be bound by an actor or GUIcontrol to do anything..
  //They must bind the actor OR guiControl property.
  constructor(hoveredAppearance, pressedAppearance, clickFn = null, toggle = false) {
    this.hoveredAppearance = hoveredAppearance;
    this.pressedAppearance = pressedAppearance;
    this.clickFn = clickFn;
    this.toggle = toggle;
  }
  checkForMouse(mouse) {
    let insideBounds = false;
    if (typeof this.guiControl === 'object' && this.guiControl instanceof GUIControl) {
      insideBounds = this.actor.guiControl.isMouseIn(Point.from(mouse.x, mouse.y));
    } else if (typeof this.actor === 'object' && this.actor instanceof Actor) {
      insideBounds = this.actor.polygon.isPointIn(Point.from(mouse.x, mouse.y))
    }
    let interaction = false;
    if (insideBounds) {
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
      this.pressed = false; // So.. it can't be clicked if its not on it..
      this.hovered = false;
    }
    return interaction;

  }
  #click() {
    let buttonOwner = undefined;
    if (typeof this.actor !== 'undefined' && this.actor instanceof Actor) buttonOwner = this.actor;
    else if (typeof this.guiControl !== 'undefined') buttonOwner = this.guiControl;
    else throw new Error('Button.#click:  This button has been clicked but it has no owner.');

    if (!this.toggle) {
      if (typeof this.clickFn === 'function') {
        this.clickFn(buttonOwner);
      }
    } else {
      this.clicked = !this.clicked;
      if (this.clicked) {
        if (typeof this.clickFn === 'function') {
          this.clickFn(buttonOwner);
        }
      }
    }
  }
}