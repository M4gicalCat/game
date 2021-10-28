import Circle from "/draww/Circle.js";
import Group from "/draww/Group.js";

export default class Table extends Group
{
    constructor(x, y, width) {
        super(x, y);
        let table = new Circle(0, 0,"#BA8C63",width)
        table.shadow = {
            width: 1,
            height: 1,
            spread: 2,
            blur: 2,
            color: "#9A6C43"
        }
        let glass = new Circle(width / 4, width/4, "green", width/15)
        let glass_2 = new Circle(width / 4 + width/60, width/4 + width/60, "darkgreen", width/30)
        this.appendShapes([table, glass, glass_2])
    }
}