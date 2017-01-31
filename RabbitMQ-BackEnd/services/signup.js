var connectionpool = require('../config/connectionpool');
var bcrypt = require('bcryptjs');

function handle_request(msg, callback) {
	var res = {};
	console.log('handle request registeration');
	connectionpool.getConnection(function (err, connection) {
		if (err) {
			res.code = 401;
			res.value = "DB Connection Failure";
			callback(null, res);
			return;
		}
		var passwordHash = bcrypt.hashSync(msg.password, bcrypt.genSaltSync(10),null);
		console.log("passwordHash: "+passwordHash);

		var post = { firstname: msg.firstname, lastname: msg.lastname, email: msg.email, password: passwordHash, birthdate: msg.birthdate };
		var query = connection.query('INSERT INTO users SET ?', post, function (err, result) {
			if (err) {
				res.code = 401;
				res.value = "User name already exists.";
				callback(null, res);
				console.log(err);
				connectionpool.releaseSQLConnection(connection);
				return;
			}
			res.code = 200;
			res.value = "Successfully Registered";
			callback(null, res);
			connectionpool.releaseSQLConnection(connection);
		});
	});
};

exports.handle_request = handle_request;