var CronJob = require('cron').CronJob;
var connectionpool = require('../config/connectionpool');

var job = new CronJob('50 31 01 * * *', function() {
    //select trips which has same start date and bid is enabled
    //update trips
    //update bill
    //delete bid
    //update properties available dates

    connectionpool.getConnection(function(err,connection){
        if(err){
            connectionpool.releaseSQLConnection(connection);
            console.log('Error connecting to Db');
            return;
        }
        // select * from properties where bid_price is not null
        // select fromdate,todate from trips where tripstatus = 'approved'
        // for loop
        //
        //select * from trips inner join bill on trips.billid=bill.bill_id where propertyid = 15 and tripstatus != 'approved' and fromdate not in (select fromdate from trips where propertyid = 15 and tripstatus = 'approved') and todate not in (select todate from trips where propertyid = 15 and tripstatus = 'approved') order by amount asc

        // check if from date and to date are in range of stored date ( updated now)
        //      update trip dates stored
        //      change trip status to approved
        // else
        //      change trip to rejected

        // include date > present date

        connection.query('select * from properties where bid_price is not null' , function(err, properties, fields) {

            if (!err)
            {
                console.log('The solution is: '+  (parseInt(properties.length)-1) + ' ' + JSON.stringify(properties[0]));
                if(properties.length == 0)
                    connectionpool.releaseSQLConnection(connection);
                else
                {
                    //---
                    connection.query('select fromdate,todate from trips where tripstatus = ?',['approved'],function(err, approveddate, fields) {

                        if (!err)
                        {
                          if(approveddate.length == 0)
                                connectionpool.releaseSQLConnection(connection);
                            else
                            {
                                //---
                                for(prop in properties)
                                {
                                    //--
                                    connection.query('select * from trips inner join bill on trips.billid=bill.bill_id where propertyid = 15 and tripstatus != `approved` order by amount asc ',function(property_snapshot,approveddate_snapshot){return function(err, trips, fields) {

                                        if (!err) {
                                            if (trips.length == 0)
                                                connectionpool.releaseSQLConnection(connection);
                                            else {
                                                for(j = 0; j < trips.length; j++) {
                                                    for (i = 0; i < approveddate_snapshot.length; i++) {
                                                        if (approveddate_snapshot[i].fromdate >= trips.fromdate && approveddate_snapshot[i].todate <= trips.todate) {
                                                            connection.query(
                                                                'UPDATE trips SET tripstatus = `rejected` Where tripid = ?',
                                                                [trips_snaphot.tripid],
                                                                function(trip_snapshot){ return function (err, result) {
                                                                    if (err)
                                                                    {
                                                                        console.log(err);
                                                                        connectionpool.releaseSQLConnection(connection);
                                                                        throw err;
                                                                    }
                                                                    //--

                                                                    connectionpool.releaseSQLConnection(connection);
                                                                    //--
                                                                }})(trips_snaphot);
                                                            //alert('Yes');
                                                        }
                                                        else
                                                        {
                                                            connection.query(
                                                                'UPDATE trips SET tripstatus = `approved` Where tripid = ?',
                                                                [trips_snaphot.tripid],
                                                                function(trip_snapshot){ return function (err, result) {
                                                                    if (err)
                                                                    {
                                                                        console.log(err);
                                                                        connectionpool.releaseSQLConnection(connection);
                                                                        throw err;
                                                                    }
                                                                    //--

                                                                    connectionpool.releaseSQLConnection(connection);
                                                                    //--
                                                                }})(trips_snaphot);
                                                            approveddate_snapshot.push({fromdate:trips.fromdate,todate:trips.todate});
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        else {
                                            connectionpool.releaseSQLConnection(connection);
                                            console.log('Error while performing Query.');
                                        }
                                    }})(prop,approveddate);
                                    //--                                    //--
                                }
                                //---
                            }
                        }
                        else
                        {
                            connectionpool.releaseSQLConnection(connection);
                            console.log('Error while performing Query.');
                        }
                    });
                    //---
                }
            }
            else
            {
                connectionpool.releaseSQLConnection(connection);
                console.log('Error while performing Query.');
            }
        });
    });
    console.log("test");

}, null, true, 'America/Los_Angeles');

