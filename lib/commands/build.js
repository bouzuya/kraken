"use strict";

var bbn_1 = require('../parse/bbn');
var jekyll_1 = require('../parse/jekyll');
var format_1 = require('../format');
var fs_1 = require('../utils/fs');
var repository_1 = require('../repository');
var kuromoji_1 = require('../utils/kuromoji');
var saveDailyJson = function saveDailyJson(repository, outDir) {
    repository.each(function (entry) {
        var id = entry.id;

        var title = typeof id.title === 'undefined' ? 'diary' : id.title;
        var formatted = format_1.formatDailyJson(entry);
        [id.year + '/' + id.month + '/' + id.date + '.json', id.year + '/' + id.month + '/' + id.date + '/index.json', id.year + '/' + id.month + '/' + id.date + '/' + title + '.json', id.year + '/' + id.month + '/' + id.date + '/' + title + '/index.json'].forEach(function (file) {
            fs_1.writeFile(fs_1.path(outDir, file), formatted);
        });
    });
};
var saveMonthlyJson = function saveMonthlyJson(repository, outDir) {
    repository.getYears().forEach(function (year) {
        repository.getMonths(year).forEach(function (month) {
            var entries = repository.findBy({ year: year, month: month });
            var formatted = format_1.formatMonthlyJson(entries);
            [year + '/' + month + '.json', year + '/' + month + '/index.json'].forEach(function (file) {
                fs_1.writeFile(fs_1.path(outDir, file), formatted);
            });
        });
    });
};
var saveYearlyJson = function saveYearlyJson(repository, outDir) {
    repository.getYears().forEach(function (y) {
        var entries = repository.findBy({ year: y });
        var formatted = format_1.formatYearlyJson(entries);
        [y + '.json', y + '/index.json'].forEach(function (file) {
            fs_1.writeFile(fs_1.path(outDir, file), formatted);
        });
    });
};
var saveAllJson = function saveAllJson(repository, outDir) {
    var entries = repository.findAll();
    var formatted = format_1.formatAllJson(entries);
    fs_1.writeFile(fs_1.path(outDir, 'posts.json'), formatted);
};
var saveTagsJson = function saveTagsJson(repository, outDir) {
    var formatted = JSON.stringify(repository.reduce(function (tags, _ref) {
        var entryTags = _ref.tags;

        return entryTags.reduce(function (tags, tag) {
            var index = tags.findIndex(function (_ref2) {
                var name = _ref2.name;
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
    var formatted = format_1.formatAtom(entries);
    fs_1.writeFile(fs_1.path(outDir, 'atom.xml'), formatted);
};
var saveSitemapXml = function saveSitemapXml(repository, outDir) {
    var entries = repository.findAll();
    var formatted = format_1.formatSitemap(entries);
    fs_1.writeFile(fs_1.path(outDir, 'sitemap.xml'), formatted);
};
var saveLinkedJson = function saveLinkedJson(repository, outDir) {
    var linked = {};
    repository.each(function (entry) {
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
var saveTokensJson = function saveTokensJson(repository, outDir) {
    return kuromoji_1.tokenizer().then(function (tokenizer) {
        return repository.reduce(function (allTokens, entry) {
            var id = entry.id.year + '-' + entry.id.month + '-' + entry.id.date;
            var tokens = tokenizer.tokenize(entry.data);
            allTokens[id] = tokens;
            return allTokens;
        }, {});
    }).then(function (tokens) {
        var formatted = JSON.stringify(tokens, null, 2);
        fs_1.writeFile(fs_1.path(outDir, 'tokens.json'), formatted);
    });
};
var compileImpl = function compileImpl(inDir, outDir, list, parse) {
    var repository = new repository_1.Repository(inDir, list, parse);
    return Promise.resolve().then(function () {
        return true ? saveYearlyJson(repository, outDir) : void 0;
    }).then(function () {
        return true ? saveMonthlyJson(repository, outDir) : void 0;
    }).then(function () {
        return true ? saveDailyJson(repository, outDir) : void 0;
    }).then(function () {
        return true ? saveAllJson(repository, outDir) : void 0;
    }).then(function () {
        return true ? saveTagsJson(repository, outDir) : void 0;
    }).then(function () {
        return true ? saveAtomXml(repository, outDir) : void 0;
    }).then(function () {
        return true ? saveSitemapXml(repository, outDir) : void 0;
    }).then(function () {
        return true ? saveLinkedJson(repository, outDir) : void 0;
    }).then(function () {
        return true ? saveTokensJson(repository, outDir) : void 0;
    }).then(function () {
        return void 0;
    });
};
var compile = function compile(inDir, outDir) {
    console.log('DEPRECATED: Use `build()`');
    return compileImpl(inDir, outDir, bbn_1.listEntryIds, bbn_1.parseEntry);
};
exports.compile = compile;
var compileOld = function compileOld(inDir, outDir) {
    console.log('DEPRECATED:');
    return compileImpl(inDir, outDir, jekyll_1.listEntryIds, jekyll_1.parseEntry);
};
exports.compileOld = compileOld;
var compileNew = compile;
exports.compileNew = compileNew;
var build = compile;
exports.build = build;