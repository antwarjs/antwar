portfinder = require "portfinder"
express = require 'express'
webpack = require 'webpack'
WebpackDevServer = require 'webpack-dev-server'
webpackConfig = require './webpack.config'
http = require 'http'

servers = []

expandPath = (app, appPath) ->
	app.use express.static  __dirname + '/' + appPath
	app.set 'views', __dirname + '/' + appPath
	app.engine 'html', require('ejs').renderFile
	app.get '*', (req, res, next) ->
		url = req.url
		isFile = url.substring(url.lastIndexOf('/') + 1).indexOf('.') > -1	# the last section after '/' contains a dot, assume it has a file ending

		if isFile
			next()
		else
			res.render('index.html')

DevServer = (port, appPath) ->
	devConfigParams = {}
	devConfigParams.entry =
		main: [
			'webpack-dev-server/client?http://localhost:8000'
			'webpack/hot/dev-server'
			'./dev/entry.coffee'
		]

	devConfigParams.plugins = [
		new webpack.HotModuleReplacementPlugin()
	]

	devConfigParams.devtool = "eval"
	devConfigParams.debug = true

	devConfig = webpackConfig devConfigParams

	server = new WebpackDevServer webpack(devConfig),
		contentBase: 'build'
		hot: true
		stats:
			hash: false
			version: false
			assets: false
			cached: false
			colors: true

	expandPath server.app, appPath

	server.listen port, (err, result) ->
		if err
			console.info err

		console.info 'Listening at port ' + port

	server

# dev server
exports.dev = (appPath) ->
	portfinder.getPort (err, port) ->
		servers.push DevServer(port, appPath)
