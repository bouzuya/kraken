"use strict";

var fs = require('fs');
var path = require('path');
var commander = require('commander-b');
var _1 = require('./');
var run = function run() {
    var packageJsonFile = path.join(__dirname, '..', 'package.json');
    var json = fs.readFileSync(packageJsonFile, { encoding: 'utf-8' });
    var pkg = JSON.parse(json);
    var command = commander('bbn-api').version(pkg.version);
    command.command('migrate <inDir> <outDir>', 'v3 data/ -> v4 data/').action(function (inDir, outDir) {
        _1.migrate(inDir, outDir);
    });
    command.command('compile <inDir> <outDir>', 'v4 data/ -> dist/').action(function (inDir, outDir) {
        _1.compile(inDir, outDir);
    });
    command.execute();
};
exports.run = run;