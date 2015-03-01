path = require 'path'
ReactHotLoaderMatches = /View.coffee|Pages\//
ExtractTextPlugin = require 'extract-text-webpack-plugin'

common =

	resolve:
		alias: 'underscore': 'lodash'
		extensions: [
			''
			'.webpack.js'
			'.web.js'
			'.js'
			'.coffee'
			'.json'
		]
		modulesDirectories: [
			'node_modules'
			'scripts'
			'web_modules'
		]
	jshint:
		bitwise: false
		boss: true
		curly: false
		eqnull: true
		expr: true
		newcap: false
		quotmark: false
		shadow: true
		strict: false
		sub: true
		undef: true
		unused: 'vars'


dev =
	cache: true
	node: __filename: true
	output:
		path: path.join(__dirname, 'build/')
		publicPath: '/'
		filename: '[name]-bundle.js'
		chunkFilename: '[chunkhash].js'
	plugins: []
	module: loaders: [
			test: /\.woff$/
			loader: 'url-loader?prefix=font/&limit=5000&mimetype=application/font-woff'
		,
			test: /\.ttf$|\.eot$/
			loader: 'file-loader?prefix=font/'
		,
			test: /\.coffee$/
			exclude: ReactHotLoaderMatches
			loader: 'react-hot!jshint-loader!coffee-loader'
		,
			test: /\.json$/
			loader: 'json-loader'
		,
			test: /\.svg$/
			loader: 'raw-loader'
		,
			test: /\.jsx$/
			loader: 'jsx'
		,
			test: /\.css$/
			loaders: [
				'style-loader'
				'css-loader'
			]
		,
			test: /\.scss$/
			loaders: [
				'style-loader'
				'css-loader'
				'autoprefixer-loader?{browsers:["last 2 version", "ie 10", "Android 4"]}'
				'sass-loader'
			]
		,
			test: ReactHotLoaderMatches
			loader: 'react-hot!coffee-loader'
		,
			test: /\.md$/
			loader: 'json!yaml-frontmatter-loader'
	]
	resolve: common.resolve
	jshint: common.jshint

build =
	name: 'server'
	target: 'node'
	context: path.join __dirname, './'
	entry:
		bundlePage: './dev/page.coffee'
		bundleStaticRss: './dev/staticRss.coffee'
		bundleStaticPage: './dev/staticPage.coffee'
		paths: './dev/exportPaths.coffee'
	output:
		path: path.join process.cwd(), './.antwar/build'
		filename: '[name].js'
		publicPath: path.join process.cwd(), './.antwar/build'
		libraryTarget: 'commonjs2'
	plugins: [ new ExtractTextPlugin('main.css', allChunks: true) ]
	resolve: common.resolve
	module: loaders: [
			test: /\.scss$/
			loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer-loader?{browsers:["last 2 version", "ie 10", "Android 4"]}!sass-loader')
		,
			test: /\.jsx$/
			loader: 'jsx'
		,
			test: /\.coffee$/
			loader: 'coffee-loader'
		,
			test: /\.html$/
			loader: 'raw'
		,
			test: /\.md$/
			loader: 'json!yaml-frontmatter-loader'
	]
	jshint: common.jshint
module.exports = {
	dev
	build
}
