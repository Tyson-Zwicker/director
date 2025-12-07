import Point from './point.js';

export default class View {


  backgroundPressed = false;
  backgroundPressedCoordinate = null;
  backgroundColor = "#012";
  bounds = undefined;
  camera = Point.zero();
  canvas = document.createElement('canvas');
  context = this.canvas.getContext('2d');
  minimumZoom = 0.1;
  mouse = new Point(0, 0);
  screenCenter = null; // Initialize as null
  zoomFactor = 10;

  constructor(background) {
    this.mouse.buttonDown = false;
    this.camera.zoom = 1; // Default zoom level
    this.context = this.canvas.getContext('2d');
    if (background) this.backgroundColor = background;
    let body = document.getElementsByTagName('body')[0];
    body.appendChild(this.canvas);
    body.style.margin = 0;
    body.style.padding = 0;
    this.canvas.style.margin = 0;
    this.canvas.style.padding = 0;
    this.canvas.id = 'canvas';
    this.canvas.onwheel = this.handleWheel;
    this.canvas.onmousemove = this.handleMouseMove;
    this.canvas.onmousedown = this.handleMouseDown;
    this.canvas.onmouseup = this.handleMouseUp;
    this.canvas.oncontextmenu = this.handleContextMenu;
    window.addEventListener('resize', this.resizeCanvas.bind(this));
    this.resizeCanvas();  // This will set screenCenter and the bounds.
  }
  canSee(point, radius) {
    let { x0, y0, x1, y1 } = this.bounds;
    if (radius && typeof radius === 'number') {
      x0 -= radius;
      y0 -= radius;
      x1 += radius;
      y1 += radius;
    }
    return (
      point.x >= x0 &&
      point.y >= y0 &&
      point.x <= x1 &&
      point.y <= y1
    );
  }
  #calcBounds() {
    this.bounds = {
      "x0": this.camera.x - this.screenCenter.x / this.camera.zoom,
      "y0": this.camera.y - this.screenCenter.y / this.camera.zoom,
      "x1": this.camera.x + this.screenCenter.x / this.camera.zoom,
      "y1": this.camera.y + this.screenCenter.y / this.camera.zoom
    }
  }
  clear() {
    this.context.fillStyle = this.backgroundColor;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  handleCameraDrag(actorMouseInteraction) {
    if (!actorMouseInteraction) {
      if (this.backgroundPressed && this.mouse.buttonDown) {
        //drag occuring..         
        let drag = Point.from(this.backgroundPressedCoordinate);
        let inverseMouse = new Point(this.mouse.x * -1, this.mouse.y * -1)
        Point.add(drag, inverseMouse);
        Point.scale(drag, 1 / this.camera.zoom);
        Point.add(this.camera, drag);
        this.#calcBounds();
        this.backgroundPressedCoordinate = Point.from(this.mouse);
      }
      if (this.backgroundPressed && !this.mouse.buttonDown) {
        //drag ended.
        this.backgroundPressed = false;
        this.backgroundPressedCoordinate = null;
      }
      else if (!this.backgroundPressed && this.mouse.buttonDown) {
        //initiated drag on background..        
        this.backgroundPressed = true;
        this.backgroundPressedCoordinate = Point.from(this.mouse);
      }
    }
    else {
      if (this.backgroundPressed) {
        this.backgroundPressed = false;
        this.backgroundPressedCoordinate = null;
      }
    }
  }
  //Keep this as an arrow function or you will lose reference to "this".
  handleContextMenu = (event) => {
    event.preventDefault();
    return false;
  }

  //Keep this as an arrow function or you will lose reference to "this".
  handleMouseMove = (event) => {
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;
  };
  //Keep this as an arrow function or you will lose reference to "this".
  handleMouseDown = (event) => {
    if (event.button === 0) {
      this.mouse.buttonDown = true;
    } else if (event.button === 2) {
      event.preventDefault();
      return false;
    }
  };
  //Keep this as an arrow function or you will lose reference to "this".
  handleMouseUp = (event) => {
    this.mouse.buttonDown = false;
  };
  //Keep this as an arrow function or you will lose reference to "this".
  handleWheel = (event) => {
    let zoomChange = this.camera.zoom * -Math.sign(event.deltaY) / this.zoomFactor;
    let oldZoom = this.camera.zoom;
    this.camera.zoom = this.camera.zoom + zoomChange;
    let xdiff = this.canvas.width / oldZoom - this.canvas.width / this.camera.zoom;
    let ydiff = this.canvas.height / oldZoom - this.canvas.height / this.camera.zoom;
    let xratio = (this.mouse.x - (this.canvas.width / 2)) / this.canvas.width;
    let yratio = (this.mouse.y - (this.canvas.height / 2)) / this.canvas.height;
    let xchange = xdiff * xratio;
    let ychange = ydiff * yratio;
    this.camera.x += xchange;
    this.camera.y += ychange;
    this.camera.zoom = Math.max(this.minimumZoom, this.camera.zoom);
    this.#calcBounds();
  }
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    if (!this.screenCenter) {
      this.screenCenter = new Point(window.innerWidth / 2, window.innerHeight / 2);
    } else {
      this.screenCenter.x = window.innerWidth / 2;
      this.screenCenter.y = window.innerHeight / 2;
    }
    this.#calcBounds();
  }
}