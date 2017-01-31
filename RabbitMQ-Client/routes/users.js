var express = require('express');
var router = express.Router();
var passport = require('passport');
var mq_client = require('../rpc/client');
var formidable = require('formidable');
var fs = require('fs');
var winston = require('winston');
//var logg=winston.add(winston.transports.File, { filename: 'profile.log' });
var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.File)({

			filename: 'profile.log',
			json: true,
			level: 'info'
		})
	]
});
router.get("/profile", function (req, res) {
	console.log("req: " + JSON.stringify(req.body));
	logger.info({user_id:req.session.user.id, page:'profile'});
	if (req.session.user) {
		var user_id = req.session.user.id;
		var msg_payload = { "id": user_id };
		mq_client.make_request('userInfo_queue', msg_payload, function (err, results) {
			if (err) {
				console.log(err);
				return;
			}
			console.log("inside make_request get user info");
			console.log(results);
			res.send(results);
			res.end();
		});
	} else {
		res.send({error:"notlogin"});
		res.end();
	}
});

router.post("/upload_profile_pic", function (req, res) {
	logger.info({user_id:req.session.user.id, page:'upload pic'});
	var form = new formidable.IncomingForm();
	form.uploadDir = "./public/images";
	form.parse(req, function (err, fields, files) {
		var profile_image = files.file;
		var payload = {};
		payload.hostid = req.session.user.id;
		console.log(profile_image.path.substring(7));
		payload.profile_image = profile_image.path.substring(7);

		mq_client.make_request('user_profile_image_queue', payload, function (err, results) {
			if (err) {
				console.log(err);
				return;
			}
			console.log("inside make_request get user info");
			console.log(results);
			results.src = profile_image.path.substring(7);
			res.send(results);
			res.end();
		});
	});
});

router.post("/update_profile", function (req, res) {
	console.log(JSON.stringify(req.body));
	var msg_payload = req.body;
	mq_client.make_request('updateUserProfile_queue', msg_payload, function (err, results) {
		if (err) {
			console.log(err);
			return;
		}
		console.log("inside make_request get user info");
		console.log(results);
		res.send(results);
		res.end();
	});
});

router.post('/register', function (req, res, next) {
	console.log(JSON.stringify(req.body));
	var dob = req.body.birthday_month + "/" + req.body.birthday_day + "/" + req.body.birthday_year;

	var msg_payload = { firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, password: req.body.password, birthdate: dob };

	mq_client.make_request('register_queue', msg_payload, function (err, results) {
		console.log(results);
		if (err) {
			console.log(err);
			return;
		}
		if (results.code == 200) {
			res.send({ 'status': "success" });
			res.end();
		}
		else if (results.code == 401) {
			res.send({ 'error': results.value });
			res.end();
		}
	});
});

router.post('/login', function (req, res, next) {
	console.log("inside /users/login req: " + JSON.stringify(req.body));
	passport.authenticate('login', function (err, user, info) {
		console.log(info);
		console.log(user);
		if (err) {
			console.log(err);
			res.send(err);
		}
		if (!user) {
			console.log("Invalid credentials");
			res.send({ error: info.value });
		} else {
			delete user.password;
			console.log("user info");
			console.log(user);
			req.session.user = user;
			// delete req.session.user;
			// , user: user 
			res.send({ status: "success"});
		}
	})(req, res, next);
});
router.get('/logout', function (req, res, next) {
	console.log("inside /users/logout req: " + JSON.stringify(req.body));
	mq_client.make_request('logout_queue', req.session.user, function (err, results) {
		console.log(results);
		if (err) {
			console.log(err);
			return;
		}
		if (results.code == 200) {
			delete req.session.user;
			console.log(req.session.user);
			res.send({ 'status': "success" });
			res.end();
		}
		else if (results.code == 401) {
			res.send({ 'error': results.value });
			res.end();
		}
		
	});
});
module.exports = router;
