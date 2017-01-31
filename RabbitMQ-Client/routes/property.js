var express = require('express');
var router = express.Router();
var mq_client = require('../rpc/client');
var winston = require('winston');
var logger=winston.add(winston.transports.File, { filename: 'property.log' });
router.post('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/searchbyuserid', function(req, res, next) {
    console.log(req.session.user.id);
    console.log('search by user id');
    var payload = {};
    //payload.userid = req.session.user.id;
    payload.userid = req.session.user.id;

    mq_client.make_request('searchbyuserid',payload, function(err,results){
        if(err){
            return done(err);
        }
        else
        {
            if(results.code == 200){
                res.send(results);
            }
            else {
                console.log("Invalid signup... record duplication");
                res.send({status:'error',error:"value updation failed"});
            }
        }
    });
});

router.post('/searchbypropertyid', function(req, res, next) {
    console.log('search by property id');

    var payload = {};
    //payload.userid = req.session.user.id;
    payload.propertyid = req.body.id;
    logger.info({propertyid:payload.propertyid, user_id:req.session.user.id});
    mq_client.make_request('searchbypropertyid',payload, function(err,results){
        if(err){
            return done(err);
        }
        else
        {
            if(results.code == 200){
                res.send(results);
            }
            else {
                console.log("Invalid signup... record duplication");
                res.send({status:'error',error:"value updation failed"});
            }
        }
    });
});

router.post('/searchbyquery', function(req, res, next) {
    console.log('search by search query');

    console.log("This is req.body:" + req.body.city);
    var p=JSON.stringify(req.body);

    var payload = {};
   // payload.city = req.body.city;
    //console.log(payload.city);

    if(req.body.city != ""){
        payload.city = req.body.city;
        console.log(payload.city);
    }
    if(req.body.dateFrom != ""){
        payload.dateFrom = req.body.dateFrom;
        console.log(payload.dateFrom);
    }
    if(req.body.dateTo != ""){
        payload.dateTo = req.body.dateTo;
        console.log(payload.dateTo);
    }
    if(req.body.guests != ""){
        payload.guests = req.body.guests;
        console.log(payload.guests);
    }
    console.log(payload);


    //payload.userid = req.session.user.id;
    //payload.zipcode = 95134;
    //console.log("Payload.city is:" + payload.zipcode);

    mq_client.make_request('searchbyquery',payload, function(err,results){
        if(err){
            return done(err);
        }
        else
        {
            if(results.code == 200){
                console.log("this is value:" + JSON.stringify(results));
                res.send(results);
            }
            else {
                console.log("Invalid signup... record duplication");
                res.send({status:'error',error:"value updation failed"});
            }
        }
    });
});

router.post('/searchAllProperties', function(req, res, next) {
    console.log('search all property');

    var payload = {};
    //payload.userid = req.session.user.id;
    //payload.propertyid = 1;

    mq_client.make_request('searchAllProperties',payload, function(err,results){
        if(err){
            return done(err);
        }
        else
        {
            if(results.code == 200){
                res.send(results);
            }
            else {
                console.log("Invalid signup... record duplication");
                res.send({status:'error',error:"value updation failed"});
            }
        }
    });
});

router.post('/searchbycity', function(req, res, next) {
    console.log('search by city');

    var payload = {};
    //payload.userid = req.session.user.id;
    payload.city = req.body.city;
    payload.state=req.body.state;

    mq_client.make_request('searchbycity',payload, function(err,results){
        if(err){
            return done(err);
        }
        else
        {
            if(results.code == 200){
                res.send(results);
            }
            else {
                console.log("Invalid signup... record duplication");
                res.send({status:'error',error:"value updation failed"});
            }
        }
    });
});


module.exports = router;
