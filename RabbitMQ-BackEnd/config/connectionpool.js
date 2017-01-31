var arrayOfConnection= [];

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
//var mongoUrl = 'mongodb://localhost:27017/airbnb';
var mongoUrl = 'mongodb://root:cmpe273@ds113678.mlab.com:13678/airbnb_mongo';
//<<<<<<< HEAD:RabbitMQ-BackEnd/services/connectionpool.js
var db;

//>>>>>>> origin/Nishank:RabbitMQ-BackEnd/config/connectionpool.js

var db;
// Initialize connection once
MongoClient.connect(mongoUrl, function(err, database) {
	if(err) throw err;
	db = database;

});

exports.getdbconnection = function()
{
	return db;
}

exports.closedbconnection = function()
{
	db.close();
}

function createConnection()
{
	var mysql      = require('mysql');
	var connection = mysql.createConnection({
		  host     : 'airbnb-db.cgs0po3uhy3t.us-east-1.rds.amazonaws.com',
		  user     : 'airbnbdb',
		  password : 'airbnbdb',
		  database : 'airbnbDb'
	});
	return connection;
};
for(var i=0;i<100;i++){
	var connection=createConnection();
	arrayOfConnection.push(connection);
}
exports.getConnection = function(callback)
{
	// console.log("getting connection");
	var connection = arrayOfConnection.pop();
    //pop fails will create new connection
	if(connection == undefined)
		connection = createConnection();
	callback((connection == undefined)?true:false,connection);
	//return connection;
}
exports.getSQLConnection = function(){
	var connection = arrayOfConnection.pop();
    //pop fails will create new connection
	if(connection == undefined)
		connection = createConnection();
	return connection;
};
exports.releaseSQLConnection = function(connection){
	console.log("Connection Released");
	arrayOfConnection.push(connection);
	//connection.end();
};
exports.closeSQLConnection = function(connection){
	//console.log("Connection Released");
	//arrayOfConnection.push(connection);
	var arrayLength = arrayOfConnection.length;
	for (var i = 0; i < arrayLength; i++) {
		connection = arrayOfConnection[i];
		connection.end();
		//Do something
	}
};
var recursive = function () {

    console.log("It has been one second!");
}
//setInterval(recursive, 20);