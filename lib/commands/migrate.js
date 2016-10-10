"use strict";

var fs_1 = require('../utils/fs');
var jekyll_1 = require('../parse/jekyll');
var migrate = function migrate(inDir, outDir) {
    jekyll_1.listEntryIds(inDir).forEach(function (id) {
        var entry = jekyll_1.parseEntry(inDir, id);
        var data = entry.data;
        var meta = {
            minutes: entry.minutes,
            pubdate: entry.pubdate,
            tags: entry.tags,
            title: entry.title
        };
        var dir = fs_1.path(outDir, id.year, id.month);
        var baseName = typeof id.title === 'undefined' || id.title === 'diary' ? id.year + '-' + id.month + '-' + id.date : id.year + '-' + id.month + '-' + id.date + '-' + id.title;
        var metaFile = fs_1.path(dir, baseName + '.json');
        var dataFile = fs_1.path(dir, baseName + '.md');
        fs_1.writeFile(metaFile, fs_1.formatJson(meta, 2));
        fs_1.writeFile(dataFile, data);
    });
};
exports.migrate = migrate;