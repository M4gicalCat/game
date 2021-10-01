import {default as RepeatingPicture} from '/draww/RepeatingPicture.js'

class Wall extends RepeatingPicture{
    constructor(x, y, width, height, axis) {
        super(x, y, "./images/Wall.png", width, height, axis);
    }
}