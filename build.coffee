fs = require 'fs'
React = require 'react/addons'
mkdirp = require 'mkdirp'
ncp = require 'ncp'
webpack = require 'webpack'
config = require('./webpack.coffee').build

module.exports =

	buildDevIndex: ->
		process.env.NODE_ENV = 'dev'
		webpack config, (err, stats) ->
			if err
				console.log err
			else
				page = require './build/bundleStaticPage.js'
				fs.writeFileSync './build/index.html', page '/antwar_devindex', null
				ncp './assets', './build/assets'


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

				# Copy assets folder
				ncp './assets', assets

				# Copy css
				fs.writeFileSync assets + '/main.css', fs.readFileSync 'build/main.css'

				# Create pages
				allPaths = paths()
				for path of allPaths
					if path isnt 'posts'
						pathObj = allPaths[path]
						if path is '/'
							path = ''
							publicPath = './public'
						else
							path = path
							publicPath = "./public/#{path}"
							mkdirp.sync publicPath
						renderedPage = page "/#{path}", null
						fs.writeFileSync "#{publicPath}/index.html", renderedPage


				# Create the blog folder
				mkdirp.sync 'public/blog'

				# Create the blog index page
				renderedPage = page "/blog", null
				fs.writeFileSync "./public/blog/index.html", renderedPage

				# Create the blog posts
				posts = allPaths.posts
				for post of posts
					item = posts[post]
					fs.writeFileSync 'public/blog/' + post + '.html', page '/blog/' + post
				fs.writeFileSync 'public/atom.xml', rss(page)

