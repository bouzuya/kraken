path = require 'path'

module.exports = class Config
  load: ->
    @_rootDir = process.cwd()
    @_srcDir = path.join @_rootDir, 'src'
    @_postsDir = path.join @_srcDir, '_posts'
    @_dstDir = path.join @_rootDir, 'build'

  rootDir: ->
    @_rootDir

  srcDir: ->
    @_srcDir

  postsDir: ->
    @_postsDir

  dstDir: ->
    @_dstDir
