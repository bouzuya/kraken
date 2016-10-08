"use strict";

var repository_1 = require('./repository');
var load = function load(inDir) {
    return new repository_1.Repository(inDir).findAll();
};
exports.load = load;