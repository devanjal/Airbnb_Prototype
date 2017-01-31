
var request = require('request')
    , express = require('express')
    ,assert = require("assert")
    ,http = require("http");

describe('airbnb test', function(){

    it('shoud return the login page', function(done){
        http.get('http://localhost:3000/', function(res) {
            assert.equal(200, res.statusCode);
            done();
        })
    });


});