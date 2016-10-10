"use strict";

var fs_1 = require('../utils/fs');
var time_keeper_1 = require('time-keeper');
var marked = require('marked');
var parseEntry = function parseEntry(entryDir, entryId, parseRaw) {
    var _parseRaw = parseRaw(entryDir, entryId);

    var meta = _parseRaw.meta;
    var data = _parseRaw.data;

    if (typeof meta.minutes === 'undefined') {
        throw new Error('minutes is not defined');
    }
    if (typeof meta.pubdate === 'undefined') {
        throw new Error('pubdate is not defined');
    }
    if (typeof meta.title === 'undefined') {
        throw new Error('title is not defined');
    }
    var minutes = meta.minutes;
    var pubdate = meta.pubdate;
    var tags = typeof meta.tags === 'undefined' ? [] : meta.tags;
    var title = meta.title;
    var date = time_keeper_1.parseISOString(pubdate).inTimeZone('+09:00').toISOString().substring(0, '2006-01-02'.length);
    var html = marked(data);
    var entry = {
        id: entryId, data: data, date: date, html: html, minutes: minutes, pubdate: pubdate, tags: tags, title: title
    };
    return entry;
};
exports.parseEntry = parseEntry;
var listEntryIds = function listEntryIds(dirOrFile) {
    return fs_1.listFiles(dirOrFile).filter(function (file) {
        return file.match(/(\d{4})-(\d{2})-(\d{2})(?:-(.*))?\.md$/);
    }).map(function (file) {
        var match = file.match(/(\d{4})-(\d{2})-(\d{2})(?:-(.*))?\.md$/);
        if (match === null) throw new Error();
        var year = match[1];
        var month = match[2];
        var date = match[3];
        var title = match[4];
        return { year: year, month: month, date: date, title: title };
    });
};
exports.listEntryIds = listEntryIds;