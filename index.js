let canvas = new Canvas(window.innerWidth, window.innerHeight)
//TODO add animation of the game

let login = new Group(window.innerWidth/3, window.innerHeight/3);
login._div.innerText = "Username"

canvas.appendShape(login)

login._div.style.borderRadius = "12px"
login._div.style.textAlign = "center"
login.border_style = "solid"
login.border_width = 2

login.border = "black"
login.width = window.innerWidth/3;

login.height = window.innerHeight/3;
login._div.style.fontSize = login.height / 15 + "px"

login._div.style.paddingTop = login.height / 25 + "px"


let username = new Textfield(login.width/5, login.height/5, "black", login.width/5 * 3,login.height/5)
username._div.style.borderRadius = "12px"
username._div.style.color = "white"
username._div.style.textAlign = "center"
username._div.style.fontSize = login.width / 20 + "px"

login.appendShape(username)


let jouer = new Rect(login.width/4, login.height / 5 * 3, "#003366", login.width/2, login.height / 4)
jouer._div.style.borderRadius = "12px"
jouer._div.style.fontSize = jouer.height /4 * 3 + "px"
jouer._div.innerText = "Play"
jouer.div.style.cursor = "pointer"
jouer._div.style.color = "white"
login.appendShape(jouer)
jouer._div.addEventListener('click', function (){
    let name = username._div;
    if (name.value.length < 2){
        canvas.appendShape(new BoxError("Please enter a Username.", window.innerWidth / 5, window.innerHeight / 5))
    }
    else
    {
        login.visible = false;
        login = null;
        canvas = undefined
        document.body.innerText = "";
        window.username = name.value;
        let s = document.createElement("script")
        s.src = "game.js";
        document.body.appendChild(s)
    }
})


function resize(){
    if (document.body.children[0].src === "game.js")
        return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    login.width = window.innerWidth/3;
    login.height = window.innerHeight/3;

    login.x = window.innerWidth/3;
    login.y = window.innerHeight/3;

    username._div.style.fontSize = login.width / 20 + "px"

    username.x = login.width/5;
    username.y = login.height/5;
    username.width = login.width/5 * 3;
    username.height = login.height/5

    login._div.style.fontSize = login.height / 15 + "px"

    jouer.x = login.width/4
    jouer.y = login.height/5*3

    jouer.width = login.width / 2
    jouer.height = login.height / 4
    jouer._div.style.fontSize = jouer.height /4 * 3 + "px"

}

window.onresize = resize