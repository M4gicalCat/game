import Popup from "/draww/Popup.js";
import Arrow from "/Arrow.js";
import Group from "/draww/Group.js";
import Circle from "/draww/Circle.js";

export default class Pause extends Popup{
    constructor() {
        super(window.innerWidth/5*2, window.innerHeight/5*2, "Pause", "", "#40B5AD");
        let upload = new Group(this.width/3 - window.innerWidth/40, this.height/2 - window.innerWidth/40);
        let download = new Group(2*this.width/3 - window.innerWidth/40, this.height/2 - window.innerWidth/40);
        upload.width = window.innerWidth/20
        upload.height = window.innerWidth/20
        download.width = window.innerWidth/20
        download.height = window.innerWidth/20
        upload.rotate(180)
        let upload_circle = new Circle(0, 0, "#BBBBBB", window.innerWidth/20)
        let upload_arrow = new Arrow(window.innerWidth/40 - window.innerWidth/50, window.innerWidth/200, "#555555", window.innerWidth/25, window.innerWidth/25)
        let download_circle = new Circle(0, 0, "#BBBBBB", window.innerWidth/20)
        let download_arrow = new Arrow(window.innerWidth/40 - window.innerWidth/50, window.innerWidth/200, "#555555", window.innerWidth/25, window.innerWidth/25)
        download.appendShapes([download_circle, download_arrow])
        upload.appendShapes([upload_circle, upload_arrow])
        this.appendShapes([upload, download])
    }
}

//todo : mettre plus de f°, (log out etc), et CHANGER LE LOOK BORDEL MÊME UN ENFANT DE 2 ANS L'AURAIT FAIT PLUS BEAU MERDE