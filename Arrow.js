import Group from "./draww/Group.js";
import Rect from "./draww/Rect.js";
import Triangle from "./draww/Triangle.js";
export default class Arrow extends Group{
    constructor(x, y, color, width, height) {
        super(x, y);
        this._color = color;
        this._width = width;
        this._height = height;

        let rect = new Rect(width/3, 0, color, width/3, height/5*3);
        this.appendShape(rect);
        let triangle = new Triangle(0, height/5*3, color, width, height/5*2);
        triangle.rotate(180);
        this.appendShape(triangle);
    }
}
