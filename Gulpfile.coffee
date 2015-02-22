gulp = require 'gulp'
fileserver = require './fileserver.coffee'
publicServer = require './publicServer'
build = require './build'

gulp.task 'default', ['dev']

gulp.task 'dev', ['buildDevIndex'], ->
	fileserver.dev 'build'

gulp.task 'buildDevIndex', ->
	build.buildDevIndex()

gulp.task 'build', ->
	build.build()

gulp.task 'publicServer', ->
	publicServer.run()
