"use strict";

var fs_1 = require('../utils/fs');
var format = function format(entry) {
    var data = entry.data;
    var date = entry.date;
    var html = entry.html;
    var minutes = entry.minutes;
    var pubdate = entry.pubdate;
    var tags = entry.tags;
    var title = entry.title;

    return {
        data: data,
        date: date,
        minutes: minutes,
        html: html,
        pubdate: pubdate,
        tags: tags,
        title: title
    };
};
var formatAllJson = function formatAllJson(entries) {
    return fs_1.formatJson(entries.map(function (entry) {
        var date = entry.date;
        var minutes = entry.minutes;
        var pubdate = entry.pubdate;
        var tags = entry.tags;
        var title = entry.title;

        return { date: date, minutes: minutes, pubdate: pubdate, tags: tags, title: title };
    }));
};
exports.formatAllJson = formatAllJson;
var formatDailyJson = function formatDailyJson(entry) {
    var entryJson = format(entry);
    return fs_1.formatJson(entryJson);
};
exports.formatDailyJson = formatDailyJson;
var formatMonthlyJson = function formatMonthlyJson(entries) {
    return fs_1.formatJson(entries.map(format));
};
exports.formatMonthlyJson = formatMonthlyJson;
var formatYearlyJson = function formatYearlyJson(entries) {
    return fs_1.formatJson(entries.map(format));
};
exports.formatYearlyJson = formatYearlyJson;