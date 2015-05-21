Config = require './config'
Compiler = require './compiler'

module.exports = class Kraken
  constructor: ->
    @_config = new Config()
    @_config.load()
    srcDir = @_config.srcDir()
    postsDir = @_config.postsDir()
    dstDir = @_config.dstDir()
    @_compiler = new Compiler { srcDir, postsDir, dstDir }

  run: ->
    @_compiler.compile()
