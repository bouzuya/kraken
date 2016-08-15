"use strict";

var fs = require('fs');
var fse = require('fs-extra');
var path_1 = require('path');
exports.path = path_1.join;
var formatJson = function formatJson(data, space) {
    return JSON.stringify(data, undefined, space);
};
exports.formatJson = formatJson;
var listFiles = function listFiles(path) {
    function f(files, p) {
        if (!fs.statSync(p).isDirectory()) return files.concat([p]);
        return fs.readdirSync(p).reduce(function (r, dof) {
            return f(r, path_1.join(p, dof));
        }, files);
    }
    ;
    return f([], path);
};
exports.listFiles = listFiles;
var parseJson = function parseJson(json) {
    return JSON.parse(json);
};
exports.parseJson = parseJson;
var readFile = function readFile(path) {
    return fs.readFileSync(path, { encoding: 'utf-8' });
};
exports.readFile = readFile;
var writeFile = function writeFile(path, data) {
    fse.outputFileSync(path, data, { encoding: 'utf-8' });
};
exports.writeFile = writeFile;