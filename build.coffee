# Generate info about posts and pages
# postinfo = require './postinfo'
# postinfo.writeFiles()

fs = require 'fs'
React = require 'react/addons'
mkdirp = require 'mkdirp'
# paths = require './paths'
webpack = require 'webpack'
config = require('./webpack.coffee').build
# yaml = require 'js-yaml'
module.exports =

	# writeFiles: postinfo.writeFiles

	buildDevIndex: ->
		process.env.NODE_ENV = 'dev'
		webpack config, (err, stats) ->
			if err
				console.log err
			else
				page = require './build/bundleStaticPage.js'
				fs.writeFileSync "build/index.html", page '/', null

	build: ->
		process.env.NODE_ENV = 'production'
		webpack config, (err, stats) ->
			if err
				console.log err
			else
				assets = 'public/assets'
				page = require './build/bundleStaticPage.js'
				paths = require './build/paths.js'
				rss = require './build/bundleStaticRss.js'
				mkdirp.sync assets
				fs.writeFileSync assets + '/main.css', fs.readFileSync 'build/main.css'
				allPaths = paths()
				for path of allPaths
					if path isnt 'posts'
						pathObj = allPaths[path]
						if path is 'index'
							path = ''
							publicPath = "./public"
						else
							path = path
							publicPath = "./public/#{path}"
							mkdirp.sync publicPath
						renderedPage = page "/#{path}", null
						fs.writeFileSync "#{publicPath}/index.html", renderedPage

				mkdirp.sync 'public/blog'
				posts = allPaths.posts
				for post of posts
					item = posts[post]
					fs.writeFileSync 'public/blog/' + post + '.html', page '/blog/' + post
				fs.writeFileSync 'public/atom.xml', rss(page)

