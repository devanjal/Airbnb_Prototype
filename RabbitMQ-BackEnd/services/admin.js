var connectionpool = require('../config/connectionpool');

function approvehost(msg, callback){
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
            'UPDATE users SET usertype = ?,hoststatus = ? Where id = ?',
            ['host','approved',msg.id],
            function (err, result) {
                if (err)
                {
                    res.code = 401;
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

function rejecthost(msg, callback){
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
            'delete  from properties where hostid = ? and published = ?',
            [msg.id,'true'],
            function (err, result) {
                if (err)
                {
                    res.code = 401;
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

function gettoprevenue(msg, callback){
    var res = {};
    var query = "";
    if(msg.type == 'property')
    {
        query = 'select  property_id,properties.city,properties.title,sum(amount) as netrevenue from bill inner join properties on bill.property_id = properties.propertyid  group by property_id order by netrevenue DESC limit 10';
    }
    else if(msg.type == 'city')
    {
        query = 'select  city,sum(amount) as netrevenue from bill inner join properties on bill.property_id = properties.propertyid  group by properties.city order by netrevenue DESC limit 10';
    }
    else if(msg.type == 'host')
    {
        query = 'select  firstname,lastname,sum(amount) as netrevenue from bill inner join users on bill.host_id = users.id  group by host_id order by netrevenue DESC limit 10';
    }
    connectionpool.getConnection(function(err,connection){
        if(err){
            connectionpool.releaseSQLConnection(connection);
            res.code = 401;
            res.value = "Error connecting to Db";
            callback(null, res);
            return;
        }
        connection.query(
            query,
            [],
            function (err, rows,fields) {
                if (err)
                {
                    res.code = 401;
                    callback(null, res);
                    connectionpool.releaseSQLConnection(connection);
                    return;
                }
                res.code = 200;
                res.value = rows;
                callback(null, res);
                connectionpool.releaseSQLConnection(connection);
            });
    });
};

function gethostrequests(msg, callback){
    var res = {};
    var query = "";
       connectionpool.getConnection(function(err,connection){
        if(err){
            connectionpool.releaseSQLConnection(connection);
            res.code = 401;
            res.value = "Error connecting to Db";
            callback(null, res);
            return;
        }
        connection.query(
            'select id,userid,firstname,lastname,email from users where id in (select hostid from properties group by hostid) and usertype = ?',
            ['user'],
            function (err, rows,fields) {
                if (err)
                {
                    res.code = 401;
                    callback(null, res);
                    connectionpool.releaseSQLConnection(connection);
                    return;
                }
                var arr = [];
                for(var i=0;i<rows.length;i++) {
                    arr.push(rows[i].id);
                }
                var mongoconnection = connectionpool.getdbconnection();
                mongoconnection.collection('users').find({id:{$in:arr}}).toArray(function(err, result) {
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
                        rows[i].profile_image = "https://a2.muscache.com/defaults/user_pic-225x225.png?v=2";
                        for(var j=0;j<result.length; j++){
                            if(rows[i].id==result[j].id){
                                rows[i].profile_image = result[j].profile_image;
                            }
                        }
                    }
                    res.code = 200;
                    res.value = rows;
                    callback(null, res);
                });
            });
    });
};
exports.approvehost = approvehost;
exports.rejecthost = rejecthost;
exports.gettoprevenue = gettoprevenue;
exports.gethostrequests = gethostrequests;
