var winston = require('winston');
var redisClient = require('redis').createClient;
var redis = redisClient(6379, 'localhost');
//var logger=winston.add(winston.transports.File, { filename: 'property.log' });

var connectionpool = require('../config/connectionpool');

function searchbypropertyid(msg, callback){
    var res = {};
    console.log(JSON.stringify(msg));
   // logger.info({propertyid:msg.propertyid, });
    redis.get(msg.propertyid, function (error, reply) {
        if (error) {
            console.log("Inside Redis ERROR");
            res.code = 500;

            res.value = error;
            callback(error, res);
        } else {
            if (reply) {
                console.log("Inside Redis REPLY");
                res.code = 200;
                res.value = JSON.parse(reply);
                //res.value = "Found in redis";
                callback(null, res);
            } else {
                connectionpool.getConnection(function (err, connection) {
                    if (err) {
                        connectionpool.releaseSQLConnection(connection);
                        res.code = 401;
                        res.value = "Error connecting to Db";
                        callback(null, res);
                        return;
                    }

                    connection.query(
                        'SELECT * from properties as p, users as u WHERE u.id=p.hostid and p.propertyid=?', [msg.propertyid],
                        function (err, rows, fields) {

                            if (err) {
                                console.log(err);
                                res.code = 401;
                                res.value = "searching host by id failed";
                                callback(null, res);
                                connectionpool.releaseSQLConnection(connection);
                                return;
                            }
                            // res.code = 200;

                                res.value = rows;
                            //logger.info('Hello again distributed logs');
                            console.log("This is value of rows:--" + JSON.stringify(rows[0].title));
                            var mongoconnection = connectionpool.getdbconnection();
                            mongoconnection.collection('properties').find({propertyid: parseInt(msg.propertyid)}).toArray(function (err, result) {

                                if (err) {
                                    console.log(err);
                                    res.code = 400;
                                    res.value = err;
                                    connectionpool.releaseSQLConnection(connection);
                                    callback(null, res);
                                    return;
                                }
                                console.log('test');
                                console.log(JSON.stringify(result));
                                res.code = 200;
                                // logger.log(rows[0].title, rows[0].title);
                                //res.mongoval = result;
                                //res.value = result;
                                connectionpool.releaseSQLConnection(connection);
                                for (var i = 0; i < rows.length; i++) {
                                    rows[i].images = [];
                                    for (var j = 0; j < result.length; j++) {
                                        if (rows[i].propertyid == result[j].propertyid) {
                                            rows[i].images = result[j].images;
                                        }
                                    }
                                }
                                redis.set(msg.propertyid,JSON.stringify(rows), function () {
                                    console.log("inside Redis SET");
                                    callback(null, res);
                                });
                            });
                            // callback(null, res);


                        });

                });
            }
        }
    })
};

function searchbyuserid(msg, callback){
    var res = {};
    console.log(JSON.stringify(msg));

    connectionpool.getConnection(function(err,connection) {
        if (err) {
            connectionpool.releaseSQLConnection(connection);
            res.code = 401;
            res.value = "Error connecting to Db";
            callback(null, res);
            return;
        }

        connection.query(
            'SELECT * from properties as p, users as u WHERE p.hostid=u.id and p.hostid=?',[msg.userid],
            function(err, rows, fields) {

                if (err)
                {
                    console.log(err);
                    res.code = 401;
                    res.value = "searching host by id failed";
                    callback(null, res);
                    connectionpool.releaseSQLConnection(connection);
                    return;
                }
                // res.code = 200;
                res.value = rows;
                var mongoconnection = connectionpool.getdbconnection();
                mongoconnection.collection('properties').find({hostid:msg.userid}).toArray(function(err, result) {
                    //connection.collection('properties').insertOne(post, function(err, result) {
                    if(err) {
                        console.log(err);
                        res.code = 400;
                        res.value = err;
                        connectionpool.releaseSQLConnection(connection);
                        callback(null, res);
                        return;
                    }
                    console.log('test');
                    console.log(JSON.stringify(result));
                    res.code = 200;
                    res.mongoval = result;
                    for(var i=0;i<rows.length;i++){
                        rows[i].images = [];
                        for(var j=0;j<result.length; j++){
                            if(rows[i].propertyid==result[j].propertyid){
                                rows[i].images=result[j].images;
                            }
                        }
                    }
                    res.value = rows;
                    connectionpool.releaseSQLConnection(connection);
                    callback(null, res);
                });
                // callback(null, res);
            });

    });
};

