// node modules
var util = require('util');
var fs = require('fs');
var path = require('path');
var url = require('url');

// 3rd party modules
var log = require('npmlog');
var express = require('express');
var cons = require('consolidate');
var swig = require('swig');
var validator = require('express-validator');
var program = require('commander');
var pause = require('pause');

program.usage('[options] <config>')
    .option('-d, --debug', 'run client in debug mode (unminified sources)')
    .option('-l, --loglevel <level>', 'set logging level [info]', 'info')
    .option('-b, --build <path>', 'path to build target (e.g. ' +
        '"target/client*")')
    .parse(process.argv);


/** @type {string} */
log.level = program.loglevel;

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

var app = express();

app.engine('.html', cons.swig);
app.set('view engine', 'html');
swig.init({
  root: path.join(__dirname, 'views'),
  cache: !program.debug,
  allowErrors: true
});
app.set('views', path.join(__dirname, 'views'));

// middleware for static resources
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/components', express.static(path.join(__dirname, 'components')));
if (program.build) {
  app.use(express.static(path.join(__dirname, program.build)));
}
if (program.debug) {
  // configure packa debug loader
  var packa = require('packa').server;
  app.get('/static/js/*', packa.debug({directory: __dirname}));
}


app.get("/", function(req, res, next){
	res.render("dashboard.html");
});


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

  return function (req, res, next) {

    var options = {
      hostname: config.hostname,
      protocol: config.protocol,
      port: port,
      path: config.path + req.url.substring('/api'.length),
      method: req.method,
      headers: req.headers
    };

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


//Start server
app.listen(config.port, function() {
  // TODO: export something useful (check if express app emits 'listening')
  process.nextTick(function() {
    process.stdout.write('go\n'); // used by tests to signal ready
    log.info('server', 'Server listening http://localhost:%d', config.port);
  });
});