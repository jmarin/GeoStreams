var express = require('express');
    var app = express();
    var http = require('http');
    var devRest = require('dev-rest-proxy');

    app.configure(function() {
        var staticPath = express.static(__dirname + '/app');
        app.set('port', process.env.PORT || 3000);
        app.use(express.static(__dirname + '/app'));
    });

    app.get('/api/*', function(req, res) {
        devRest.proxy(req,res, 'localhost', 9000);
    });

    app.post('/api/*', function(req, res) {
        devRest.proxy(req,res, 'localhost', 9000);
    });

    http.createServer(app).listen(app.get('port'), function(){
        console.log("Express server listening on port " + app.get('port'));
    });