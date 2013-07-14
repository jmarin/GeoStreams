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


app.get("/", function(req, res, next){
	res.render("index.html");
});

//Start server
app.listen(config.port, function() {
  // TODO: export something useful (check if express app emits 'listening')
  process.nextTick(function() {
    process.stdout.write('go\n'); // used by tests to signal ready
    log.info('server', 'Server listening http://localhost:%d', config.port);
  });
});