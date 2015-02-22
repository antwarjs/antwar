gulp = require('gulp')
util = require('gulp-util')
fileserver = require('./fileserver.coffee')
fs = require 'fs'
build = require './build'

logExit = (error) ->
	util.log util.colors.red(error)
	process.exit 1
	return

logContinue = (error) ->
	if skipWatch is 'true'
		logExit error
	else
		util.log util.colors.red error
		@emit? 'end'
	return

gulp.task 'default', ['dev']

gulp.task 'dev', ['buildDevIndex'], ->
	fileserver.dev 'build'

gulp.task 'buildDevIndex', ->
	build.buildDevIndex()

# gulp.task 'yaml', ->
# 	build.getFrontMatter()

gulp.task 'build', ->
	build.build()

# gulp.task 'files',  ->
# 	build.writeFiles()
