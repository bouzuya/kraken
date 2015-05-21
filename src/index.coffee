Kraken = require './kraken'

module.exports = ->
  new Kraken().run()
  .catch (e) ->
    console.error e
