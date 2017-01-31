var express = require('express');
var router = express.Router();
var mq_client = require('../rpc/client');
router.post('/createBill',function(req,res){



    var payload = {};
    payload.b=req.body;
    payload.user_id=req.session.user_id;// session
    console.log("before que");

    mq_client.make_request('createBillQueue', payload, function(err,results){
        if(err){
            return done(err);
        }
        else
        {
            if(results.code == 200){
                res.send({status:'success'});
            }
            else {
                res.send({status:'error',error:"Bill creation Failed"});
            }
        }
    });
});
router.get('/getBillByUid',function (req,res) {

    var payload={};

    payload.user_id=req.session.user.id;

    mq_client.make_request('getBillUidQueue', payload, function(err,results){
        if(err){
            return done(err);
        }
        else
        {
            if(results.code == 200){
             //   console.log(results);
                res.send({status:'success', result:results.result});
            }
            else {
                res.send({status:'error',error:"Get bills Failed"});
            }
        }
    });

});
router.get('/getBillByHid',function (req,res) {

    var payload={};

    payload.user_id=req.session.user_id;

    console.log("Getting the bills For host");
    mq_client.make_request('getBillHidQueue', payload, function(err,results){
        if(err){
            return done(err);
        }
        else
        {
            if(results.code == 200){
                //   console.log(results);
                res.send({status:'success', result:results.result});
            }
            else {

                res.send({status:'error',error:"Get bills Failed"});

            }
        }
    });

});
router.post('/getByBillId',function (req,res) {
    var payload=req.body;
    //payload.user_id=req.session.user_id;
    console.log("Getting the bills by Bill ID");
    mq_client.make_request('BillIDQueue', payload, function(err,results){
        if(err){
            return done(err);
        }
        else
        {
            if(results.code == 200){
                //   console.log(results);
                res.send({status:'success', result:results.result});
            }
            else {
                res.send({status:'error',error:"Get bills Failed"});
            }
        }
    });
});
router.post('/deleteBill',function (req, res) {
   var payload={};
    payload.bill_id=req.body.bill_id;
    payload.user_id=req.body.user_id; //Have to change it to session
    mq_client.make_request('deleteBillQueue', payload, function(err,results){
        if(err){
            return done(err);
        }
        else
        {   //console.log(results.code);
            if(results.code == 200){
                //   console.log(results);
                res.send({status:'success', result:results.result});
            }
            else {
                res.send({status:'error',error:"Bill Deletion Failed"});
            }
        }
    });
});
router.post('/searchByDate',function (req,res) {
   var payload={};
   payload=req.body;
 //  payload.user_id=req.body.user_id;
    mq_client.make_request('BillDateQueue', payload, function(err,results){
        if(err){
            return done(err);
        }
        else
        {
            if(results.code == 200){
                //   console.log(results);
                res.send({status:'success', result:results.result});
            }
            else {
                res.send({status:'error',error:"Get bills by date Failed Failed"});
            }
        }
    });
});
module.exports = router;