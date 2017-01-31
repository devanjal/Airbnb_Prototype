var connectionpool = require('../config/connectionpool');

function becomehost_step1(msg, callback){
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

        var query = connection.query('INSERT INTO properties SET ?', msg , function (err, result) {
                if (err) {
                    console.log(err);
                    res.code = 401;
                    res.value = "Step1 failed";
                    callback(null, res);
                    connectionpool.releaseSQLConnection(connection);

                    return;
                }

                //console.log();
                res.property_id = result.insertId;
                console.log('prop id' + res.property_id);
                res.code = 200;
                res.value = "Step1 succeeded";
                callback(null, res);
            });
    });
};
function becomehost_step2(msg, callback){
    console.log(JSON.stringify(msg));
    var res = {};
    connectionpool.getConnection(function(err,connection){
        if(err){
            connectionpool.releaseSQLConnection(connection);
            res.code = 401;
            res.value = "Error connecting to Db";
            callback(null, res);
            return;
        }
        connection.query(
            'UPDATE properties SET title = ?, propertydescription = ?,published = ? where propertyid = ?',
            [msg.title,msg.description,'step2',msg.propertyid],
            function (err, result) {
                if (err)
                {
                    console.log(err);
                    res.code = 401;
                    res.value = "Step2 failed";
                    callback(null, res);
                    connectionpool.releaseSQLConnection(connection);
                    return;
                }
                var mongoconnection = connectionpool.getdbconnection();
                mongoconnection.collection('properties').update({propertyid:msg.propertyid},{$push:{images:{$each:msg.filenames}}, $set:{hostid : msg.hostid}} , {upsert:true},function(err, result) {
                    if(err) {
                        console.log(err);
                        res.code = 400;
                        res.value = err.name + " " + err.message;
                        connectionpool.releaseSQLConnection(connection);
                        callback(null, res);
                        return;
                    }
                    res.code = 200;
                    res.value = "Step2 updated";
                    connectionpool.releaseSQLConnection(connection);
                    callback(null, res);
                });
            });
    });
};
function becomehost_step3(msg, callback){
    var res = {};
    connectionpool.getConnection(function(err,connection){
        if(err){
            connectionpool.releaseSQLConnection(connection);
            res.code = 401;
            res.value = "Error connecting to Db";
            callback(null, res);
            return;
        }
        connection.query(
            'UPDATE properties SET bid_price = ?, price = ?, availability_from = ?,availability_to = ?,published = ? Where propertyid = ?',
            [msg.bid_price,msg.price,new Date(msg.availability_from),new Date(msg.availability_to),'step3',msg.propertyid],
            function (err, result) {
                if (err)
                {
                    res.code = 401;
                    res.value = "Step3 failed";
                    callback(null, res);
                    console.log(err);
                    connectionpool.releaseSQLConnection(connection);
                    return;
                }
                res.code = 200;
                res.value = "Step3 succeeded";
                callback(null, res);
                connectionpool.releaseSQLConnection(connection);
            });
    });
};

function publishproperty(msg, callback){
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
            'UPDATE properties SET published = ? where propertyid = ?',
            ['true',msg.propertyid],
            function (err, result) {
                if (err)
                {
                    console.log(err);
                    res.code = 401;
                    res.value = "profile publishing failed";
                    callback(null, res);
                    connectionpool.releaseSQLConnection(connection);
                    return;
                }
                res.code = 200;
                res.value = "profile published";
                callback(null, res);
                connectionpool.releaseSQLConnection(connection);
            });
    });
};

