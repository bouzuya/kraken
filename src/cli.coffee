fs = require 'fs'
commander = require 'commander-b'
kraken = require './'

module.exports = class CLI
  run: ->
    pkg = fs.readFileSync __dirname + '/../package.json'
    commander 'kraken'
    .version JSON.parse(pkg).version
    .action -> kraken()
    .execute()
