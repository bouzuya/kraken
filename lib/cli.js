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
        console.log('DEPRECATED:');
        _1.migrate(inDir, outDir);
    });
    command.command('compile <inDir> <outDir>', 'v4 data/ -> dist/').option('--no-tokens-json', 'no tokens.json').action(function (inDir, outDir, options) {
        console.log('DEPRECATED: Use `kraken build`.');
        var noTokensJson = typeof options.noTokensJson === 'undefined' ? false : options.noTokensJson;
        return _1.compile(inDir, outDir, { noTokensJson: noTokensJson });
    });
    command.command('build <inDir> <outDir>', 'v4 data/ -> dist/').option('--no-tokens-json', 'no tokens.json').action(function (inDir, outDir, options) {
        var noTokensJson = typeof options.noTokensJson === 'undefined' ? false : options.noTokensJson;
        return _1.build(inDir, outDir, { noTokensJson: noTokensJson });
    });
    command.command('start <dir>', 'run server').action(function (dir) {
        return _1.start(dir);
    });
    command.execute();
};
exports.run = run;