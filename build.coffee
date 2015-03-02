fs = require 'fs'
React = require 'react/addons'
mkdirp = require 'mkdirp'
ncp = require 'ncp'
webpack = require 'webpack'
webpackConfig = require('./webpack.coffee').build
pathModule = require 'path'

module.exports =

	buildDevIndex: (config) ->
		process.env.NODE_ENV = 'dev'
		webpack webpackConfig, (err, stats) ->
			if err
				console.log err
			else
				page = require pathModule.join process.cwd(), './.antwar/build/bundleStaticPage.js'
				fs.writeFileSync pathModule.join(process.cwd(), './.antwar/build/index.html'), page '/antwar_devindex', null
				ncp './assets', pathModule.join process.cwd(), './.antwar/build/assets'


	build: (config) ->
		process.env.NODE_ENV = 'production'
		webpack webpackConfig, (err, stats) ->
			if err
				console.log err
			else
				assets = pathModule.join process.cwd(), './public/assets'
				page = require pathModule.join process.cwd(), './.antwar/build/bundleStaticPage.js'
				paths = require pathModule.join process.cwd(), './.antwar/build/paths.js'
				rss = require pathModule.join process.cwd(), './.antwar/build/bundleStaticRss.js'
				mkdirp.sync assets

				# Copy assets folder
				ncp pathModule.join(process.cwd(), './assets'), assets

				# Copy css
				fs.writeFileSync assets + '/main.css', fs.readFileSync './.antwar/build/main.css'

				# Create pages
				allPaths = paths()
				for path of allPaths
					if path isnt 'posts'
						pathObj = allPaths[path]
						if path is '/'
							path = ''
							publicPath = pathModule.join process.cwd(), './public'
						else
							path = path
							publicPath = pathModule.join process.cwd(), "./public/#{path}"
							mkdirp.sync publicPath
						renderedPage = page "/#{path}", null
						fs.writeFileSync "#{publicPath}/index.html", renderedPage


				# Create the blog folder
				mkdirp.sync pathModule.join process.cwd(), './public/blog'

				# Create the blog index page
				renderedPage = page "/blog", null
				fs.writeFileSync pathModule.join(process.cwd(), "./public/blog/index.html"), renderedPage

				# Create the blog posts
				posts = allPaths.posts
				for post of posts
					item = posts[post]
					fs.writeFileSync pathModule.join(process.cwd(), './public/blog/' + post + '.html'), page '/blog/' + post
				fs.writeFileSync pathModule.join(process.cwd(), './public/atom.xml'), rss(page)

