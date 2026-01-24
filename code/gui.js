import Boundry from './boundry.js';
import Appearance from './appearance';
class GUIPane {
  constructor(orientation, hidden) {
    if (typeof oriention !== 'string' || (orientation !== 'vertical' && orientation !== 'horizontal'))
      throw new Error(`GIUPane.constructor: orientation must be "vertical" or "horizontal" [${orientation}`);
    if (typeof hidden !=='boolean') 
      throw new Error(`GIUPane.constructor: hidden must be true or false [${orientation}`);
    this.orientation = orientation;
    this.hidden=hidden;
    this.items = new map();
  }
}
class GUIControl{ //Appearance is currently governed by button..
  //constructor (bounds, text, appearance
}

/*
context.clip() to restrict canvas operation so this doesn't get over-written
Philosophy:
There are four panes surrounding the window (top, bottom, left, right)
They may be shown or hidden.
They have cells.  Top and Bottom have horizontal orientation, Left and right are vertical.
They write from top to bottom and left to right.
Think of each panel like a menu.
  -It can have items you just pick (normal button)
  -It can have settings you toggle.
  -It can have a sub menu
  -It can also just have some text (That's just an unclickable button really)

-buttons and toggles are easy (the button class already does all the logic)
-menus could be handled by temporarily replacing the panel with another panel, with the same controls. 
  -make it recursive for sub-sub panels..
-
-radio buttons just take care of themselves because they are a sub menu of toggles...
  -but the button you press should have a title and show the current selection, 
  -or maybe it just has a text field above it that says like "mode:" and the button that shows
  the submenu's current label is the toggled option..\
  -in which case some level of recognition of "radio button" is in order, I guess.

controls can be visible or hidden.
The director has these panes when initialized, they need only be assigned controls.
 
*/