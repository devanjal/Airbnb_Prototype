var connectionpool = require('../config/connectionpool');

var bcrypt = require('bcryptjs');

function handle_request(msg, callback) {
    console.log("inside login queue server");
    console.log(JSON.stringify(msg));
    var username = msg.username;
    var password = msg.password;
    var res = {};

    connectionpool.getConnection(function (err, connection) {
        // console.log("inside connection");
        if (err) {
            res.code = 401;
            res.value = "DB Connection Failure";
            callback(null, res);
            return;
        }

        var passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10),null);

        console.log("passwordHash: "+passwordHash);
        var query = connection.query("SELECT * FROM `users` WHERE `email` = ?", [username], function (err, rows) {
            console.log(rows);
            if (err) {
                console.log("Error in login ");
                console.log(err);
                res.code = 401;
                res.value = err.code;
                callback(null, res);
                connectionpool.releaseSQLConnection(connection);
            } else if (rows.length>0) {
                console.log("checking for password");
                console.log("password: "+rows[0].password);
                if (bcrypt.compareSync(password, rows[0].password)) {
                    console.log("Passwords match");
                    res.code = 200;
                    res.value = "Login Success";
                    res.user = rows[0];
                    connection.query(
                        'UPDATE users SET logintime = ? Where email = ?',
                        [new Date().toString(), username],
                        function (err, result) {
                            if (err)
                            {
                                console.log('unable to update login time');
                            }
                            connectionpool.releaseSQLConnection(connection);
                        });
                } else {
                    console.log("wrong password");
                    res.code = 401;
                    res.value = "Wrong password";
                    connectionpool.releaseSQLConnection(connection);
                }

                callback(null, res);
            }
            else {
                console.log("no user found");
                res.code = 401;
                res.value = 'Username does not exist.';
                callback(null, res);
                connectionpool.releaseSQLConnection(connection);
            }
        });
    });
}

function handle_logout(msg, callback) {
    var res = {};
    console.log('handle_logout');
    connectionpool.getConnection(function(err,connection){
        if(err){
            connectionpool.releaseSQLConnection(connection);
            console.log('Error connecting to Db');
            return;
        }
        connection.query(
            'UPDATE users SET logouttime = ? Where email = ?',
            [new Date().toString(), msg.email],
            function (err, result) {
                if (err)
                {
                    connectionpool.releaseSQLConnection(connection);
                    res.code = 401;
                    res.value = err.code;
                    callback(null, res);
                    return;
                }
                res.code = 200;
                callback(null, res);
                connectionpool.releaseSQLConnection(connection);
            }
        );
    });
}
exports.handle_request = handle_request;
exports.handle_logout = handle_logout;

