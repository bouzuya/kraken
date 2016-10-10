"use strict";

var bbn_1 = require('../parse/bbn');
var repository_1 = require('../repository');
var load = function load(inDir) {
    return new repository_1.Repository(inDir, bbn_1.listEntryIds, bbn_1.parseEntry).findAll();
};
exports.load = load;