function gethostbyarea(msg, callback){
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
        connection.query('select * from users where location REGEXP ?',[msg.location] , function(err, rows, fields) {
            if (!err)
            {
                console.log('The solution is: '+ rows.length + ' ' + JSON.stringify(rows[0]));
                connectionpool.releaseSQLConnection(connection);
                res.code = 200;
                res.value = rows;
                callback(null, res);

            }
            else
            {
                connectionpool.releaseSQLConnection(connection);
                res.code = 401;
                res.error = err;
                callback(null, res);
            }

        });
    });
};
function approvetrips(msg, callback){
    var res = {};
    console.log(JSON.stringify(msg));
    connectionpool.getConnection(function(err,connection) {
        if (err) {
            connectionpool.releaseSQLConnection(connection);
            res.code = 401;
            res.error = err;
            callback(null, res);
            return;
        }
        connection.query(
            'UPDATE trips SET tripstatus = ? where tripid =  ?',
            ['approved',msg.tripid],
            function (err, result) {
                if (err)
                {
                    res.code = 401;
                    res.error = err;
                    callback(null, res);
                    connectionpool.releaseSQLConnection(connection);
                    return;
                }
                console.log("[1]");
                connection.query('select * from trips inner join properties on trips.propertyid = properties.propertyid where trips.tripid = ?',[msg.tripid] , function(err, result, fields) {
                    if (err)
                    {
                        res.code = 401;
                        res.error = err;
                        callback(null, res);
                        connectionpool.releaseSQLConnection(connection);
                        return;
                    }
                    else
                    {
                        if(result.length<=0)
                        {
                            res.code = 401;
                            res.error = err;
                            callback(null, res);
                            connectionpool.releaseSQLConnection(connection);
                            return;
                        }

                        trip = result[0];
                        console.log("[2] "+ JSON.stringify(trip));
                        var date1 = new Date(trip.fromdate);
                        var date2 = new Date(trip.todate);
                        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                        var duration = Math.ceil(timeDiff / (1000 * 3600 * 24));
                        var total=duration*trip.price;
                        var post = { user_id: trip.userid, host_id: trip.hostid, property_id: trip.propertyid, from_date: new Date(date1), to_date: new Date(date2), duration:duration, category:trip.category, no_of_guest:parseInt(trip.quantity),security_deposite:(total / 10), amount:total, date:new Date() ,user_flag:1,host_flag: 1 };
                        console.log(JSON.stringify(post));
                        var query = connection.query('INSERT INTO bill SET ?', post, function (err, r) {
                            if (err) {
                                res.code = 401;
                                res.error = err;
                                callback(null, res);
                                connectionpool.releaseSQLConnection(connection);
                                return;
                            }
                            var bill_id = r.insertId;
                            console.log("[3] "+ trip);
                            connection.query(
                            'UPDATE properties SET availability_from  = ? where propertyid =  ?',
                            [trip.todate,trip.propertyid],
                            function (err, r) {
                                if (err)
                                {
                                    res.code = 401;
                                    res.error = err;
                                    callback(null, res);
                                    connectionpool.releaseSQLConnection(connection);
                                    return;
                                }
                                //--
                                console.log("[4] "+ trip);
                                //---
                                connection.query(
                                    'UPDATE trips SET billid = ? where tripid = ?',
                                    [bill_id,msg.tripid],
                                    function (err, r) {
                                        if (err)
                                        {
                                            res.code = 401;
                                            res.error = err;
                                            callback(null, res);
                                            connectionpool.releaseSQLConnection(connection);
                                            return;
                                        }
                                        //--
                                        console.log("final step " );
                                        res.code = 200;
                                        callback(null, res);
                                        connectionpool.releaseSQLConnection(connection);
                                        //--
                                    });
                                //---


                                //--
                            });
                     });
                    }
                });
            });
    });
};

function rejecttrips(msg, callback){
    var res = {};
    console.log(JSON.stringify(msg));
    connectionpool.getConnection(function(err,connection) {
        if (err) {
            connectionpool.releaseSQLConnection(connection);
            res.code = 401;
            res.error = err;
            callback(null, res);
            return;
        }
        connection.query(
            'UPDATE trips SET tripstatus = ? where tripid =  ?',
            ['rejected',msg.tripid],
            function (err, result) {
                if (err)
                {
                    res.code = 401;
                    res.error = err;
                    callback(null, res);
                    connectionpool.releaseSQLConnection(connection);
                    return;
                }
                res.code = 200;
                callback(null, res);
                connectionpool.releaseSQLConnection(connection);
            });
    });
};

exports.becomehost_queue1 = becomehost_step1;
exports.becomehost_queue2 = becomehost_step2;
exports.becomehost_queue3 = becomehost_step3;
exports.publishproperty = publishproperty;
exports.gethostbyarea = gethostbyarea;
exports.rejecttrips = rejecttrips;
exports.approvetrips = approvetrips;
