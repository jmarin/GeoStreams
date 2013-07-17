/**
 * Module dependencies.
 */
 
var express = require('express');
var http = require('http');
var path = require('path');
var pause = require('pause');
var url = require('url');
var program = require('commander');
 
var app = express();

// for use behind nginx
app.enable('trust proxy');
 
// all environments
app.set('port', process.env.PORT || 3000);
 
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
 


program.usage('[options] <config>')
    .option('-d, --debug', 'run client in debug mode (unminified sources)')
    .option('-m, --mongo <uri>', 'mongo connection string (overrides config)')
    .option('-l, --loglevel <level>', 'set logging level [info]', 'info')
    .option('-b, --build <path>', 'path to build target (e.g. ' +
        '"target/client*")')
    .parse(process.argv);


// load config
var configFile = program.args.pop();
if (!configFile) {
  program.help();
}

try {
	config = require(path.resolve(configFile));

} catch(e) {
	console.error('Failure reading config: ' );
	process.exit(1);
}   

//Proxy requests to backend

function pauseMiddleware(req, res, next) {
  req.paused = pause(req);
  next();
}

function resumeMiddleware(req, res, next) {
  req.paused.resume();
}


function proxy(config) {

  var isHttps = config.protocol === 'https:',
      port = config.port || (isHttps ? 443 : 80),
      requestor = require(isHttps ? 'https' : 'http');

  return function(req, res, next) {

    var options = {
      hostname: config.hostname,
      protocol: config.protocol,
      port: port,
      // strip out the leading /api/v1 from the request path, since it's
      // already specified in the config
      path: config.path + req.url.substring('/api/v1'.length),
      method: req.method,
      headers: req.headers
    };

    // don't leak session cookie
    delete options.headers.cookie;

    var proxyReq = requestor.request(options, function(proxyRes) {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });
    proxyReq.on('error', function(err) {
      next(err);
    });
    req.pipe(proxyReq);

    // next called to resume the paused request
    next();
  };
}


app.get("/api/*",
  pauseMiddleware,
  proxy(url.parse(config.api)),
  resumeMiddleware
);


// development only
if ('production' == app.get('env')) {
    app.use(express.static(path.join(__dirname, 'dist')));
} else {
    app.use(express.static(path.join(__dirname, 'app')));
    app.use(express.errorHandler());
}
 
http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port %d in %s mode", app.get('port'), app.get('env'));
});