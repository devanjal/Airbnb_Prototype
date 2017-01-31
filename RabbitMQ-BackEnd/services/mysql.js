var ejs= require('ejs');
var mysql = require('mysql');
var pool = [];
var waitingQueue = [];
var arrayelements = {
	'callback' : '',
	'sqlQuery' : '',
	'time'     : 0
};

function getConnection(){
	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'root',
		database : 'test',
		port  : 3306
	});
	return connection;
}

function createConnectionsInPool(numberOfConnections){
	for(var i=0;i<numberOfConnections;i++){
		pool.push(getConnection());
	}
}

var Pool_Connection = new createConnectionsInPool(50);

createConnectionsInPool.prototype.getConnectionFromPool = function(){
	if(pool.length === 0){
		return false;
	} else {
		return true;
	}
};

function queueCheck() {
	if (waitingQueue.length > 0) {
		var item = waitingQueue.shift();
		console.log("Waiting Queue Length After Shifting ===> "+waitingQueue.length);
		fetchData(item.callback, item.sqlQuery);
	}
}


function fetchData(sqlQuery,callback){  //console.log("\nSQL Query::"+sqlQuery);  
// var connection=getConnection();
	var conn_Status;
	conn_Status = Pool_Connection.getConnectionFromPool();
	if (conn_Status === false) {
		if (waitingQueue.length < 20) {
			arrayelements.callback = callback;
			arrayelements.sqlQuery = sqlQuery;
			arrayelements.time = new Date().getTime();
			waitingQueue.push(arrayelements);
			console.log("Waiting for adding ::::> "+waitingQueue.length);
		} else {
			console.log("Full");
			callback("err", "503");
		}
	} else {
		var connection = pool.pop();
		console.log("popped :: "+pool.length);
connection.query(sqlQuery, function(err,rows,field){
	if(err){
	console.log(err);
	callback(err,rows);
	}
	else{
		console.log("result:"+ JSON.stringify(rows));
		pool.push(connection);
		console.log("push :: "+pool.length);
		callback(err, rows);
		queueCheck();
	}
});
	}

}
function cron_mysql(callback, sqlQuery){  //console.log("\nSQL Query::"+sqlQuery);
	var connection=getConnection();
	connection.query(sqlQuery, function(err,rows,field){
		if(err){
			console.log(err);
			callback(err,rows);
		}
		else{
			console.log(rows);
			callback(err, rows);
		}

		//comment
	});

}
exports.fetchData=fetchData;
exports.cron_mysql=cron_mysql;

//exports.queryData=queryData;