function searchAllProperties(msg, callback){
    var res = {};
    var arr= new Array();
    var result=new Array();
    console.log(JSON.stringify(msg));

    connectionpool.getConnection(function(err,connection) {
        if (err) {
            connectionpool.releaseSQLConnection(connection);
            res.code = 401;
            res.value = "Error connecting to Db";
            callback(null, res);
            return;
        }

        connection.query(
            'SELECT * from properties as p, users as u where u.id=p.hostid and p.published="true"', function(err, rows, fields) {

                if (err)
                {
                    console.log(err);
                    res.code = 401;
                    res.value = "searching by text string failed";
                    callback(null, res);
                    connectionpool.releaseSQLConnection(connection);
                    return;
                }
                res.code = 200;
                res.value = rows;
                for(var i=0;i<rows.length;i++) {
                    arr.push(rows[i].propertyid);
                }
                var mongoconnection = connectionpool.getdbconnection();
                mongoconnection.collection('properties').find({propertyid:{$in:arr}}).toArray(function(err, result) {
                    if (err) {
                        console.log(err);
                        res.code = 400;
                        res.value = err;
                        connectionpool.releaseSQLConnection(connection);
                        callback(null, res);
                        return;
                    }
                    res.mongoval = result;
                    connectionpool.releaseSQLConnection(connection);
                    for(var i=0;i<rows.length;i++){
                        rows[i].images = [];
                        for(var j=0;j<result.length; j++){
                            if(rows[i].propertyid==result[j].propertyid){
                                rows[i].images=result[j].images;
                            }
                        }
                    }
                    callback(null, res);
                });
            });
    });
}

function searchbyquery(msg, callback){
    var res = {};
    var arr= new Array();

    console.log(JSON.stringify(msg));

    connectionpool.getConnection(function(err,connection) {
        if (err) {
            connectionpool.releaseSQLConnection(connection);
            res.code = 401;
            res.value = "Error connecting to Db";
            callback(null, res);
            return;
        }

        connection.query(
            'SELECT * from properties as p, users as u WHERE u.id=p.hostid and p.published="true" and p.city=? and p.availability_from =? and p.availability_to =? and p.quantity =?',[msg.city, msg.dateFrom, msg.dateTo, msg.guests],
            function(err, rows, fields) {
                if (err)
                {
                    console.log(err);
                    res.code = 401;
                    res.value = "searching by text string failed";
                    callback(null, res);
                    connectionpool.releaseSQLConnection(connection);
                    return;
                }
                res.code = 200;
                res.value = rows;
                for(var i=0;i<rows.length;i++) {
                    arr.push(rows[i].propertyid);
                }
                var mongoconnection = connectionpool.getdbconnection();
                mongoconnection.collection('properties').find({propertyid:{$in:arr}}).toArray(function(err, result) {
                    if (err) {
                        console.log(err);
                        res.code = 400;
                        res.value = err;
                        connectionpool.releaseSQLConnection(connection);
                        callback(null, res);
                        return;
                    }

                    res.mongoval = result;
                    connectionpool.releaseSQLConnection(connection);
                    for(var i=0;i<rows.length;i++){
                        rows[i].images = [];
                        for(var j=0;j<result.length; j++){
                            if(rows[i].propertyid==result[j].propertyid){
                                rows[i].images=result[j].images;
                            }
                        }
                    }
                    callback(null, res);

                });



            });

    });
}
function searchbycity(msg, callback){
    var res = {};
    var arr= new Array();
    console.log(JSON.stringify(msg));

    connectionpool.getConnection(function(err,connection) {
        if (err) {
            connectionpool.releaseSQLConnection(connection);
            res.code = 401;
            res.value = "Error connecting to Db";
            callback(null, res);
            return;
        }

        connection.query(
            'SELECT * from properties as p, users as u where u.id=p.hostid and p.published="true" and p.city=? and p.state=?',[msg.city, msg.state], function(err, rows, fields) {

                if (err)
                {
                    console.log(err);
                    res.code = 401;
                    res.value = "searching by text string failed";
                    callback(null, res);
                    connectionpool.releaseSQLConnection(connection);
                    return;
                }
                res.code = 200;
                res.value = rows;
                for(var i=0;i<rows.length;i++) {
                    arr.push(rows[i].propertyid);
                }
                var mongoconnection = connectionpool.getdbconnection();
                mongoconnection.collection('properties').find({propertyid:{$in:arr}}).toArray(function(err, result) {
                    if (err) {
                        console.log(err);
                        res.code = 400;
                        res.value = err;
                        connectionpool.releaseSQLConnection(connection);
                        callback(null, res);
                        return;
                    }
                    res.mongoval = result;
                    connectionpool.releaseSQLConnection(connection);
                    for(var i=0;i<rows.length;i++){
                        rows[i].images = [];
                        for(var j=0;j<result.length; j++){
                            if(rows[i].propertyid==result[j].propertyid){
                                rows[i].images=result[j].images;
                            }
                        }
                    }
                    callback(null, res);
                });
            });
    });
}
exports.searchbycity=searchbycity;
exports.searchAllProperties=searchAllProperties;
exports.searchbyquery= searchbyquery;
exports.searchbyuserid = searchbyuserid;
exports.searchbypropertyid = searchbypropertyid;
