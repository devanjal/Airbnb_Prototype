/**
 * Created by Nikhil-PC on 11/27/2016.
 */
var express = require('express');
var router = express.Router();
var mq_client = require('../rpc/client');

router.get('/', function (req, res, next) {
    var msg_payload = {userid: req.session.user.id};
    mq_client.make_request('allUserTripsQueue', msg_payload, function (err, result) {
        if(err){
            console.log("Error in fetching trip "+err);
        }else {
            if (result.code == 200){
                console.log("trip got successfully");
                console.log(result);
                res.send(result);
            }else {
                console.log("No trips");
            }
        }
    });
});

router.post('/create', function (req, res) {
    console.log(JSON.stringify(req.body));
    var msg_payload = {
        hostid: req.body.hostid,
        propertyid: req.body.propertyid,
        userid: req.session.user.id,
        quantity: req.body.quantity,
        fromdate: req.body.fromdate,
        todate: req.body.todate
    };

    mq_client.make_request('createTripQueue', msg_payload, function (err, result) {
        console.log(result);
        if(err){
            console.log("Error in inserting trip data"+ err);
        }else {
            if (result.code == 200) {
                console.log("trip created successfully");
                res.send(result);
            }else if(result.code === 401) {
                res.send(result);
                console.log("No trips to add");
            }
        }
    });
});

router.post('/edit', function (req, res) {
    console.log("INSIDE edit")
    var msg_payload = { tripid: req.body.tripid, quantity: req.body.quantity, fromdate: req.body.fromdate, todate: req.body.todate};

    mq_client.make_request('tripEditQueue', msg_payload, function (err, result) {
        console.log(JSON.stringify(msg_payload));
        if(err){
            console.log("Error in updating your trip "+err);
        }else {
            if (result.code == 200){
                console.log("trip updated successfully");
                res.send(result);
            }else {
                console.log("No trips to update");
            }
        }
    });
});

router.get('/getTripByUserId/:tripID', function (req, res) {
    // console.log(req.params.tripID);
    console.log(req.session.user.id);
    var msg_payload = {tripid: req.params.tripID, userid: req.session.user.id};
    mq_client.make_request('tripQueueByUserId', msg_payload, function (err, result) {
        // console.log(result);
        if(err){
            console.log("Error in fetching your trip "+err);
        }else {
            if (result.code == 200){
                console.log("trip fetched successfully");
                res.send(result);
            }else {
                console.log("No trips to fetch");
            }
        }
    });
});

router.get('/getTripsByHostId', function (req, res) {
    var msg_payload = {hostid: req.session.user.id};
    mq_client.make_request('tripQueueHost', msg_payload, function (err, result) {
        if(err){
            console.log("Error in updating your trip "+err);
        }else {
            if (result.code == 200){
                console.log("getTrips by host id");
                res.send(result);
            }else {
                console.log("No trips to update");
            }
        }
    });
});

router.post('/cancelTrip', function (req, res) {
    var msg_payload = {tripid: req.body.tripid};
    mq_client.make_request('cancelTripQueue', msg_payload, function (err, result) {
        if(err){
            console.log("Error in deleting the trip " +err);
        }else {
            if (result.code == 200){
                console.log("trip canceled successfully");
                res.send(result);
            }else {
                console.log("No trips to delete");
            }
        }
    });
});

module.exports = router;
