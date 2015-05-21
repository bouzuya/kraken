{Promise} = require 'es6-promise'

eachSeries = (arr, f) ->
  arr.reduce (promise, item) ->
    promise.then ->
      f item
  , Promise.resolve()

mapSeries = (arr, f) ->
  arr.reduce (promise, item) ->
    promise.then (results) ->
      results.concat [f item]
  , Promise.resolve []

waterfall = (fs) ->
  fs.reduce (promise, f) =>
    promise.then a.bind @
  , Promise.resolve()

module.exports.eachSeries = eachSeries
module.exports.mapSeries = mapSeries
module.exports.waterfall = waterfall
