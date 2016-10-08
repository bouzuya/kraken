"use strict";

function __export(m) {
    for (var p in m) {
        if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
}
var load_1 = require('./load');
exports.load = load_1.load;
__export(require('./compile'));
__export(require('./migrate'));