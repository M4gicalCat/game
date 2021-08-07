class Wall extends Group{
    /**
     * displays a Wall of 40 * (40 * length)
     * @param x : number
     * the x position of the Wall
     * @param y : number
     * the y position of the Wall
     * @param length : number
     * the number of 40*40 blocks to create
     */
    constructor(x, y, length) {
        super(x, y);
        this._length = length
        for (let i = 0; i < length; i++){
            this.appendShape(new Picture(i*40, 0, 40, 40, "images/Wall.png"))
        }
    }

    get length(){
        return this._length;
    }
}