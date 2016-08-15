"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AtomBuilder = function () {
    function AtomBuilder(entries) {
        _classCallCheck(this, AtomBuilder);

        this.entries = entries;
    }

    _createClass(AtomBuilder, [{
        key: 'build',
        value: function build() {
            var entries = this._buildAtomEntries();
            var updated = typeof entries[0] === 'undefined' ? '' : entries[0].updated;
            var atom = {
                title: 'blog.bouzuya.net',
                linkHref: 'http://blog.bouzuya.net/',
                updated: updated,
                id: 'http://blog.bouzuya.net/',
                author: { name: 'bouzuya' },
                entries: entries
            };
            return atom;
        }
    }, {
        key: '_buildAtomEntries',
        value: function _buildAtomEntries() {
            return this.entries.sort(function (_ref, _ref2) {
                var a = _ref.pubdate;
                var b = _ref2.pubdate;

                return a === b ? 0 : a < b ? 1 : -1;
            }).filter(function (_, index) {
                return index < 20;
            }).map(function (entry) {
                var url = 'http://blog.bouzuya.net/' + entry.date.replace(/-/g, '/') + '/';
                var atomEntry = {
                    title: entry.title,
                    linkHref: url,
                    updated: entry.pubdate,
                    id: url,
                    content: entry.html
                };
                return atomEntry;
            });
        }
    }]);

    return AtomBuilder;
}();

var AtomFormatter = function () {
    function AtomFormatter(atom) {
        _classCallCheck(this, AtomFormatter);

        this.atom = atom;
    }

    _createClass(AtomFormatter, [{
        key: 'format',
        value: function format() {
            var atom = this.atom;
            return ['<?xml version= "1.0" encoding= "utf-8" ?>', '<feed xmlns="http://www.w3.org/2005/Atom">', '<title>' + this._escapeHtml(atom.title) + '</title>', '<link rel="alternate" type="text/html" href="' + atom.linkHref + '" />', '<updated>' + atom.updated + '</updated>', '<id>' + atom.id + '</id>', '<author><name>' + atom.author.name + '</name></author>', atom.entries.map(this._buildEntry.bind(this)).join('\n'), '</feed>'].join('');
        }
    }, {
        key: '_buildEntry',
        value: function _buildEntry(entry) {
            return ['<entry>', '<title>' + this._escapeHtml(entry.title) + '</title>', '<link href= "' + entry.linkHref + '" />', '<updated>' + entry.updated + '</updated>', '<id>' + entry.id + '</id>', '<content type= "html">' + this._escapeHtml(entry.content) + '</content>', '</entry>'].join('');
        }
    }, {
        key: '_escapeHtml',
        value: function _escapeHtml(html) {
            return html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
        }
    }]);

    return AtomFormatter;
}();

var formatAtom = function formatAtom(entries) {
    var atom = new AtomBuilder(entries).build();
    var formatted = new AtomFormatter(atom).format();
    return formatted;
};
exports.formatAtom = formatAtom;