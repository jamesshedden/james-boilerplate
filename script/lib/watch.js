#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

var argv = require('minimist')(process.argv.slice(2));
var flo = require('fb-flo');
var _ = require('lodash');

var options = {
  verbose: argv.v || argv.verbose || false,
  root: argv.r || argv.root || _.flatten([argv._])[0],
  glob: _.flatten([argv.g || argv.glob || ['**/*']]),
  host: argv.h || argv.host || 'localhost',
  port: argv.p || argv.port || 8888
};

function isIgnorePath(filepath) {
  return filepath === 'app-compiled/css/main-compiled.css';
}

function rootPath(filepath) {
  return path.join(options.root, filepath);
}

function handleCompile(filepath, callback) {
  var ext = path.extname(filepath);
  var inUncompiled = path.dirname(filepath).match(/^assets\/stylesheets(\/|$)/);
  var compiledFile;

  if (ext === '.css') {
    exec('./script/css', function (err) {
      if (err) {
        return callback(err);
      }
      // compiled file (2nd Arg) must match the one created by the initial CSS compilation step
      // see line 8, css bash script file
      callback(null, 'app-compiled/css/main-compiled.css', false);
    });
  } else {
    callback(null, filepath, true);
  }
}

var server = flo(options.root, {
  port: options.port,
  host: options.host,
  verbose: options.verbose,
  glob: options.glob,
  useWatchman: true,
}, function resolver(filepath, callback) {
  // Minimal debugging
  if (!options.verbose) {
    console.log('\x1B[94mFile changed:\x1B[0m \x1B[93m%s\x1B[0m', filepath);
  }

  if (isIgnorePath(filepath)) {
    return;
  }

  handleCompile(filepath, function(err, compiledFile, reload) {
    if (err) {
      console.error('Failed to load %s', filepath);
      console.error(err);
      return;
    }
    callback({
      resourceURL: compiledFile,
      contents: fs.readFileSync(rootPath(compiledFile)).toString(),
      reload: reload
    });
  });
});

server.once('ready', function() {
  console.log('\x1B[32mWatching files ✓\x1B[0m');
});
