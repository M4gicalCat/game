let width = 10000, height = 10000

canvas = new Canvas(width, height)
canvas.color = "blue"

window.key_left = false;
window.key_up = false;
window.key_right = false;
window.key_down = false;

window.last_key = "down"

window.x = 1000;
window.y = 1000;

window.popup_tasks_displayed = false;

let c = new Circle(500, 500, "yellow", 50);
canvas.appendShape(c)

/* ===== WALLS ===== */



/* ===== WALLS ===== */

/* ===== PLAYER ===== */

let player = new Group(500, 500);
player._div.id = "player";
player.change_size = 1.6;
player.width = 70 * player.change_size;
player.height = 55 * player.change_size;

player.x = window.innerWidth / 2 - player.width / 2  + 1000
player.y = window.innerHeight / 2 - player.height / 2 + 1000

canvas.appendShape(player)

let left_foot = new Ellipse(15 * player.change_size, 35 * player.change_size, "#000000", 15 * player.change_size, 20 * player.change_size)
player.appendShape(left_foot)
let right_foot = new Ellipse(40 * player.change_size, 35 * player.change_size, "#000000", 15 * player.change_size, 20 * player.change_size)
player.appendShape(right_foot)

let left_arm = new Ellipse(0, 20 * player.change_size, "#0A266A", 7 * player.change_size, 20 * player.change_size)
player.appendShape(left_arm)

let right_arm = new Ellipse(63 * player.change_size, 20 * player.change_size, "#0A266A", 7 * player.change_size, 20 * player.change_size)
player.appendShape(right_arm)

let head = new Ellipse(5 * player.change_size, 0, "#FFD49D", 60 * player.change_size, 50 * player.change_size)
player.appendShape(head);

let mouth = new Ellipse(28.5 * player.change_size, 40 * player.change_size, "#000000", 12 * player.change_size, 3 * player.change_size)
player.appendShape(mouth)

let left_eye = new Ellipse(22 * player.change_size, 32 * player.change_size, "#4afaaa", 7 * player.change_size, 4 * player.change_size)
player.appendShape(left_eye)
left_eye.rotate(15)
let right_eye = new Ellipse(41 * player.change_size, 32 * player.change_size, "#4afaaa", 7 * player.change_size, 4 * player.change_size)
player.appendShape(right_eye)
right_eye.rotate(-15)

let devant_casquette = new Ellipse(26 * player.change_size, 8 * player.change_size, "#0A264A", 18 * player.change_size, 25 * player.change_size)
player.appendShape(devant_casquette)
let casquette = new Circle(21 * player.change_size, 0, "#2A466A", 28 * player.change_size)
player.appendShape(casquette)

/* ===== PLAYER ===== */



/* ===== SCREEN ===== */

let screen = new Group(10, 10);
canvas.appendShape(screen)
let outer_screen = new Rect(0, 0, "#FFFFFF44", window.innerWidth / 6, window.innerHeight / 5)
outer_screen.div.style.borderRadius = "10px"
screen.appendShape(outer_screen)

screen.div.addEventListener("click", open_tasks)
screen.div.style.cursor = "pointer"
username = new Rect(5, 5, "transparent", outer_screen.width-10, outer_screen.height / 4)
username.div.innerText = window.username;
screen.appendShape(username)
document.body.style.fontFamily = "Courier New"

document.body.style.fontSize = outer_screen.height/8 + "px"
let displayed_tasks = []
let tasks = new Group(5, outer_screen.height/4);
let task_title = new Rect(0, 0, "transparent", outer_screen.width - 10, outer_screen.height / 4);
task_title.text = "Your tasks :"
task_title.div.style.whiteSpace = "nowrap"
task_title.div.style.overflow = "hidden"
task_title.div.style.textOverflow = "ellipsis"
screen.appendShape(tasks)

tasks.appendShape(task_title)
let task_tutorial = new Task(0, outer_screen.height / 4, "tutorial", "Complete every task to finish the tutorial.", 3, outer_screen.width-10, outer_screen.height/4);

tasks.appendShape(task_tutorial)
let task_move_around = new Task(0, outer_screen.height/2, "Move !", "Move your character around using ZQSD or the arrows.", 4, outer_screen.width-10, outer_screen.height/4)

