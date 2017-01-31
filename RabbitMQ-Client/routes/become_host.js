var express = require('express');
var router = express.Router();
var mq_client = require('../rpc/client');
var multer = require('multer');
var formidable = require('formidable');
var fs = require('fs');

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/images');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname/*file.fieldname + '-' + Date.now()*/);
    }
});
var upload = multer({ storage: storage }).array('userPhoto', 5);

router.post('/', function (req, res) {
    res.send('respond with a resource');
});

router.post('/step1', function (req, res) {
    console.log('become host');
    var payload = {};
    console.log(JSON.stringify(req.body));
    payload.hostid = req.session.user.id;
    payload.category = req.body.category;
    payload.quantity = parseInt(req.body.quantity);
    payload.address = req.body.address + "," + req.body.address2;
    payload.city = req.body.city;
    payload.state = req.body.state;
    payload.country = req.body.country;
    payload.zipcode = req.body.zip;
    payload.published = 'step1';

    mq_client.make_request('becomehost1', payload, function (err, results) {
        if (err) {
            return done(err);
        }
        else {
            if (results.code == 200) {
                req.session.property_id = results.property_id;
                res.send({ status: 'success' });
            }
            else {
                console.log("Invalid signup... record duplication");
                res.send({ status: 'error', error: "value updation failed" });
            }
        }
    });
});
router.post('/step2', function (req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = "./public/images";
    form.multiples = true;
    form.parse(req, function (err, fields, files) {
        console.log('fields: ');
        console.log(fields);

        console.log('files: ');
        console.log(files);

        if (err) {
            res.send({ error: "Error uploading file." });
            res.end();
        }
        var payload = {};
        payload.hostid = req.session.user.id;
        payload.propertyid = req.session.property_id;
        payload.title = fields.title;
        payload.description = fields.description;
        payload.filenames = [];
        if (files.file) {
            var property_images = files.file;

            if (Array.isArray(property_images)) {
                for (var index in property_images) {
                    console.log(property_images[index].name);
                    payload.filenames.push(property_images[index].path.substring(7));
                }
            } else {
                payload.filenames.push(property_images.path.substring(7));
            }
        }

        mq_client.make_request('becomehost2', payload, function (err, results) {
            if (err) {
                return done(err);
            }
            else {
                if (results.code == 200) {
                    console.log('response from server');
                    //to do redirect to some page
                    res.send({ status: 'success' });
                }
                else {
                    res.send({ status: 'error', error: "value updation failed" });
                }
            }
        });
    });

});
router.post('/step3', function (req, res) {
    var payload = {};
    console.log(JSON.stringify(req.body));
    payload.hostid = req.session.user.id;
    payload.propertyid = req.session.property_id;
    payload.bid_price = parseFloat(req.body.bid_price);
    payload.price = parseFloat(req.body.price);
    payload.availability_from = new Date(req.body.availability_from);
    payload.availability_to = new Date(req.body.availability_to);
    mq_client.make_request('becomehost3', payload, function (err, results) {
        if (err) {
            return done(err);
        }
        else {
            if (results.code == 200) {
                console.log('response from server');
                //to do redirect to some page
                res.send({ status: 'success' });
            }
            else {
                res.send({ status: 'error', error: "value updation failed" });
            }
        }
    });
});
router.post('/publish', function (req, res, next) {
    var payload = {};
    payload.propertyid = req.session.property_id;
    mq_client.make_request('publishproperty', payload, function (err, results) {
        if (err) {
            return done(err);
        }
        else {
            if (results.code == 200) {
                res.send({ status: 'success' });
            }
            else {
                res.send({ status: 'error', error: 'profile was not published' });
            }
        }
    });
});

module.exports = router;
