//import fontawesome pour les icones (https://fontawesome.com/)

import Canvas from '/draww/Canvas.js';
import Group  from '/draww/Group.js';
import Rect   from '/draww/Rect.js';
import Ellipse from '/draww/Ellipse.js';
import Circle from '/draww/Circle.js';
import Popup from '/draww/Popup.js';
import Task   from './Task.js';
import Pause  from "./Pause.js";
import RepeatingPicture from "./draww/RepeatingPicture.js";
import Table  from "./Table.js";
import {Player} from "./Player.js";


export default function game(name, language, password, socket)
{
    socket.on("can_play", load_save => {

        /* ===== <DICTIONARY> ===== */

        window.position = ""

        window.dictionary = []
        dictionary["english"] = []
        dictionary["french"] = []

        dictionary["english"]["screen"] = []
        dictionary["french"] ["screen"] = []

        dictionary["english"]["screen_title"] = "Your tasks :"
        dictionary["french"] ["screen_title"] = "Vos missions :"

        dictionary["english"]["tasks_titles"] = [
            "Tutorial",
            "Move !",
            "Find the door",
            "Come in"
        ]

        dictionary["french"] ["tasks_titles"] = [
            "Tutoriel",
            "Bouge !",
            "Trouve la porte",
            "Entre"
        ]

        dictionary["english"]["tasks_descriptions"] = [
            "Complete every task to finish the tutorial.",
            "Move your character around using ZQSD or the arrow keys.",
            "Find the door to enter the house.",
            "Get in the house"
        ]

        dictionary["french"] ["tasks_descriptions"] = [
            "Complète toutes les missions pour finir le tutoriel.",
            "Bouge ton personnage avec ZQSD ou avec les flèches.",
            "Trouve la porte pour entrer dans la maison.",
            "Va dans la maison."
        ]

        dictionary["english"]["error"] = [
            "Error",
            "Someone logged in with your account, you will therefore be disconnected here.",
            "Save",
            "Exit"
        ]

        dictionary["french"] ["error"] = [
            "Erreur",
            "Quelqu'un s'est connecté avec votre compte, vous allez donc être déconnecté ici.",
            "Sauvegarder",
            "Quitter"
        ]

        /* ===== </DICTIONARY> ===== */

        window.width = 2100
        window.height = 2000
        window.additionnal_height = 0
        window.additionnal_width = 0;

        window.canvas = new Canvas(width, height)

        let wall_size = 40

        window.key_left = false;
        window.key_up = false;
        window.key_right = false;
        window.key_down = false;
        window.shift = false;

        window.last_key = "down"

        window.popup_tasks_displayed = false;


        /* ===== <MAP> ===== */
        eval(`create_map_${load_save === "no save" ? "outside" : load_save.lieu}()`)
        /* ===== </MAP> ===== */


        let player = new Player(500, 500, 1.6)//new Group(500, 500);


        canvas.appendShape(player)


        player.x = plan.outside.entry_path.x + plan.outside.entry_path.first_rect.width/2 - player.width/2 + plan.outside.entry_path.first_rect.x
        window.x = player.x - (window.innerWidth/2 - player.width/2)
        window.y = player.y - (window.innerHeight / 2 + player.height / 2)



        /* ===== <SCREEN> ===== */

        let screen = new Group(10, 10);
        canvas.appendShape(screen)
        let outer_screen = new Rect(0, 0, "#FFFFFF44",350, 225)
        outer_screen.div.style.borderRadius = "10px"
        screen.appendShape(outer_screen)

        screen.div.addEventListener("click", open_tasks)
        screen.div.style.cursor = "pointer"
        let username = new Rect(5, 5, "transparent", outer_screen.width - 10, outer_screen.height / 4)
        username.div.innerText = name;
        screen.appendShape(username)
        document.body.style.fontFamily = "Courier New"

        document.body.style.fontSize = outer_screen.height / 8 + "px"
        let displayed_tasks = []
        let tasks = new Group(5, outer_screen.height / 4);
        let task_title = new Rect(0, 0, "transparent", outer_screen.width - 10, outer_screen.height / 4);
        task_title.text = dictionary[language]["screen_title"]
        task_title.div.style.whiteSpace = "nowrap"
        task_title.div.style.overflow = "hidden"
        task_title.div.style.textOverflow = "ellipsis"
        screen.appendShape(tasks)

        tasks.appendShape(task_title)

        displayed_tasks[0] = eval(`create_task_${load_save === "no save" ? 1 : load_save.task_0.id+1}()`);

        displayed_tasks[1] = eval(`create_task_${load_save === "no save" ? 2 : load_save.task_1.id+1}()`);

        if (load_save !== "no save"){
            let code;
            if (load_save.task_0.code !== "") {
                code = displayed_tasks[0].useful_code;
                displayed_tasks[0].useful_code = new Function(load_save.task_0.code);
                displayed_tasks[0].useful_code();
                displayed_tasks[0].useful_code = code;
            }

            displayed_tasks[0].completed = load_save.task_0.completed;
            displayed_tasks[0].number_reached = load_save.task_0.number_reached;


            if (load_save.task_1.code !== "") {
                code = displayed_tasks[1].useful_code;
                displayed_tasks[1].useful_code = new Function(load_save.task_1.code);
                displayed_tasks[1].useful_code();
                displayed_tasks[1].useful_code = code;
            }

            displayed_tasks[1].completed = load_save.task_1.completed;
            displayed_tasks[1].number_reached = load_save.task_1.number_reached;
        }


        tasks.appendShapes(displayed_tasks)


        /* ===== </SCREEN> ===== */

        /* ===== PAUSE ===== */

        let pause_width = 50;
        let pause_height = 50;
        let pause_button = new Group(window.innerWidth - pause_width - 10, 10)
        pause_button.appendShape(new Circle(0, 0, "#BBBBBB", pause_width))
        pause_button.appendShape(new Rect(pause_width/7*2, pause_width/6*1.5, "#555555", pause_width/7, pause_width/2))
        pause_button.appendShape(new Rect(pause_width/7*4, pause_width/6*1.5, "#555555", pause_width/7, pause_width/2))
        canvas.appendShape(pause_button)
        pause_button.width = pause_width;
        pause_button.height = pause_height;
        pause_button.div.style.cursor = "pointer"
        pause_button.div.onclick = pause
        pause_button.width = pause_width;

        /* ===== PAUSE ===== */


        if (load_save !== "no save"){
            player.x = load_save.player_x
            player.y = load_save.player_y
            window.x = load_save.window_x
            window.y = load_save.window_y
            player.rotate(load_save.player_orientation)

            //todo objects
        }

        window.black_filter = new Rect(0, 0, "black", width*2, height*2);
        black_filter.div.style.opacity = "0";
        canvas.appendShape(black_filter);
        black_filter.visible = false;

        /*
         * Everything created to animate the player and the canvas
         */
        {
            player.grow_1 = 1;
            player.grow_2 = -1

            player.move = false;

            window.i = 0;

            function to_animate() {
                if (position === "outside" && change_map_outside_to_hall())return;
                let vitesse = 4;
                if (window.shift) vitesse *= 2;
                player.move = key_up || key_left || key_down || key_right;
                if (player.move) {
                    let distance_x = 0, distance_y = 0, can_move = false, can_go_right = false, can_go_left = false;
                    if (position === "outside") {
                        let below_canvas = canvas.height - 2 * vitesse - wall_size - player.height
                        can_move     = ( player.y >= below_canvas && player.x >= door.x && player.x + player.width <= door.x + door.width)
                        can_go_right = ( player.y >= below_canvas && player.x + player.width <= door.x + door.width - wall_size)
                        can_go_left  = ( player.y >= below_canvas && player.x > door.x + wall_size)
                    }
                    if (key_up) {
                        if (window.last_key === "up" || window.last_key === "") {
                            player.rotate(180);
                        }
                        if ((player.y >= vitesse + wall_size && !(key_left ^ key_right)) || can_move) {
                            player.y -= vitesse
                            distance_y -= vitesse
                        }
                        else {
                            let v = Math.sqrt(vitesse**2 / 2);
                            if ((player.y >= v + wall_size && (key_left ^ key_right) )|| can_move) {
                                player.y -= v;
                                distance_y -= v;
                            }
                        }
                    }
                    if (key_down) {
                        if (window.last_key === "down" || window.last_key === "") {
                            player.rotate(0);
                        }
                        if ((player.y <= canvas.height - vitesse - wall_size - player.height && !(key_left ^ key_right) )|| can_move) {
                            player.y += vitesse
                            distance_y += vitesse
                        }
                        else {
                            let v = Math.sqrt(vitesse**2 / 2);
                            if ((player.y <= canvas.height - v - wall_size - player.height && (key_left ^ key_right) )|| can_move) {
                                player.y += v;
                                distance_y += v;
                            }
                        }
                    }
                    if (key_right) {
                        if (window.last_key === "right" || window.last_key === "") {
                            player.rotate(270)
                        }
                        if ((player.x <= canvas.width - (vitesse + wall_size + player.height) && !(key_up ^ key_down)) || can_go_right) {
                            if (position === "outside" && player.y >= canvas.height -2 * vitesse - wall_size - player.height && can_go_right){
                                player.x += vitesse
                                distance_x += vitesse
                            }
                            else if (player.y <= canvas.height - vitesse - wall_size - player.height){
                                player.x += vitesse
                                distance_x += vitesse
                            }
                        }
                        else{
                            let v = Math.sqrt(vitesse**2 / 2);
                            if (position === "outside" && player.y >= canvas.height -2 * v - wall_size - player.height && can_go_right){
                                player.x += v
                                distance_x += v
                            }
                            else if (player.y <= canvas.height - v - wall_size - player.height){
                                player.x += v
                                distance_x += v
                            }
                        }
                    }
                    if (key_left) {
                        if (window.last_key === "left" || window.last_key === "") {
                            player.rotate(90)
                        }
                        if ((player.x >= vitesse + wall_size && !(key_up ^ key_down) )|| can_go_left) {
                            if (position === "outside" && player.y >= canvas.height -2 * vitesse - wall_size - player.height && can_go_left) {
                                player.x -= vitesse
                                distance_x -= vitesse
                            }
                            else if (player.y <= canvas.height - vitesse - wall_size - player.height){
                                player.x -= vitesse
                                distance_x -= vitesse
                            }
                        }
                        else {
                            let v = Math.sqrt(vitesse ** 2 / 2)
                            if (position === "outside" && player.y >= canvas.height -2 * v - wall_size - player.height && can_go_left){
                                player.x -= v
                                distance_x -= v
                            }
                            else if (player.y <= canvas.height - v - wall_size - player.height){
                                player.x -= v
                                distance_x -= v
                            }
                        }
                    }
                    let touche = player.head.touch(window.touch[window.position]["static"], 5)
                    if (touche[0]) {
                        player.x -= distance_x;
                        player.y -= distance_y;
                    }

                    touche = player.head.touch(window.touch[window.position]["moveable"], 5);
                    if (touche[0]){
                        /*Si le joueur a touché un objet mobile*/

                        for (let i = 1; i < touche.length; i++){
                            touche[i].x += distance_x
                            touche[i].y += distance_y
                        }

                    }
                }
                window.x = player.x - (window.innerWidth/2 - player.width/2)
                window.y = player.y - (window.innerHeight / 2 + player.height / 2)
                if ((window.y + window.innerHeight) < height + additionnal_height) {
                    window.scroll({
                        top: window.y
                    })
                }else{
                    scroll({
                        top: height + additionnal_height - window.innerHeight
                    })
                }
                if (window.x + window.innerWidth < width + additionnal_width){
                    window.scroll({
                        left: window.x
                    })
                }else {
                    scroll({
                        left: width + additionnal_width - innerWidth
                    })
                }

                screen.x = window.pageXOffset + 10;
                screen.y = window.pageYOffset + 10;

                pause_button.x = window.pageXOffset + window.innerWidth - 10 - pause_button.width;
                pause_button.y = window.pageYOffset + 10;

                if (window.i % 8 === 0) {
                    player.grow_1 *= -1;
                    player.grow_2 *= -1;
                }

                if (player.move) {
                    player.left_arm.height += 2 * player.grow_1 * (shift + 1);
                    player.right_arm.height += 2 * player.grow_2 * (shift + 1);
                    player.left_foot.y += player.grow_2 * (shift + 1);
                    player.right_foot.y += player.grow_1 * (shift + 1);
                    window.i += ((window.i % 2 === 0 && shift) ? 2 : 1)
                } else {
                    player.left_arm.height = 20 * player.change_size;
                    player.right_arm.height = 20 * player.change_size;
                    player.left_foot.y = 35 * player.change_size
                    player.right_foot.y = 35 * player.change_size
                    window.i -= window.i % 8 + 4
                }

                if (window.i % Math.floor(Math.random() * 100) === 0) {
                    player.right_eye.visible = false;
                    player.left_eye.visible = false;
                } else {
                    player.right_eye.visible = true;
                    player.left_eye.visible = true;
                }
                if (typeof displayed_tasks[0] === "object")
                    displayed_tasks[0].function_to_complete()
                if (typeof displayed_tasks[1] === "object")
                    displayed_tasks[1].function_to_complete()
            }

            canvas.function_to_animate = to_animate;
            canvas.fps = 25;

            document.onkeydown = e =>{keyDown(e);};
            document.onkeyup = e => {keyUp(e);}

            function keyDown(e) {
                if (e.code === "KeyW" || e.code === "ArrowUp") {
                    window.key_up = true;
                    window.last_key = "up"
                } else if (e.code === "KeyA" || e.code === "ArrowLeft") {
                    window.key_left = true;
                    window.last_key = "left"
                } else if (e.code === "KeyS" || e.code === "ArrowDown") {
                    window.key_down = true;
                    window.last_key = "down"
                } else if (e.code === "KeyD" || e.code === "ArrowRight") {
                    window.key_right = true;
                    window.last_key = "right"
                }else if (e.code === "ShiftLeft"){
                    window.shift = true;
                }
            }

            function keyUp(e) {
                if (window.popup_tasks_displayed) {
                    return
                }
                if (e.code === "KeyW" || e.code === "ArrowUp") {
                    window.key_up = false;
                    window.last_key = (window.last_key === "up" ? "" : window.last_key)
                } else if (e.code === "KeyA" || e.code === "ArrowLeft") {
                    window.key_left = false;
                    window.last_key = (window.last_key === "left" ? "" : window.last_key)
                } else if (e.code === "KeyS" || e.code === "ArrowDown") {
                    window.key_down = false;
                    window.last_key = (window.last_key === "down" ? "" : window.last_key)
                } else if (e.code === "KeyD" || e.code === "ArrowRight") {
                    window.key_right = false;
                    window.last_key = (window.last_key === "right" ? "" : window.last_key)
                }else if (e.code === "ShiftLeft"){
                    window.shift = false;
                }
            }

            window.onresize = function () {
                outer_screen.width = window.innerWidth / 6
                outer_screen.height = window.innerHeight / 5
                username.width = outer_screen.width - 10
                username.height = outer_screen.height / 4
                document.body.style.fontSize = outer_screen.height / 8 + "px";
                if (typeof displayed_tasks[0] === "object") {
                    displayed_tasks[0].width = outer_screen.width - 10;
                    displayed_tasks[0].height = outer_screen.height / 4
                    displayed_tasks[0].y = outer_screen.height / 4;
                }
                if (typeof displayed_tasks[1] === "object") {
                    displayed_tasks[1].width = outer_screen.width - 10;
                    displayed_tasks[1].height = outer_screen.height / 4
                    displayed_tasks[1].y = outer_screen.height / 2;
                }
                tasks.y = outer_screen.height / 4
                task_title.width = outer_screen.width - 10
                task_title.height = outer_screen.height / 4
            }
        }

        function open_tasks() {
            if (!window.popup_tasks_displayed) {
                window.popup_tasks_displayed = true;
                canvas.animated = false;
                let popup = new Popup(window.innerWidth / 3, window.innerHeight / 5 * 4, "", "", "green")
                popup._close.div.addEventListener("click", function () {
                    window.popup_tasks_displayed = false;
                    canvas.animated = true
                })
                canvas.appendShape(popup)


                let popup_title = new Rect(10 + popup._popup.border_width, 50, "transparent", popup.width - 20, (popup.height - 100) / 7)
                popup_title.text = task_title.text;
                popup_title.div.style.textAlign = "center"
                popup_title.div.style.textDecorationLine = "underline"

                popup_title.div.style.fontSize = "2em";
                popup.div.style.fontFamily = "cursive"

                let popup_task_1 = new Group(10 + popup._popup.border_width, (popup.height - 100) / 3)

                let popup_task_1_title = new Rect(0, 0, "transparent", (popup.width - 20) / 4, (popup.height - 100) / 3)
                popup_task_1_title.div.innerHTML = displayed_tasks[0].title + "\n<p style='border: solid 1px black'>" + displayed_tasks[0].number_reached + "/" + displayed_tasks[0].number_to_reach + "</p>"
                popup_task_1_title.div.style.textDecorationLine = "underline"
                popup_task_1.div.style.textAlign = "center"
                let popup_task_1_description = new Rect((popup.width - 20) / 4, 0, "transparent", (popup.width - 20) / 4 * 3, (popup.height - 100) / 3)
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

        function create_task_1(){ /*Complete 3 tasks (tutorial)*/
            let task =  new Task(0, outer_screen.height / 4, dictionary[language]["tasks_titles"][0], dictionary[language]["tasks_descriptions"][0], 3, outer_screen.width - 10, outer_screen.height / 4, 0);
            task.function_to_complete = function () {
                if (this.completed) {
                    while (canvas.shapes[i] !== this && i < canvas.shapes.length) {
                        i++
                    }
                    canvas.shapes.splice(i, 1)
                    this._div.remove();
                }
            }
            return task;
        }

        function create_task_2(){ /*Move around*/
            let task = new Task(0, outer_screen.height / 2, dictionary[language]["tasks_titles"][1], dictionary[language]["tasks_descriptions"][1], 4, outer_screen.width - 10, outer_screen.height / 4, 1);
            task.tab_to_complete = new Array(4).fill(false)
            task.function_to_complete = function () {
                this.tab_to_complete[0] = this.tab_to_complete[0] || window.key_up
                this.tab_to_complete[1] = this.tab_to_complete[1] || window.key_right
                this.tab_to_complete[2] = this.tab_to_complete[2] || window.key_down
                this.tab_to_complete[3] = this.tab_to_complete[3] || window.key_left
                let nb = 0
                for (let i = 0; i < 4; i++) {
                    nb += this.tab_to_complete[i]; // true = +1, false = +0
                }
                this.number_reached = nb
                if (this.completed) {
                    displayed_tasks[0].number_reached = 1
                    displayed_tasks[1] = create_task_3()
                    tasks.appendShape(displayed_tasks[1])
                    this.div.remove()
                    let i = 0;
                    while (canvas.shapes[i] !== this && i < canvas.shapes.length) {
                        i++
                    }
                    if (canvas.shapes[i] === this)
                        canvas.shapes.splice(i, 1)
                }
            }
            task.useful_code = function (){
                return  "this.tab_to_complete = [" + this.tab_to_complete + "]\n";
            };
            return task;
        }

        function create_task_3() {
            let task = new Task(0, outer_screen.height / 2, dictionary[language]["tasks_titles"][2], dictionary[language]["tasks_descriptions"][2], 1, outer_screen.width - 10, outer_screen.height / 4, 2);
            task.function_to_complete = function (){
                if (door?.is_open){
                    this.number_reached = 1;
                    displayed_tasks[0].number_reached ++;
                    displayed_tasks[1] = create_task_4()
                    tasks.appendShape(displayed_tasks[1]);
                    this.div.remove()
                    let i = 0;
                    while (canvas.shapes[i] !== this && i < canvas.shapes.length) {
                        i++
                    }
                    if (canvas.shapes[i] === this)
                        canvas.shapes.splice(i, 1)
                }
            }
            return task;
        }
        function create_task_4(){
            let task = new Task(0, outer_screen.height / 2, dictionary[language]["tasks_titles"][3], dictionary[language]["tasks_descriptions"][3], 1, outer_screen.width - 10, outer_screen.height / 4, 3) //todo task enter the house, then finish the tutorial task
            task.function_to_complete = function (){
                if (position !== "outside"){
                    this.number_reached = 1;
                    this.completed = true;
                    displayed_tasks[0].number_reached ++;
                    let i = 0;
                    while (canvas.shapes[i] !== this && i < canvas.shapes.length) {
                        i++
                    }
                    if (canvas.shapes[i] === this)
                        canvas.shapes.splice(i, 1)
                    this.div.remove()
                    //todo create next task
                }
            }
            return task;
        }

        function save (){
            let objects = {}
            let i = 0
            for (let obj in window.touch[position]["moveable"]){
                if (! window.touch[position]["moveable"].hasOwnProperty(obj)){continue}
                let object = window.touch[position]["moveable"][obj]
                objects["obj_"+i] = {
                    "id" : object.id,
                    "x" : object.x,
                    "y" : object.y,
                    "orientation" : object.rotation,
                    "width" : object.width,
                    "height" : object.height
                }
                i++
            }
            socket.emit("save", {
                "position"           : window.position,
                "window_x"           : window.x,
                "window_y"           : window.y,
                "player_x"           : player.x,
                "player_y"           : player.y,
                "player_orientation" : player.rotation,
                "tasks"              : {
                    "0" : {
                        "id" : displayed_tasks[0].id,
                        "name" : displayed_tasks[0].title,
                        "completed" : displayed_tasks[0].completed,
                        "number_reached" : displayed_tasks[0].number_reached,
                        "code" : typeof displayed_tasks[0].useful_code === "function" ? displayed_tasks[0].useful_code() : ""
                    },
                    "1" : {
                        "id" : displayed_tasks[1].id,
                        "name" : displayed_tasks[1].title,
                        "completed" : displayed_tasks[1].completed,
                        "number_reached" : displayed_tasks[1].number_reached,
                        "code" : typeof displayed_tasks[1].useful_code === "function" ? displayed_tasks[1].useful_code() : ""
                    }
                },
                "objects"            : objects,
                "username"           : name,
                "password"           : password,
            })
        }
        function pause()
        {
            let pause = new Pause()
            canvas.appendShape(pause);
            /* upload */
            pause.shapes[pause.shapes.length-2].div.onclick = function (){
                pause.shapes[pause.shapes.length-2].div.onclick = null;
                save();
            }
        }

        socket.on("disconnect_player", username => {
            if (username === name){
                socket.on("save_completed", function (){
                    location.reload()
                })
                canvas.animated = false;
                let p = new Popup(window.innerWidth/3*2, window.innerHeight/3*2, window.dictionary[language]["error"][0], window.dictionary[language]["error"][1], "red");
                let button_save = new Rect(window.innerWidth / 18, window.innerWidth / 3 * 0.75, "#003366", window.innerWidth / 6, window.innerHeight / 9);
                button_save.div.style.borderRadius = "20px";
                button_save.div.style.fontSize = window.innerHeight / 12 + "px";
                button_save.div.style.color = "white"
                button_save.div.style.textAlign = "center"
                button_save.text = dictionary[language]["error"][2]; //Save
                let button_exit = new Rect(window.innerWidth / 18 * 8, window.innerWidth / 3 * 0.75, "#003366", window.innerWidth / 6, window.innerHeight / 9);
                button_exit.div.style.borderRadius = "20px";
                button_exit.div.style.fontSize = window.innerHeight / 12 + "px";
                button_exit.div.style.color = "white"
                button_exit.div.style.textAlign = "center"
                button_exit.text = dictionary[language]["error"][3]; //Exit

                button_exit.div.style.cursor = "pointer";
                button_save.div.style.cursor = "pointer";

                p.appendShapes([button_exit, button_save])
                canvas.appendShape(p);

                button_save._div.onclick = save
                button_exit._div.onclick = function (){
                    location.reload();
                }
            }
        })

        function clear_map(){
            for (let i = 0; i < canvas.shapes.length; i++){
                let s = canvas.shapes[i];

                if (!(s instanceof Task)){
                    if (!screen.shapes.includes(s)){
                        if (s !== screen){
                            if (!player.shapes.includes(s) && !(s === player)){
                                if (!pause_button.shapes.includes(s) && s !== pause_button){
                                    if (s !== black_filter) {
                                        if (s !== carte){
                                            s.div.remove()
                                            canvas.shapes.slice(i, 1);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            for (let i = 0; i < carte.shapes.length; i++){
                let s = carte.shapes[i];

                s.div.remove()
                canvas.shapes.slice(i, 1);
            }
        }


        function create_house_walls_outside() {
            plan.house_walls = new Group(plan.outside.entry_path.x + plan.outside.entry_path.first_rect.x, height - wall_size);
            let wall_left = new RepeatingPicture(0, 0, "/images/Wall_black_Y.png", wall_size, additionnal_height + wall_size, "Y");
            let wall_right = new RepeatingPicture(plan.outside.entry_path.first_rect.width - wall_size, 0, "/images/Wall_black_Y.png", wall_size, additionnal_height + wall_size, "Y");

            plan.outside.rect_hide_inside = new Rect(0, wall_size, "black", plan.outside.entry_path.first_rect.width, additionnal_height);
            let black_rect_left = new Rect(0, height, "black", plan.house_walls.x, additionnal_height)
            let black_rect_right = new Rect(plan.house_walls.x + plan.outside.entry_path.first_rect.width, height, "black", plan.house_walls.x, additionnal_height)
            plan.house_walls.appendShapes([wall_left, wall_right, plan.outside.rect_hide_inside])

            window.carte.appendShapes([plan.house_walls, black_rect_left, black_rect_right])
        }

        function create_walls_outside() {
            create_house_walls_outside();
            let path_x = plan.outside.entry_path.x + plan.outside.entry_path.first_rect.x;
            let wall_bottom_left = new RepeatingPicture(0, height - wall_size, "/images/Wall_black_X.png", width - path_x - plan.outside.entry_path.first_rect.width, wall_size, "x");
            let wall_bottom_right = new RepeatingPicture(path_x + plan.outside.entry_path.first_rect.width, height - wall_size, "/images/Wall_black_X.png", width - path_x - plan.outside.entry_path.first_rect.width, wall_size, "x");
            let wall_top_left = new RepeatingPicture(0, 0, "/images/Wall_X.png", path_x, wall_size, "x");
            let wall_top_right = new RepeatingPicture(path_x + plan.outside.entry_path.first_rect.width, 0, "/images/Wall_X.png", width - path_x - plan.outside.entry_path.first_rect.width, wall_size, "x");
            let wall_left = new RepeatingPicture(0, 0, "/images/Wall_Y.png", wall_size, height, "y");

            let wall_right = new RepeatingPicture(width - wall_size, 0, "/images/Wall_Y.png", wall_size, height, "y");
            wall_right.rotate(180);
            window.carte.appendShapes([wall_top_left, wall_top_right, wall_bottom_left, wall_bottom_right, wall_left, wall_right])

            window.portal = new Rect(path_x, wall_size/3*2, "#000000", plan.outside.entry_path.first_rect.width, wall_size/3)
            let door_width = plan.outside.entry_path.first_rect.width/2;
            let door_left = new Rect(0, 0, "brown", door_width, wall_size)
            door_left.div.style.transformOrigin = "10% 50%"
            let door_right = new Rect(door_width,0 , "brown", door_width, wall_size)
            door_right.div.style.transformOrigin = "90% 50%"
            window.door = new Group(path_x, height - wall_size);
            door.width = door_width*2
            door.appendShapes([door_left, door_right])
            door.is_open = false;
            window.carte.appendShapes([portal, door])
            canvas.appendShape(door);

            door.moveX = open_door;

            function open_door(){
                plan.outside.rect_hide_inside.div.style.opacity = 100 - door.shapes[1].rotation + "%"
                if (player.x >= door.x && player.x <= door.x + door.width && player.y > door.y - 250){
                    if (door.shapes[0].rotation === -90) {
                        door.is_open = true;
                        return;
                    }
                    door.shapes[0].rotate(door.shapes[0].rotation - 5)
                    door.shapes[1].rotate(door.shapes[1].rotation + 5)
                }
                else{
                    if (door.shapes[0].rotation === 0) {
                        door.is_open = false;
                        return;
                    }
                    door.shapes[0].rotate(door.shapes[0].rotation + 5)
                    door.shapes[1].rotate(door.shapes[1].rotation - 5)
                }
            }
        }

        function create_map_outside() {
            window.additionnal_height = 300
            window.position = "outside"
            window.plan = {
                outside: {},
                house_walls: {},
                inside: {}
            }


            let grass = new RepeatingPicture(wall_size, wall_size, "/images/Grass.png", width - 2* wall_size, height - 2 * wall_size);
            window.carte = new Group(0, 0);
            canvas.appendShape(carte)
            window.carte.appendShape(grass);

            plan.outside.entry_path = new Group(width / 2 - 500, 0);
            carte.appendShape(plan.outside.entry_path);
            plan.outside.entry_path.first_rect = new Rect(375, 0, "#C2B280", 250, 2000);
            plan.outside.entry_path.path_around_fountain = new Circle(0, 400, "#C2B280", 1000)
            plan.outside.fountain = new Group(plan.outside.entry_path.path_around_fountain.width / 5, plan.outside.entry_path.path_around_fountain.y + plan.outside.entry_path.path_around_fountain.width / 5);
            plan.outside.fountain.wall = new Circle(0, 0, "#7B7167", plan.outside.entry_path.path_around_fountain.width / 5 * 3);
            plan.outside.fountain.water = new Circle(plan.outside.entry_path.path_around_fountain.width / 20, plan.outside.entry_path.path_around_fountain.width / 20, "#2389DA", plan.outside.entry_path.path_around_fountain.width / 5 * 2.5)
            plan.outside.fountain.water_animation = new Circle(plan.outside.entry_path.path_around_fountain.width / 5 * 1.5 - 15, plan.outside.entry_path.path_around_fountain.width / 5 * 1.5 - 15, "transparent", 30)
            plan.outside.fountain.water_animation.moveX = function () {
                if (!this.move) {
                    return;
                }
                if (this.width >= plan.outside.entry_path.path_around_fountain.width / 5 * 2.5) {
                    this.x = plan.outside.entry_path.path_around_fountain.width / 5 * 1.5 - 15 - this.border_width
                    this.width = 30
                    this.y = plan.outside.entry_path.path_around_fountain.width / 5 * 1.5 - 15 - this.border_width
                }
                this.width += 2
                this.x--
            }
            plan.outside.fountain.water_animation.moveY = function () {
                if (!this.move) return
                this.y--
            }
            plan.outside.fountain.water_animation_2 = new Circle(plan.outside.entry_path.path_around_fountain.width / 5 * 1.5 - 15, plan.outside.entry_path.path_around_fountain.width / 5 * 1.5 - 15, "transparent", 30);
            plan.outside.fountain.water_animation_2.moveX = plan.outside.fountain.water_animation.moveX
            plan.outside.fountain.water_animation_2.moveY = plan.outside.fountain.water_animation.moveY
            plan.outside.fountain.water_animation_2.move = false;
            plan.outside.fountain.water_animation.border_style = "solid"
            plan.outside.fountain.water_animation.border_width = 2
            plan.outside.fountain.water_animation.border = "white";
            plan.outside.fountain.water_animation_2.border_style = "solid"
            plan.outside.fountain.water_animation_2.border_width = 2
            plan.outside.fountain.water_animation_2.border = "white";
            plan.outside.fountain.cross_x = new Ellipse(plan.outside.entry_path.path_around_fountain.width / 5, plan.outside.entry_path.path_around_fountain.width / 5 * 1.5 - plan.outside.entry_path.path_around_fountain.width / 40, "#7B7167", plan.outside.entry_path.path_around_fountain.width / 5, plan.outside.entry_path.path_around_fountain.width / 20)
            plan.outside.fountain.cross_y = new Ellipse(plan.outside.entry_path.path_around_fountain.width / 5 * 1.5 - plan.outside.entry_path.path_around_fountain.width / 40, plan.outside.entry_path.path_around_fountain.width / 5, "#7B7167", plan.outside.entry_path.path_around_fountain.width / 20, plan.outside.entry_path.path_around_fountain.width / 5)
            plan.outside.fountain.appendShapes([
                plan.outside.fountain.wall,
                plan.outside.fountain.water,
                plan.outside.fountain.water_animation,
                plan.outside.fountain.water_animation_2,
                plan.outside.fountain.cross_x,
                plan.outside.fountain.cross_y
            ]);
            plan.outside.fountain.moveY = function () {
                console.log("function called")
                if (this.water_animation.width >= plan.outside.entry_path.path_around_fountain.width / 4) {
                    this.water_animation_2.move = true;
                    this.moveY = function () {
                        plan.outside.fountain.water_animation.moveX()
                        plan.outside.fountain.water_animation.moveY()
                        plan.outside.fountain.water_animation_2.moveX()
                        plan.outside.fountain.water_animation_2.moveY()
                    }
                }
                plan.outside.fountain.water_animation.moveX()
                plan.outside.fountain.water_animation.moveY()
                plan.outside.fountain.water_animation_2.moveX()
                plan.outside.fountain.water_animation_2.moveY()
            }
            canvas.appendShape(plan.outside.fountain)



            plan.outside.entry_path.parquet = new RepeatingPicture(plan.outside.entry_path.first_rect.x, height, "/images/Parquet.png", plan.outside.entry_path.first_rect.width, additionnal_height);

            plan.outside.entry_path.red_carpet = new Rect(
                plan.outside.entry_path.first_rect.x + plan.outside.entry_path.first_rect.width/5 - 3,
                plan.outside.entry_path.path_around_fountain.y + plan.outside.entry_path.path_around_fountain.width,
                "#C32A2A",
                plan.outside.entry_path.first_rect.width/5 * 3 + 2,
                plan.outside.entry_path.first_rect.height - (plan.outside.entry_path.path_around_fountain.y + plan.outside.entry_path.path_around_fountain.width) - wall_size/2 + additionnal_height
            )
            plan.outside.entry_path.red_carpet_bottom = new Rect(
                plan.outside.entry_path.first_rect.x + plan.outside.entry_path.first_rect.width/5 - 3 ,
                plan.outside.entry_path.path_around_fountain.y + plan.outside.entry_path.path_around_fountain.width + 350,
                "#C32A2A",
                plan.outside.entry_path.first_rect.width/5 * 3 + 2,
                plan.outside.entry_path.first_rect.height - (plan.outside.entry_path.path_around_fountain.y + plan.outside.entry_path.path_around_fountain.width) - wall_size/2 - 50
            )

            {
                let carpet = plan.outside.entry_path.red_carpet;
                carpet.div.style.backgroundImage= "linear-gradient(to right, gold 33%, rgba(255,215,0,0) 0%)"
                carpet.div.style.backgroundPosition = "top";
                carpet.div.style.backgroundSize = "5px 10px";
                carpet.div.style.backgroundRepeat = "repeat-x";

                carpet.div.style.borderWidth = "0 3px"
                carpet.border_style = "solid"
                carpet.border = "#FFD700";
                carpet = plan.outside.entry_path.red_carpet_bottom;
                carpet.div.style.backgroundImage= "linear-gradient(to right, gold 33%, rgba(255,215,0,0) 0%)"
                carpet.div.style.backgroundPosition = "bottom";
                carpet.div.style.backgroundSize = "5px 10px";
                carpet.div.style.backgroundRepeat = "repeat-x";

                carpet.div.style.borderWidth = "0 3px"
                carpet.border_style = "solid"
                carpet.border = "#FFD700";
            }
            plan.outside.entry_path.appendShapes([
                plan.outside.entry_path.first_rect,
                plan.outside.entry_path.path_around_fountain,
                plan.outside.fountain,
                plan.outside.entry_path.parquet,
                plan.outside.entry_path.red_carpet,
                plan.outside.entry_path.red_carpet_bottom
            ]);
            window.touch = []
            window.touch["outside"] = []
            window.touch["outside"]["moveable"] = []
            window.touch["outside"]["static"] = [plan.outside.fountain.wall];

            create_walls_outside();
        }

        function change_map_outside_to_hall(){
            if (window.position !== "outside")return false
            if (black_filter.div.className !== "" || black_filter.visible){return true}
            if (player.y > height + wall_size && !black_filter.visible){
                black_filter.visible = true;
                black_filter.div.style.display = "inline";

                black_filter.div.className = "appear";
                setTimeout(()=>{
                    clear_map();
                    create_map_hall();
                    black_filter.div.className = "disappear"
                    setTimeout(()=>{
                        black_filter.div.className = "";
                        window.position = "hall";
                        black_filter.visible = false
                    }, 1000)
                }, 1000)
            }
            return false;
        }


        function create_map_hall(){
            window.position = "hall";
            window.touch = []
            window.touch["hall"] = []
            window.touch["hall"]["moveable"] = []
            window.touch["hall"]["static"] = []

            player.x = 120;
            player.y = 120;

            let parquet = new RepeatingPicture(0, 0, "/images/Parquet.png", width, height);
            carte.appendShape(parquet);

            let table = new Table(500, 500, 300)
            carte.appendShape(table);

            window.touch["hall"]["moveable"] = [table.shapes[0]]

            create_walls_hall();
        }

        function create_walls_hall() {
            let wall_left = new RepeatingPicture(0, 0, "/images/Wall_black_Y.png", wall_size, height, "Y");
            let wall_right = new RepeatingPicture(width - wall_size, 0, "/images/Wall_black_Y.png", wall_size, height, "Y");
            let wall_top = new RepeatingPicture(0, 0, "/images/Wall_black_X.png", width, wall_size, "X");
            let wall_bottom = new RepeatingPicture(0, height - wall_size, "/images/Wall_black_X.png", width, wall_size, "X");
            carte.appendShapes([wall_left, wall_right, wall_top, wall_bottom]);
        }
    })
}