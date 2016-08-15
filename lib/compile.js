"use strict";

var format_atom_1 = require('./format-atom');
var format_bbn_json_1 = require('./format-bbn-json');
var format_sitemap_1 = require('./format-sitemap');
var fs_1 = require('./fs');
var repository_1 = require('./repository');
var saveDailyJson = function saveDailyJson(repository, outDir) {
    repository.findAll().forEach(function (entry) {
        var id = entry.id;

        var title = typeof id.title === 'undefined' ? 'diary' : id.title;
        var formatted = format_bbn_json_1.formatDailyJson(entry);
        [id.year + '/' + id.month + '/' + id.date + '.json', id.year + '/' + id.month + '/' + id.date + '/index.json', id.year + '/' + id.month + '/' + id.date + '/' + title + '.json', id.year + '/' + id.month + '/' + id.date + '/' + title + '/index.json'].forEach(function (file) {
            fs_1.writeFile(fs_1.path(outDir, file), formatted);
        });
    });
};
var saveMonthlyJson = function saveMonthlyJson(repository, outDir) {
    repository.getYears().forEach(function (year) {
        repository.getMonths(year).forEach(function (month) {
            var entries = repository.findBy({ year: year, month: month });
            var formatted = format_bbn_json_1.formatMonthlyJson(entries);
            [year + '/' + month + '.json', year + '/' + month + '/index.json'].forEach(function (file) {
                fs_1.writeFile(fs_1.path(outDir, file), formatted);
            });
        });
    });
};
var saveYearlyJson = function saveYearlyJson(repository, outDir) {
    repository.getYears().forEach(function (y) {
        var entries = repository.findBy({ year: y });
        var formatted = format_bbn_json_1.formatYearlyJson(entries);
        [y + '.json', y + '/index.json'].forEach(function (file) {
            fs_1.writeFile(fs_1.path(outDir, file), formatted);
        });
    });
};
var saveAllJson = function saveAllJson(repository, outDir) {
    var entries = repository.findAll();
    var formatted = format_bbn_json_1.formatAllJson(entries);
    fs_1.writeFile(fs_1.path(outDir, 'posts.json'), formatted);
};
var saveTagsJson = function saveTagsJson(repository, outDir) {
    var entries = repository.findAll();
    var formatted = JSON.stringify(entries.reduce(function (tags, entry) {
        return entry.tags.reduce(function (tags, tag) {
            var index = tags.findIndex(function (_ref) {
                var name = _ref.name;
                return name === tag;
            });
            if (index >= 0) {
                var before = tags.slice(0, index);
                var oldTag = tags[index];
                var newTag = Object.assign({}, oldTag, { count: oldTag.count + 1 });
                var after = tags.slice(index + 1);
                return before.concat([newTag]).concat(after);
            } else {
                return tags.concat([{ name: tag, count: 1 }]);
            }
        }, tags);
    }, []));
    fs_1.writeFile(fs_1.path(outDir, 'tags.json'), formatted);
};
var saveAtomXml = function saveAtomXml(repository, outDir) {
    var entries = repository.findAll();
    var formatted = format_atom_1.formatAtom(entries);
    fs_1.writeFile(fs_1.path(outDir, 'atom.xml'), formatted);
};
var saveSitemapXml = function saveSitemapXml(repository, outDir) {
    var entries = repository.findAll();
    var formatted = format_sitemap_1.formatSitemap(entries);
    fs_1.writeFile(fs_1.path(outDir, 'sitemap.xml'), formatted);
};
var saveLinkedJson = function saveLinkedJson(repository, outDir) {
    var linked = {};
    var entries = repository.findAll();
    entries.forEach(function (entry) {
        var match = entry.data.match(/\[(\d\d\d\d-\d\d-\d\d)\]/g);
        if (!match) return;
        var from = entry.id.year + '-' + entry.id.month + '-' + entry.id.date;
        match.forEach(function (m) {
            var matched = m.match(/\[(\d\d\d\d-\d\d-\d\d)\]/);
            if (!matched) return;
            var to = matched[1];
            if (typeof linked[to] === 'undefined') linked[to] = [];
            linked[to].push(from);
        });
    });
    var formatted = JSON.stringify(linked);
    fs_1.writeFile(fs_1.path(outDir, 'linked.json'), formatted);
};
var compileImpl = function compileImpl(inDir, outDir) {
    var type = arguments.length <= 2 || arguments[2] === undefined ? 'default' : arguments[2];

    var repository = new repository_1.Repository(inDir, type);
    saveYearlyJson(repository, outDir);
    saveMonthlyJson(repository, outDir);
    saveDailyJson(repository, outDir);
    saveAllJson(repository, outDir);
    saveTagsJson(repository, outDir);
    saveAtomXml(repository, outDir);
    saveSitemapXml(repository, outDir);
    saveLinkedJson(repository, outDir);
};
var compile = function compile(inDir, outDir) {
    compileImpl(inDir, outDir);
};
exports.compile = compile;
var compileOld = function compileOld(inDir, outDir) {
    compileImpl(inDir, outDir, 'jekyll');
};
exports.compileOld = compileOld;
var compileNew = compile;
exports.compileNew = compileNew;