"use strict";

var jekyll_markdown_parser_1 = require('jekyll-markdown-parser');
var fs_1 = require('./fs');
var time_keeper_1 = require('time-keeper');
var marked = require('marked');
var loadJekyllMarkdown = function loadJekyllMarkdown(entryDir, entryId) {
    var year = entryId.year;
    var month = entryId.month;
    var date = entryId.date;
    var title = entryId.title;

    var dir = fs_1.path(entryDir, year, month);
    var file = fs_1.path(dir, year + '-' + month + '-' + date + '-' + title + '.md');
    var jekyllMarkdown = fs_1.readFile(file);

    var _jekyll_markdown_pars = jekyll_markdown_parser_1.parse(jekyllMarkdown);

    var data = _jekyll_markdown_pars.markdown;
    var meta = _jekyll_markdown_pars.parsedYaml;

    return { meta: meta, data: data };
};
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
var parseEntry = function parseEntry(parserType, entryDir, entryId) {
    var parse = parserType === 'jekyll' ? loadJekyllMarkdown : loadBbnMarkdown;

    var _parse = parse(entryDir, entryId);

    var meta = _parse.meta;
    var data = _parse.data;

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