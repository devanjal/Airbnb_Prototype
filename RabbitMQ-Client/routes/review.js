var express = require('express');
var router = express.Router();
var mq_client = require('../rpc/client');


router.post('/makeuserreview', function(req, res) {

    var payload = {};
    console.log(JSON.stringify(req.body));
    payload.hostid = req.session.user.id;
    //payload.hostid = 4;
    payload.userid = parseInt(req.body.user_id);
    payload.starrating = parseInt(req.body.starrating);
    payload.review = req.body.review;
    //payload.hostname = 'venkatesh';//req.body.review;
    payload.hostname = req.session.user.firstname + ' ' +req.session.user.lastname;
    mq_client.make_request('makeuserreview',payload, function(err,results){
        if(err){
            return done(err);
        }
        else
        {
            if(results.code == 200){
                res.send({status:'success'});
            }
            else {
                res.send({status:'error',error:"unable to insert reviews"});
            }
        }
    });
});

router.post('/makehostreview', function(req, res) {

    var payload = {};
    console.log(JSON.stringify(req.body));
    payload.hostid = parseInt(req.body.host_id);
    //payload.userid = 4 //req.session.user.id;
    payload.userid = req.session.user.id;
    payload.starrating = parseInt(req.body.starrating);
    payload.review = req.body.review;
    payload.username = req.session.user.firstname + ' ' +req.session.user.lastname;//req.body.review;

    mq_client.make_request('makehostreview',payload, function(err,results){
        if(err){
            return done(err);
        }
        else
        {
            if(results.code == 200){
                res.send({status:'success'});
            }
            else {
                res.send({status:'error',error:"unable to insert reviews"});
            }
        }
    });
});

router.post('/makepropertyreview', function(req, res) {

    var payload = {};
    console.log(JSON.stringify(req.body));
    payload.propertyid = parseInt(req.body.property_id);
    payload.userid = req.session.user.id;//12 ;//req.session.user.id;
    payload.starrating = parseInt(req.body.starrating);
    payload.review = req.body.review;
    payload.username = req.session.user.firstname + ' ' +req.session.user.lastname ;//'Anushka';//req.body.review;

    mq_client.make_request('makepropertyreview',payload, function(err,results){
        if(err){
            return done(err);
        }
        else
        {
            if(results.code == 200){
                res.send({status:'success'});
            }
            else {
                res.send({status:'error',error:"unable to insert reviews"});
            }
        }
    });
});


module.exports = router;

