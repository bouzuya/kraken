"use strict";

var build_1 = require('./commands/build');
exports.build = build_1.build;
exports.compile = build_1.compile;
exports.compileOld = build_1.compileOld;
exports.compileNew = build_1.compileNew;
var load_1 = require('./commands/load');
exports.load = load_1.load;
var migrate_1 = require('./commands/migrate');
exports.migrate = migrate_1.migrate;
var start_1 = require('./commands/start');
exports.start = start_1.start;