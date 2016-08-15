"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SitemapBuilder = function () {
    function SitemapBuilder(entries) {
        _classCallCheck(this, SitemapBuilder);

        this.entries = entries;
    }

    _createClass(SitemapBuilder, [{
        key: 'build',
        value: function build() {
            return this.entries.map(function (_ref) {
                var date = _ref.date;
                var lastmod = _ref.pubdate;

                var loc = 'http://blog.bouzuya.net/' + date.replace(/-/g, '/') + '/';
                return { loc: loc, lastmod: lastmod };
            });
        }
    }]);

    return SitemapBuilder;
}();

var SitemapFormatter = function () {
    function SitemapFormatter(sitemap) {
        _classCallCheck(this, SitemapFormatter);

        this.sitemap = sitemap;
    }

    _createClass(SitemapFormatter, [{
        key: 'format',
        value: function format() {
            return ['<?xml version="1.0" encoding="utf-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', this.sitemap.map(this._buildUrl.bind(this)).join('\n'), '</urlset>'].join('');
        }
    }, {
        key: '_buildUrl',
        value: function _buildUrl(url) {
            return ['<url>', '<loc>' + url.loc + '</loc>', '<lastmod>' + url.lastmod + '</lastmod>', '</url>'].join('');
        }
    }]);

    return SitemapFormatter;
}();

var formatSitemap = function formatSitemap(entries) {
    var atom = new SitemapBuilder(entries).build();
    var formatted = new SitemapFormatter(atom).format();
    return formatted;
};
exports.formatSitemap = formatSitemap;