tasks.appendShape(task_move_around)

displayed_tasks.push(task_tutorial, task_move_around)

/* ===== SCREEN ===== */

task_tutorial.function_to_complete = function (){
    if (this.completed){
        displayed_tasks[0] = create_task_after_tutorial();
    }
}

task_move_around.tab_to_complete = [false, false, false, false]

task_move_around.function_to_complete = function () {
    console.log("move!")
    this.tab_to_complete[0] = this.tab_to_complete[0] || window.key_up
    this.tab_to_complete[1] = this.tab_to_complete[1] || window.key_right
    this.tab_to_complete[2] = this.tab_to_complete[2] || window.key_down
    this.tab_to_complete[3] = this.tab_to_complete[3] || window.key_left
    let nb = 0
    for (let i = 0; i < this.tab_to_complete.length; i++){
        if(this.tab_to_complete[i]){nb++}
    }
    this.number_reached = nb
    if (this.completed){
        task_tutorial.number_reached = 1
        displayed_tasks[1] = create_second_tutorial_task()
    }
}


/*
 * Everything created to animate the player and the canvas
 */

{
    player.grow_1 = 1;
    player.grow_2 = -1

    player.move = false;

    window.i = 0;

    function to_animate() {
        player.move = key_up || key_left || key_down || key_right;

        if (key_up) {
            if (window.last_key === "up" || window.last_key === "") {
                player.rotate(180);
            }
            if (player.y >= 3) {
                player.y -= 3
                window.y -= 3
            }
        }
        if (key_down) {
            if (window.last_key === "down" || window.last_key === "") {
                player.rotate(0);
            }
            player.y += 3
            window.y += 3
        }
        if (key_right) {
            if (window.last_key === "right" || window.last_key === "") {
                player.rotate(270)
            }            player.x += 3
            window.x += 3
        }
        if (key_left) {
            if (window.last_key === "left" || window.last_key === "") {
                player.rotate(90)
            }
            if (player.x >= 3) {
                player.x -= 3
                window.x -= 3
            }
        }
        window.scroll({
            top: window.y,
            left: window.x
        })


        if (window.i % 8 === 0) {
            player.grow_1 *= -1;
            player.grow_2 *= -1;
        }

        if (player.move) {
            left_arm.height += 2 * player.grow_1;
            right_arm.height += 2 * player.grow_2;
            left_foot.y += player.grow_2;
            right_foot.y += player.grow_1;
            window.i++
        } else {
            left_arm.height = 20 * player.change_size;
            right_arm.height = 20 * player.change_size;
            left_foot.y = 35 * player.change_size
            right_foot.y = 35 * player.change_size
            window.i -= window.i % 8 + 4
        }

        if (window.i % Math.floor(Math.random() * 99) === 0) {
            right_eye.visible = false;
            left_eye.visible = false;
        } else {
            right_eye.visible = true;
            left_eye.visible = true;
        }
        if (window.x >= 0){
            screen.x = window.x + 10
        }
        if (window.y >= 0){
            screen.y = window.y + 10
        }
        if (typeof displayed_tasks[0] === "object")
        displayed_tasks[0].function_to_complete()
        if (typeof displayed_tasks[1] === "object")
        displayed_tasks[1].function_to_complete()
    }

    canvas.function_to_animate = to_animate;
    canvas.animated = true
    canvas.fps = 25;

    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);

    function keyDown(e) {
        if (window.popup_tasks_displayed){return}
        if (e.keyCode === 90 || e.keyCode === 38) {
            window.key_up = true;
            window.last_key = "up"
        } else if (e.keyCode === 81 || e.keyCode === 37) {
            window.key_left = true;
            window.last_key = "left"
        } else if (e.keyCode === 83 || e.keyCode === 40) {
            window.key_down = true;
            window.last_key = "down"
        } else if (e.keyCode === 68 || e.keyCode === 39) {
            window.key_right = true;
            window.last_key = "right"
        }
    }
    function keyUp(e) {
        if (window.popup_tasks_displayed){return}
        if (e.keyCode === 90 || e.keyCode === 38) {
            window.key_up = false;
            window.last_key = (window.last_key === "up" ? "" : window.last_key)
        } else if (e.keyCode === 81 || e.keyCode === 37) {
            window.key_left = false;
            window.last_key = (window.last_key === "left" ? "" : window.last_key)
        } else if (e.keyCode === 83 || e.keyCode === 40) {
            window.key_down = false;
            window.last_key = (window.last_key === "down" ? "" : window.last_key)
        } else if (e.keyCode === 68 || e.keyCode === 39) {
            window.key_right = false;
            window.last_key = (window.last_key === "right" ? "" : window.last_key)
        }
    }

    window.onresize = function () {
        outer_screen.width = window.innerWidth / 6
        outer_screen.height = window.innerHeight / 5
        username.width = outer_screen.width - 10
        username.height = outer_screen.height / 4
        document.body.style.fontSize = outer_screen.height/8 + "px";
        if (typeof displayed_tasks[0] === "object"){
            displayed_tasks[0].width = outer_screen.width-10;
            displayed_tasks[0].height = outer_screen.height/4
            displayed_tasks[0].y = outer_screen.height / 4;
        }
        if (typeof displayed_tasks[1] === "object"){
            displayed_tasks[1].width = outer_screen.width-10;
            displayed_tasks[1].height = outer_screen.height/4
            displayed_tasks[1].y = outer_screen.height / 2;
        }
        tasks.y = outer_screen.height/4
        task_title.width = outer_screen.width-10
        task_title.height = outer_screen.height/4
    }
}
function open_tasks()
{
    if (!window.popup_tasks_displayed)
    {
        window.popup_tasks_displayed = true;
        let popup = new Popup(window.innerWidth/3, window.innerHeight/5*4, "tasks", "", "green")
        popup._close.div.addEventListener("click", function (){window.popup_tasks_displayed = false})
        canvas.appendShape(popup)


        let popup_title = new Rect(10 + popup._popup.border_width, 50, "transparent", popup.width-20, (popup.height-100)/7)
        popup_title.text = task_title.text;
        popup_title.div.style.textAlign = "center"
        popup_title.div.style.textDecorationLine = "underline"

        popup_title.div.style.fontSize = "2em";
        popup.div.style.fontFamily = "cursive"

        let popup_task_1 = new Group(10 + popup._popup.border_width, (popup.height-100)/3)

        let popup_task_1_title = new Rect(0, 0, "transparent", (popup.width-20)/4, (popup.height-100)/3)
        popup_task_1_title.div.innerHTML = displayed_tasks[0].title + "\n<p style='border: solid 1px black'>" + displayed_tasks[0].number_reached + "/" + displayed_tasks[0].number_to_reach + "</p>"
        popup_task_1_title.div.style.textDecorationLine = "underline"
        popup_task_1.div.style.textAlign = "center"
        let popup_task_1_description = new Rect((popup.width-20)/4, 0, "transparent", (popup.width-20)/4*3, (popup.height-100)/3)
        popup_task_1_description.text = displayed_tasks[0].description
        popup_task_1.appendShapes([popup_task_1_title, popup_task_1_description])

        if (typeof displayed_tasks[1] === "object") {
            let popup_task_2 = new Group(10 + popup._popup.border_width, (popup.height - 100) / 3 * 2)

            let popup_task_2_title = new Rect(0, 0, "transparent", (popup.width - 20) / 4, (popup.height - 100) / 3)
            popup_task_2_title.div.innerHTML = displayed_tasks[1].title + "\n<p style='border: solid 1px black'>" + displayed_tasks[1].number_reached + "/" + displayed_tasks[1].number_to_reach + "</p>"
            popup_task_2_title.div.style.textDecorationLine = "underline"
            popup_task_2.div.style.textAlign = "center"
            let popup_task_2_description = new Rect((popup.width - 20) / 4, 0, "transparent", (popup.width - 20) / 4 * 3, (popup.height - 100) / 3)
            popup_task_2_description.text = displayed_tasks[1].description
            popup_task_2.appendShapes([popup_task_2_title, popup_task_2_description])

            popup.appendShapes([popup_title, popup_task_1, popup_task_2])
        }
    }
}

function create_second_tutorial_task(){
    task_move_around.visible = false

}

function create_task_after_tutorial(){

    /*return Task /!\ */
}