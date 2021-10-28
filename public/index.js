import Canvas from "../draww/Canvas.js";
import Picture from "../draww/Picture.js";
import Group from "../draww/Group.js";
import Rect from "../draww/Rect.js";
import TextField from "../draww/TextField.js";
import BoxError from "../draww/BoxError.js";
import game from "./game.js";
import {io} from "socket.io-client";
import Password from "../draww/Password";
import Popup from "../draww/Popup";
const socket = io('http://localhost:3000', { transports : ['websocket'] });

socket.on('connect', ()=>{

    let menu = {}
    function openFullscreen() {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().then(() => {});
        } else if (document.documentElement.webkitRequestFullscreen) { /* Safari */
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) { /* IE11 */
            document.documentElement.msRequestFullscreen();
        }
    }

    menu.canvas = new Canvas(window.innerWidth, window.innerHeight)
    menu.canvas._div.id = "canvas"
    //TODO add animation of the game

    let dictionary = []
    dictionary["english"] = []
    dictionary["french"] = []

    dictionary["english"]["index"] = ["Username", "Password", "Play", "Please enter a Username and a Password.", "Error"]
    dictionary["french"]["index"] = ["Pseudo", "Mot de passe", "Jouer", "Merci d'entrer un Pseudo et un Mot de passe.", "Erreur"]
    dictionary["english"]["login"] = ["New Player", "The Username doesn't yet exist.\nWould you like to create an account ?", "Yes", "No", "Creating an account", "Please confirm the Username and the Password.", "The Username or the Password don't match the last input. Please try again.", "Wrong Password"]
    dictionary["french"]["login"] = ["Nouveau Joueur", "Le Pseudo que vous avez rentré n'existe pas encore.\nSouhaiteriez vous créer un compte ?", "Oui", "Non", "Création d'un compte", "Merci de confirmer le Pseudo et le Mot de passe.", "Le Pseudo ou le Mot de passe ne sont pas les mêmes que ceux entrés précédemment, veuillez réessayer.", "Mauvais Mot de passe"]

    let language = "english";

    menu.nb_flags = 2
    menu.flags = new Group(window.innerWidth - window.innerWidth / 10 - 5 - (5 * menu.nb_flags), 10);
    menu.flag_en = new Picture(0, 0, window.innerWidth / 10 / menu.nb_flags, window.innerWidth / 10 / menu.nb_flags / 1.5, "./images/flag_en.webp");
    menu.flag_fr = new Picture(window.innerWidth / 10 / menu.nb_flags + 5, 0, window.innerWidth / 10 / menu.nb_flags, window.innerWidth / 10 / menu.nb_flags / 1.5, "./images/flag_fr.webp");
    menu.flags.appendShapes([menu.flag_en, menu.flag_fr]);
    menu.canvas.appendShape(menu.flags)

    menu.flag_en.div.onclick = function (){
        language = "english"
        change_language();
    }

    menu.flag_fr.div.onclick = function (){
        language = "french"
        change_language();
    }


    menu.login = new Group(window.innerWidth/3, window.innerHeight/3);
    menu.canvas.appendShape(menu.login)
    menu.canvas._div.id = "canvas";

    menu.login.width = window.innerWidth/3;
    menu.login.height = window.innerHeight/3;

    menu.login.div.style.borderRadius = "12px"
    menu.login._div.style.textAlign = "center"
    menu.login.border_style = "solid"
    menu.login.border_width = 2
    menu.login._div.style.fontSize = menu.login.height / 15 + "px"
    menu.login.border = "black"

    menu.username = new TextField(menu.login.width/5, menu.login.height/10, "black", menu.login.width/5 * 3,menu.login.height/5)
    menu.username.div.style.borderRadius = "12px"
    menu.username.div.style.color = "white"
    menu.username.div.style.textAlign = "center"
    menu.username.div.style.fontSize = menu.login.width / 20 + "px"
    menu.username.div.placeholder = dictionary[language]["index"][0];

    menu.password = new Password(menu.login.width/5, 2*menu.login.height/5, "black", menu.login.width/5 * 3,menu.login.height/5)
    menu.password.div.style.borderRadius = "12px"
    menu.password.div.style.color = "white"
    menu.password.div.style.textAlign = "center"
    menu.password.div.style.fontSize = menu.login.width / 20 + "px"
    menu.password.div.placeholder = dictionary[language]["index"][1]

    menu.login.appendShapes([menu.username, menu.password])
    menu.username.div.focus();


    menu.jouer = new Rect(menu.login.width/4, menu.login.height / 5 * 3.5, "#003366", menu.login.width/2, menu.login.height / 4)
    menu.jouer.div.style.borderRadius = "12px"
    menu.jouer.div.style.fontSize = menu.jouer.height /4 * 3 + "px"
    menu.jouer.div.innerText = dictionary[language]["index"][2]
    menu.jouer.div.style.cursor = "pointer"
    menu.jouer._div.style.color = "white"
    menu.login.appendShape(menu.jouer)
    menu.jouer._div.onclick= function (){
        let name = menu.username._div;
        if (name.value.length < 1 || menu.password._div.value.length < 1){
            menu.canvas.appendShape(new BoxError(dictionary[language]["index"][3], "", window.innerWidth / 5, window.innerHeight / 5))
        }
        else
        {
            socket.emit("login", {
                password : menu.password._div.value,
                user : name.value
            })
        }
    }
    document.onkeydown = (e => {
        if (e.code === "Enter" || e.code === "NumpadEnter") {
            if (menu.username._div.value.length !== 0 && menu.password._div.value.length !== 0)
                menu.jouer.div.click();
            else if (menu.username._div.value.length !== 0 && menu.password._div.value.length === 0)
                menu.password.div.focus();
        }
    })


    function resize(){
        menu.canvas.width = window.innerWidth
        menu.canvas.height = window.innerHeight

        menu.login.width = window.innerWidth/3;
        menu.login.height = window.innerHeight/3;
        menu.login.x = window.innerWidth/3;
        menu.login.y = window.innerHeight/3;
        menu.login.div.style.fontSize = menu.login.height / 15 + "px"

        menu.username._div.style.fontSize = menu.login.width / 20 + "px"
        menu.username.x = menu.login.width/5;
        menu.username.y = menu.login.height/10;
        menu.username.width = menu.login.width/5 * 3;
        menu.username.height = menu.login.height/5

        menu.password._div.style.fontSize = menu.login.width / 20 + "px"
        menu.password.x = menu.login.width/5;
        menu.password.y = menu.login.height/5*2;
        menu.password.width = menu.login.width/5 * 3;
        menu.password.height = menu.login.height/5

        menu.jouer.x = menu.login.width/4
        menu.jouer.y = menu.login.height/5*3.5
        menu.jouer.width = menu.login.width / 2
        menu.jouer.height = menu.login.height / 4
        menu.jouer._div.style.fontSize = menu.jouer.height /4 * 3 + "px"

        menu.flags.x = window.innerWidth - window.innerWidth / 10 - 5 - (5 * menu.nb_flags)
        menu.flags.y = 10

        menu.flag_en.width = window.innerWidth / 10 / menu.nb_flags
        menu.flag_en.height = window.innerWidth / 10 / menu.nb_flags / 1.5

        menu.flag_fr.x = window.innerWidth / 10 / menu.nb_flags + 5
        menu.flag_fr.width = window.innerWidth / 10 / menu.nb_flags
        menu.flag_fr.height = window.innerWidth / 10 / menu.nb_flags / 1.5
    }

    window.onresize = resize

    function change_language(){
        menu.jouer.text = dictionary[language]["index"][2]
        menu.username.div.placeholder = dictionary[language]["index"][0]
    }

    /* ===== game ===== */

    socket.on("play", object => {
        if (object.username === menu.username._div.value && object.password === menu.password._div.value){
            socket.emit("player_connected", object.username);
            openFullscreen()
//            document.getElementById("script_index")?.remove();
            document.getElementById("canvas")?.remove();
            game(object.username, language, object.password, socket);
        }
    })
    socket.on("new_player", object => {
        let pop = new Popup(window.innerWidth/2, window.innerHeight/2, dictionary[language]["login"][0] /*New Player*/, dictionary[language]['login'][1] /*The username doesn't etc.*/, "blue")
        let confirm_button = new Rect(pop.width/9, pop.height/3*2, "#003366", pop.width/3, pop.height/4)
        confirm_button.div.style.borderRadius = "20px";
        confirm_button.div.style.fontSize = pop.height / 5 + "px";
        confirm_button.div.style.color = "white"
        confirm_button.div.style.textAlign = "center"
        confirm_button.text = dictionary[language]["login"][2]; //Yes
        pop.appendShape(confirm_button)
        let affirm_button = new Rect(pop.width/9*2 + pop.width/3, pop.height/3*2, "#003366", pop.width/3, pop.height/4)
        affirm_button.div.style.borderRadius = "20px";
        affirm_button.div.style.fontSize = pop.height / 5 + "px";
        affirm_button.div.style.color = "white"
        affirm_button.div.style.textAlign = "center"
        affirm_button.text = dictionary[language]["login"][3]; //No
        pop.appendShape(affirm_button)
        menu.canvas.appendShape(pop);

        confirm_button.div.style.cursor = "pointer";
        affirm_button.div.style.cursor = "pointer";
        affirm_button._div.onclick = function (){
            pop._close._div.click();
        }
        confirm_button.div.onclick = function (){
            pop._close.div.click()
            window.popup_create_account = new Popup(window.innerWidth/4, window.innerHeight/3, dictionary[language]["login"][4], dictionary[language]["login"][5], "blue")
            menu.canvas.appendShape(window.popup_create_account);
            menu.username._div.value = ""
            menu.password._div.value = ""
            menu.jouer._div.onclick = function (){
                let name = menu.username._div;
                if (name.value.length < 1 || menu.password._div.value.length < 1){
                    menu.canvas.appendShape(new BoxError(dictionary[language]["index"][3], "",window.innerWidth / 5, window.innerHeight / 5))
                }
                else if (name.value !== object.user || menu.password._div.value !== object.password){
                    menu.canvas.appendShape(new Popup(window.innerWidth / 5, window.innerHeight / 5, dictionary[language]["index"][4], dictionary[language]["login"][6], "red"))
                }
                else
                {
                    socket.emit("create_account", {
                        user : name.value,
                        password : menu.password._div.value
                    })
                }
            }
        }
    })

    socket.on("wrong_password", function (){
        menu.canvas.appendShape(new BoxError(dictionary[language]["login"][7], "", window.innerWidth/3, window.innerHeight/3))
    })

})