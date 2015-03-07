http = require 'http'
path = require 'path'

Promise = require('es6-promise').Promise
portfinder = require 'portfinder'
express = require 'express'
webpack = require 'webpack'

WebpackDevServer = require 'webpack-dev-server'
webpackConfig = require './webpack.config'

devConfig = require('./webpack.coffee').dev;


servers = []
appPath = path.join process.cwd(), './.antwar/build'
expandPath = (app) ->
  app.use express.static  appPath
  app.set 'views', appPath
  app.engine 'html', require('ejs').renderFile
  app.get '*', (req, res, next) ->
    url = req.url
    isFile = url.substring(url.lastIndexOf('/') + 1).indexOf('.') > -1  # the last section after '/' contains a dot, assume it has a file ending

    if isFile
      next()
    else
      res.render('index.html')

DevServer = (port, config) ->
  devConfigParams = {}
  devConfigParams.entry =
    main: [
      'webpack-dev-server/client?http://localhost:8000'
      'webpack/hot/only-dev-server'
      path.join __dirname, './dev/entry.coffee'
    ]

  devConfigParams.plugins = [
    new webpack.HotModuleReplacementPlugin()
  ]

  devConfigParams.devtool = 'eval'
  devConfigParams.debug = true

  return new Promise((resolve, reject) ->
    devConfig(config).then((c) ->
      server = new WebpackDevServer webpack(webpackConfig(devConfigParams, c)),
        contentBase: path.join process.cwd(), './.antwar/build'
        hot: true
        historyApiFallback: true
        stats:
          hash: false
          version: false
          assets: false
          cached: false
          colors: true

      expandPath server.app

      server.listen port, (err, result) ->
        if err
          console.info err

        console.info 'Listening at port ' + port

      server

      resolve()
    ).catch((err) ->
      reject(err)
    )
  )

# dev server
exports.dev = (config) ->
  return new Promise((resolve, reject) ->
    portfinder.getPort (err, port) ->
      if err
        return reject(err)

      servers.push DevServer(port, config)

      resolve()
  )
