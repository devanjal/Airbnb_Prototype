var connectionpool = require('../config/connectionpool');

function makeuserreview(msg, callback){
    var res = {};

    var reviewcontent = [{starrating: msg.starrating,review : msg.review,hostname : msg.hostname , hostid : msg.hostid}];
    var mongoconnection = connectionpool.getdbconnection();
    mongoconnection.collection('users').update({id:msg.userid},{$push:{userreviews:{$each:reviewcontent}},$set:{netuserrating:msg.starrating}}, {upsert:true},function(err, result) {
        if(err) {
            console.log(err);
            res.code = 400;
            res.value = err;
            callback(null, res);
            return;
        }
        res.code = 200;
        res.value = "review inserted successfully";
        callback(null, res);
    });
};
function makehostreview(msg, callback){
    var res = {};

    var reviewcontent = [{starrating: msg.starrating,review : msg.review,username : msg.username , userid : msg.userid}];
    var mongoconnection = connectionpool.getdbconnection();
    mongoconnection.collection('users').update({id:msg.hostid},{$push:{hostreviews:{$each:reviewcontent}},$set:{nethostrating:msg.starrating}}, {upsert:true},function(err, result) {
        if(err) {
            console.log(err);
            res.code = 400;
            res.value = err;
            callback(null, res);
            return;
        }
        res.code = 200;
        res.value = "review inserted successfully";
        callback(null, res);
    });
};

function makepropertyreview(msg, callback){
    var res = {};

    var reviewcontent = [{starrating : msg.starrating,review : msg.review,username : msg.username , userid : msg.userid}];
    var mongoconnection = connectionpool.getdbconnection();
    mongoconnection.collection('properties').update({propertyid:msg.propertyid},{$push:{propertyreviews:{$each:reviewcontent}},$set:{netpropertyrating:msg.starrating}}, {upsert:true},function(err, result) {
        if(err) {
            console.log(err);
            res.code = 400;
            res.value = err;
            callback(null, res);
            return;
        }
        res.code = 200;
        res.value = "review inserted successfully";
        callback(null, res);
    });
};
exports.makepropertyreview = makepropertyreview;
exports.makeuserreview = makeuserreview;
exports.makehostreview = makehostreview