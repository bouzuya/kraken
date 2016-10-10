"use strict";

var jekyll_markdown_parser_1 = require('jekyll-markdown-parser');
var base_1 = require('./base');
exports.listEntryIds = base_1.listEntryIds;
var fs_1 = require('../utils/fs');
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
var parseEntry = function parseEntry(entryDir, entryId) {
    return base_1.parseEntry(entryDir, entryId, loadJekyllMarkdown);
};
exports.parseEntry = parseEntry;