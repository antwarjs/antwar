fs = require 'fs'
_ = require 'lodash'
# Wrap the io functions with ones that return promises.

writeFiles = ->
	fs.writeFileSync './dev/posts.js', "module.exports = #{JSON.stringify posts()};"
	fs.writeFileSync './dev/pages.js', "module.exports = #{JSON.stringify pages()};"

posts = ->
	# dir = './react-static-site/posts'
	dir = './posts'
	files = fs.readdirSync dir, 'utf8'
	obj = {}
	for file in files
		md = file
		url = _.kebabCase file.slice 11, file.length - 3
		date = file.slice 0, 10
		title = _.capitalize url.replace /\-/g , ' '
		obj[url] =
			{
				url
				md
				date
				title
			}
	obj

pages = ->
	dir = './pages'
	files = fs.readdirSync dir, 'utf8'
	obj = {}
	for file in files
		fileName = file
		url = _.kebabCase file.split('.')[0]
		title = _.capitalize url.replace /\-/g , ' '
		name = '' + url
		obj[url] =
			{
				name
				url
				fileName
				title
			}
	obj
module.exports = {
	writeFiles
	posts
	pages
}
