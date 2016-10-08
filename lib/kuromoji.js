"use strict";

var kuromoji = require('kuromoji');
var path = require('path');
var tokenizer = function tokenizer() {
    return new Promise(function (resolve, reject) {
        var dicPath = path.join(__dirname, '../node_modules/kuromoji/dict/');
        kuromoji.builder({ dicPath: dicPath }).build(function (error, tokenizer) {
            if (typeof error === 'undefined' || error === null) {
                resolve(tokenizer);
            } else {
                reject(error);
            }
        });
    });
};
exports.tokenizer = tokenizer;