/**
 * Created by Nikhil-PC on 11/28/2016.
 */
var connectionpool = require('../config/connectionpool');

function createTrip(msg, callback){
    console.log(JSON.stringify(msg));
    var res = {};
    connectionpool.getConnection(function (err, connection) {
       if(err){
           console.log("Error connecting to db" + err);
           connectionpool.releaseSQLConnection(connection);
           return;
       }

        connection.query('insert into `trips`(hostid, userid, propertyid,quantity, fromdate, todate, tripstatus) values (?, ?, ?, ?, ?, ?, ?)',
                        [msg.hostid, msg.userid, msg.propertyid, msg.quantity, msg.fromdate, msg.todate, 'pending'], function (err, result) {
                if(err){
                    console.log("Error in inserting to trips "+err);
                    connectionpool.releaseSQLConnection(connection);
                    res.code = 401;
                    res.value = err.code;
                }
                else if (result) {
                    res.code = 200;
                    res.status = "success";
                } else {
                    res.code = 401;
                }
                callback(null, res);
                connectionpool.releaseSQLConnection(connection);
            });
    });
}

function editTrip(msg, callback) {
    console.log("editTrip");
    console.log(JSON.stringify(msg));
    var res = {};
    connectionpool.getConnection(function (err, connection) {
        if(err){
            console.log("Error connecting to db" + err);
            connectionpool.releaseSQLConnection(connection);
            return;
        }
        connection.query('Update `trips` set quantity=?, fromdate=?, todate=? where tripid=?', [msg.quantity, msg.fromdate, msg.todate, msg.tripid],
        function (err, result) {
            if(err){
                console.log("Error in updating trips "+err);
                connectionpool.releaseSQLConnection(connection);
                res.code = 401;
                res.value = err.code;
            }else if (result) {
                res.code = 200;
                res.status = "success";
            } else {
                res.code = 401;
            }
            callback(null, res);
            connectionpool.releaseSQLConnection(connection);
        });
    });
}
function getAllTripsByUserId(msg, callback) {
    var res = {};
    connectionpool.getConnection(function (err, connection) {
        if (err) {
            console.log("Error connecting to db" + err);
            connectionpool.releaseSQLConnection(connection);
            return;
        }
        //select t.quantity, t.fromdate, t.todate, t.tripstatus, p.category, p.address, p.city, p.state, p.country, p.zipcode, p.title, p.price from trips as t inner join properties as p where t.propertyid = p.propertyid and t.userid = ?;
        connection.query('select t.tripid, t.quantity, t.fromdate, t.todate, t.tripstatus, p.propertyid, p.category, p.address, p.city, p.state, p.country, p.zipcode, p.title, p.price from trips as t inner join properties as p where t.propertyid = p.propertyid and t.userid = ?',
            [msg.userid],

            function (err, rows) {
                if (err)
                {
                    console.log(err);
                    res.code = 401;
                    //res.value = "searching by text string failed";
                    callback(null, res);
                    connectionpool.releaseSQLConnection(connection);
                    return;
                }
                arr=[];
                for(var i=0;i<rows.length;i++) {
                    arr.push(rows[i].propertyid);
                }
                var mongoconnection = connectionpool.getdbconnection();
                mongoconnection.collection('properties').find({propertyid: {$in:arr}}).toArray(function (err, result) {
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
                    res.code = 200;
                    res.value = rows;
                    callback(null, res);
                });

            });
    });
}


function getAllTripsByHostId(msg, callback) {
    var res = {};
    console.log("trips by host id" + JSON.stringify(msg));
    connectionpool.getConnection(function (err, connection) {
        if(err){
            console.log("Error connecting to db" + err);
            connectionpool.releaseSQLConnection(connection);
            return;
        }
        connection.query('select t.tripid, t.quantity, t.fromdate, t.todate, t.tripstatus, p.category, p.address, p.city, p.state, p.country, p.zipcode, p.title, p.price, u.firstname, u.lastname from trips as t inner join properties as p inner join users as u on t.propertyid = p.propertyid and t.userid = u.userid where t.hostid = ?',
                        [msg.hostid],
            function (err, result) {

                if(err){
                    console.log("Error in fetching user trips "+err);
                    connectionpool.releaseSQLConnection(connection);
                    res.code = 401;
                    res.value = err.code;
                }else if (result) {
                    console.log(result);
                    res.code = 200;
                    res.data = result;
                    res.status = "success";
                } else {
                    res.code = 401;
                    res.data = null;
                }
                callback(null, res);
                connectionpool.releaseSQLConnection(connection);
            });
    });
}
function getTripByUserId(msg, callback) {
    var res = {};
    connectionpool.getConnection(function (err, connection) {
        if(err){
            console.log("Error connecting to db" + err);
            connectionpool.releaseSQLConnection(connection);
            return;
        }
        connection.query('Select t.tripid, t.quantity, t.fromdate,  t.todate, p.title, p.price, p.category, p.address, p.city, p.state, p.country, p.zipcode from trips as t inner join properties as p where t.propertyid = p.propertyid and t.tripid=?',
        [msg.tripid],
        function (err, result) {
            if(err){
                console.log("Error in fetching user trips by userid "+err);
                connectionpool.releaseSQLConnection(connection);
                res.code = 401;
                res.value = err.code;
            }else if (result) {
                res.code = 200;
                res.data = result;
                res.status = "success";
            } else {
                res.code = 401;
                res.data = null;
            }
            callback(null, res);
            connectionpool.releaseSQLConnection(connection);
        });
    });
}
function cancelTrip(msg, callback) {
    var res = {};
    connectionpool.getConnection(function (err, connection) {
        if(err){
            console.log("Error connecting to db" + err);
            connectionpool.releaseSQLConnection(connection);
            return;
        }
        connection.query('Update `trips` set tripstatus=? where tripid=?',
            ['canceled', msg.tripid],
            function (err, result) {
                if(err){
                    console.log("Error in canceling user trip "+err);
                    connectionpool.releaseSQLConnection(connection);
                    res.code = 401;
                    res.value = err.code;
                }else if (result) {
                    res.code = 200;
                    res.status = "success";
                } else {
                    res.code = 401;
                }
                callback(null, res);
                connectionpool.releaseSQLConnection(connection);
            });
    });
}
exports.getAllTripsByHostId = getAllTripsByHostId;
exports.getAllTripsByUserId = getAllTripsByUserId;
exports.getTripByUserId = getTripByUserId;
exports.createTrip = createTrip;
exports.editTrip = editTrip;
exports.cancelTrip = cancelTrip;