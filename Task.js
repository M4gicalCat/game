import Group from "./draww/Group.js";
import Rect from "./draww/Rect.js";

export default class Task extends Group{
    /**
     * @param x : number
     * The x position of the current Task
     * @param y : number
     * The y position of the current Task
     * @param title : string
     * The title of the current task, ex : MONEY !
     * @param description : string
     * The description of the task, ex : Collect 10 coins
     * @param number_to_reach : number
     * The number of things to do before the task is completed, ex : we need to collect 10 coins, so number_to_reach = 10
     * @param width : number
     * The width of the Task (display)
     * @param height : number
     * The height of the Task (display)
     * @param id : number
     * The id of the Task, used for the database
     */
    constructor(x, y, title, description, number_to_reach, width, height, id) {
        super(x, y);
        this.id = id
        this._completed = false;
        this._title = title;
        this._description = description;
        this._number_to_reach = number_to_reach;
        this._number_reached = 0;
        this._width = width;
        this._height = height;
        this._rect_title = new Rect(0, 0, "transparent", width/5*4, height)
        this.appendShape(this._rect_title)
        this._rect_title.text = title;
        this._rect_title.text_color = (this.completed ? "green" : "red")
        this._rect_title.div.style.textShadow = "1px 1px 5px black"
        this._useful_code = "";

        this._function_to_complete = function (){}

        this._rect_title.div.style.whiteSpace = "nowrap"
        this._rect_title.div.style.overflow = "hidden"
        this._rect_title.div.style.textOverflow = "ellipsis"

        this._rect_nb = new Rect(width/5*4, 0, 'transparent', width/5, height)
        this._rect_nb.text = this.number_reached + "/" + this._number_to_reach;
        this._rect_nb.text_color = (this.completed ? "green" : "red")
        this._rect_nb.div.style.textShadow = "1px 1px 5px black"
        this.appendShape(this._rect_nb)
        this._x = x;
        this._y = y;
    }

    get title() {
        return this._title;
    }

    /**
     * @param value : string
     */
    set title(value) {
        this._title = value;
    }

    get description() {
        return this._description;
    }

    /**
     * @param value : string
     */
    set description(value) {
        this._description = value;
    }

    get number_to_reach() {
        return this._number_to_reach;
    }

    /**
     * @param value : number
     */
    set number_to_reach(value) {
        this._number_to_reach = value;
    }

    get completed() {
        return this._completed;
    }

    /**
     * @param value : boolean
     */
    set completed(value) {
        this._completed = value;
    }

    get number_reached() {
        return this._number_reached;
    }

    /**
     * The number of things completed (must be below or equal to number_to_reach)
     * @param value : number
     */
    set number_reached(value) {
        if (value > this.number_to_reach || value < 0)
            return
        this._number_reached = value;
        if (value === this.number_to_reach){
            this.completed = true;
        }
        this._rect_nb.text = this.number_reached + "/" + this._number_to_reach;
    }

    get width() {
        return this._width;
    }

    set width(value) {
        this._width = value;
        this._rect_nb.width = value/5
        this._rect_title.width = value/5*4
        this._rect_nb.x = value/5*4
    }

    get height() {
        return this._height;
    }

    set height(value) {
        this._height = value;
        this._rect_title.height = value;
        this._rect_nb.height = value;
    }

    get function_to_complete(){
        return this._function_to_complete
    }

    set function_to_complete(value){
        this._function_to_complete = value;
    }

    set useful_code (/*function*/value){
        this._useful_code = value;
    }

    get useful_code(){
        return this._useful_code;
    }
}