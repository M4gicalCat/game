import Group from "./draww/Group.js";
import Ellipse from "./draww/Ellipse.js";
import Circle from "./draww/Circle.js";

export class Player extends Group{
    constructor(x, y, change_size) {
        super(x, y);
        this.change_size = change_size;
        this.div.id = "player";

        this.width = 70 * change_size;
        this.height = 55 * change_size;
        this.div.style.transformOrigin = "50% 45.5%";

        this.left_foot        = new Ellipse(15 * change_size,    35 * change_size, "#000000", 15 * change_size, 20 * change_size);
        this.right_foot       = new Ellipse(40 * change_size,    35 * change_size, "#000000", 15 * change_size, 20 * change_size);
        this.left_arm         = new Ellipse(0,                   20 * change_size, "#0A266A", 7  * change_size, 20 * change_size);
        this.right_arm        = new Ellipse(63 * change_size,    20 * change_size, "#0A266A", 7  * change_size, 20 * change_size);
        this.head             = new Ellipse(5 * change_size,     0,                "#FFD49D", 60 * change_size, 50 * change_size);
        this.mouth            = new Ellipse(28.5 * change_size,  40 * change_size, "#000000", 12 * change_size, 3  * change_size);
        this.left_eye         = new Ellipse(22 * change_size,    32 * change_size, "#4afaaa", 7  * change_size, 4  * change_size);
        this.right_eye        = new Ellipse(41 * change_size,    32 * change_size, "#4afaaa", 7  * change_size, 4  * change_size);
        this.devant_casquette = new Ellipse(26 * change_size,    8 * change_size,  "#0A264A", 18 * change_size, 25 * change_size);
        this.casquette        = new Circle (21 * change_size,    0,                "#2A466A", 28 * change_size);
        this.left_eye. rotate(15 );
        this.right_eye.rotate(-15);

        this.appendShapes([
            this.left_foot,
            this.right_foot,
            this.left_arm,
            this.right_arm,
            this.head,
            this.mouth,
            this.left_eye,
            this.right_eye,
            this.devant_casquette,
            this.casquette
        ])
    }
}
