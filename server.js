const io = require('socket.io')(3000, {
    cors:{
        origin: ["http://localhost:8080"],
        methods: ["GET", "POST"],
        credentials: true
    }
});

const sql = require('mysql2');
const hash = require('password-hash');

function connect(){
    return sql.createConnection({
        host: 'localhost',
        user: 'game',
        database: 'game',
        password: "game"
    })
}

io.on('connection', socket =>{
    console.log(socket.id)
    socket.on("msg", (msg) => {
        console.log(msg)
    })

    socket.on("save", obj => {
        let db = connect();
        db.query("select id from player where cast(username as varchar(255)) = ?LIMIT 1;", [obj.username], function (err, rows){
            if (err){
                console.error(err);
                io.to(socket.id).emit("error_on_save", {"name" : err.name, "id" : null});
            }
            else if (rows.length === 0){
                io.to(socket.id).emit("error_on_save", {"name" : "Account not found", "id" : null});
            }
            else{
                let id = rows[0].id;
                db.query("INSERT INTO save value(0, ?, ?, ?, ?, ?, ?, ?);", [id, obj.position, obj.window_x, obj.window_y, obj.player_x, obj.player_y, obj.player_orientation], function (err){
                    if (err){
                        console.error(err)
                        io.to(socket.id).emit("error_on_save", {"name" : err.name, "id" : null})
                    }
                    else {
                        db.query("select id from save where player = ? order by id desc limit 1;", [id], function (err, rows){
                            if (err){
                                console.error(err)
                                io.to(socket.id).emit("error_on_save", {"name" : err.name, "id" : null})
                            }
                            else{
                                let id = rows[0].id;
                                for (let t in obj.tasks){
                                    let task = obj.tasks[t]
                                    db.query("insert into tasks value(?, ?, ?, ?, ?, ?);", [task.id, task.name, id, task.completed, task.number_reached, task.code], function (err){
                                        if (err){
                                            console.error(err);
                                            io.to(socket.id).emit("error_on_save", {'name' : err.name, "id" : id})
                                        }
                                    })
                                }
                                for (let o in obj.objects){
                                    let object = obj.objects[o]
                                    db.query("insert into object value(?, ?, ?, ?, ?, ?, ?);", [object.id, object.x, object.y, object.orientation, object.width, object.height, id], function (err){
                                        if (err){
                                            console.error(err)
                                            io.to(socket.id).emit("error_on_save", {"name" : err.name, "id" : id});
                                        }
                                    })
                                }
                                io.to(socket.id).emit("save_completed", id)
                            }
                        })
                    }
                })
            }
        })
    })

    socket.on("login", object => {
        const db = connect()
        db.query("SELECT cast(password as varchar(255)) as password, id FROM player WHERE username = ?;", [object.user], function (err, result, fields){
            if (err === null && result.length === 0 ){
                io.to(socket.id).emit("new_player", object)
            }
            else if (err === null && !hash.verify(object.password, result[0].password)){
                io.to(socket.id).emit("wrong_password");
            }
            else if (err === null){
                console.log("successfully connected")
                io.to(socket.id).emit("play", {"username":object.user, "password" : object.password, "id" : result[0].id});
            }
            else{
                console.error(err)
            }
        })
    })

    socket.on("create_account", object => {
        const db = connect();
        db.query("INSERT INTO player VALUE(0, ?, ?, ?);", [object.user, hash.generate(object.password), false], function (err){
            if(err)
                console.error(err)
            else{
                db.query("SELECT id FROM player WHERE cast(username as varchar(255)) = ? limit 1;", [object.user], function (err, rows){
                    if (err){
                        console.error(err);
                        io.to(socket.id).emit("error_on_play", err.name)
                    }
                    else if (rows.length === 0){
                        io.to(socket.id).emit("error_on_play", "Account not found")
                    }
                    else {
                        io.to(socket.id).emit("play", {
                            "username": object.user,
                            "password": object.password,
                            "id": rows[0].id
                        });
                    }
                })
            }
        })
    })

    socket.on("player_connected", username => {
        let error_happened = false;
        let can_play_emitted = false;
        socket.broadcast.emit("disconnect_player", username);
        const db = connect();
        db.query("SELECT" +
            "       s.id as id," +
            "       s.lieu as lieu," +
            "       s.window_x as w_x," +
            "       s.window_y as w_y," +
            "       s.player_x as p_x," +
            "       s.player_y as p_y," +
            "       s.player_orientation as orientation " +
            "from save s" +
            "    inner join player p on s.player = p.id " +
            "where cast(p.username as varchar(255)) = ? " +
            "group by s.id " +
            "order by s.id desc limit 1;", [username], function (err, rows){
            if (err || rows.length === 0){
                console.error(err)
                error_happened = true
                io.to(socket.id).emit("can_play", "no save");
            }
            else {
                let r = rows[0]
                let id = r.id;
                let save = {
                    "lieu": r.lieu,
                    "window_x": r.w_x,
                    "window_y": r.w_y,
                    "player_x": r.p_x,
                    "player_y": r.p_y,
                    "player_orientation": r.orientation
                }
                r = null;
                db.query("SELECT" +
                    "       tasks.id as id," +
                    "       name as name," +
                    "       completed as comp," +
                    "       number_reached as nb, " +
                    "           useful_code as code " +
                    "from tasks" +
                    "    inner join save s on tasks.save = s.id" +
                    "    WHERE s.id = ?" +
                    "    GROUP BY tasks.id;",
                    [id], function (err, rows) {
                        if (err) {
                            console.error(err)
                            error_happened = true
                        }
                        if (rows.length !== 0) {
                            for (let i = 0; i < rows.length; i++) {
                                let r = rows[i];
                                save["task_" + i] = {
                                    "id": r.id,
                                    "name": r.name,
                                    "completed": r.comp,
                                    "number_reached": r.nb,
                                    "code": r.code
                                }
                            }
                        }
                        db.query("select" +
                            "    o.id as id," +
                            "    o.x as x," +
                            "    o.y as y," +
                            "    o.orientation as ori," +
                            "    o.width as wi," +
                            "    o.height as he " +
                            "from object o inner join save s on o.save = s.id " +
                            "where s.id = ? " +
                            "group by o.id, o.x, o.y, o.orientation, o.width, o.height;",
                            [id], function (err, rows) {
                                if (err) {
                                    console.error(err);
                                    error_happened = true;
                                }
                                else if (rows.length !== 0) {
                                    for (let i = 0; i < rows.length; i++) {
                                        let r = rows[i]
                                        save["object_" + i] = {
                                            "id": r.id,
                                            "x": r.x,
                                            "y": r.y,
                                            "orientation": r.ori,
                                            "width": r.wi,
                                            "height": r.he
                                        }
                                    }
                                }
                                if (!error_happened) io.to(socket.id).emit("can_play", save);
                                else io.to(socket.id).emit("can_play", "no save")
                                can_play_emitted = true;
                            })
                    })
            }
        })
    });
})

