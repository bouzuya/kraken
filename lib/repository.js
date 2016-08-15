"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var parse_1 = require('./parse');

var Repository = function () {
    function Repository(dir) {
        var type = arguments.length <= 1 || arguments[1] === undefined ? 'default' : arguments[1];

        _classCallCheck(this, Repository);

        this._entries = parse_1.listEntryIds(dir).map(function (id) {
            return parse_1.parseEntry(type, dir, id);
        });
    }

    _createClass(Repository, [{
        key: 'findAll',
        value: function findAll() {
            return this._entries;
        }
    }, {
        key: 'findBy',
        value: function findBy(query) {
            return this._entries.filter(function (_ref) {
                var _ref$id = _ref.id;
                var year = _ref$id.year;
                var month = _ref$id.month;

                var y = typeof query.year === 'undefined' || year === query.year;
                var m = typeof query.month === 'undefined' || month === query.month;
                return y && m;
            });
        }
    }, {
        key: 'getMonths',
        value: function getMonths(year) {
            return this.findBy({ year: year }).reduce(function (ms, _ref2) {
                var month = _ref2.id.month;

                return ms.some(function (m) {
                    return m === month;
                }) ? ms : ms.concat([month]);
            }, []);
        }
    }, {
        key: 'getYears',
        value: function getYears() {
            return this._entries.reduce(function (ys, _ref3) {
                var year = _ref3.id.year;

                return ys.some(function (y) {
                    return y === year;
                }) ? ys : ys.concat([year]);
            }, []);
        }
    }]);

    return Repository;
}();

exports.Repository = Repository;