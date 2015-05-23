path = require 'path'

module.exports = class Config
  load: ->
    @_rootDir = process.cwd()
    @_postsDir = path.join @_rootDir, 'data'
    @_dstDir = path.join @_rootDir, 'dist'

  rootDir: ->
    @_rootDir

  postsDir: ->
    @_postsDir

  dstDir: ->
    @_dstDir
