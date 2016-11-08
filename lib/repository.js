"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Repository = function () {
    function Repository(dir, listEntryIds, parse) {
        _classCallCheck(this, Repository);

        this._dir = dir;
        this._ids = listEntryIds(dir);
        this._parse = parse;
    }

    _createClass(Repository, [{
        key: 'each',
        value: function each(f) {
            var _this = this;

            this._ids.forEach(function (id) {
                return f(_this._parse(_this._dir, id));
            });
        }
    }, {
        key: 'findAll',
        value: function findAll() {
            var _this2 = this;

            return this._ids.map(function (id) {
                return _this2._parse(_this2._dir, id);
            });
        }
    }, {
        key: 'findBy',
        value: function findBy(query) {
            var _this3 = this;

            return this._ids.filter(function (_ref) {
                var year = _ref.year;
                var month = _ref.month;

                var y = typeof query.year === 'undefined' || year === query.year;
                var m = typeof query.month === 'undefined' || month === query.month;
                return y && m;
            }).map(function (id) {
                return _this3._parse(_this3._dir, id);
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
            return this._ids.reduce(function (ys, _ref3) {
                var year = _ref3.year;

                return ys.some(function (y) {
                    return y === year;
                }) ? ys : ys.concat([year]);
            }, []);
        }
    }]);

    return Repository;
}();

exports.Repository = Repository;