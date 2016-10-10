"use strict";

var base_1 = require('./base');
exports.listEntryIds = base_1.listEntryIds;
var fs_1 = require('../utils/fs');
var loadBbnMarkdown = function loadBbnMarkdown(entryDir, entryId) {
    var year = entryId.year;
    var month = entryId.month;
    var date = entryId.date;
    var title = entryId.title;

    var dir = fs_1.path(entryDir, year, month);
    var baseName = typeof title === 'undefined' ? year + '-' + month + '-' + date : year + '-' + month + '-' + date + '-' + title;
    var jsonFile = fs_1.path(dir, baseName + '.json');
    var markdownFile = fs_1.path(dir, baseName + '.md');
    var metaJson = fs_1.readFile(jsonFile);
    var markdown = fs_1.readFile(markdownFile);
    var meta = fs_1.parseJson(metaJson);
    var data = markdown;
    return { meta: meta, data: data };
};
var parseEntry = function parseEntry(entryDir, entryId) {
    return base_1.parseEntry(entryDir, entryId, loadBbnMarkdown);
};
exports.parseEntry = parseEntry;