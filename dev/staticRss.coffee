paths = require '../elements/PathsMixin'
moment = require 'moment'
_ = require 'lodash'
config = require '../config'

module.exports = (page) ->
	t 'feed', {xmlns: 'http://www.w3.org/2005/Atom'}, [
		t 'title', {}, config.title
		t 'link', {href: "#{config.baseUrl}atom.xml", rel: 'self'}, ' '
		t 'link', {href: config.baseUrl}, ' '
		t 'updated', {}, moment().format()
		t 'id', {}, config.baseUrl
		t 'author', {}, [
			t 'name', {}, config.author.name
			t 'email', {}, config.author.email
		]
		_.map paths.getAllPosts(), (post, name) ->
			console.log post
			t 'entry', {}, [
				t 'title', {}, post.title
				t 'link', href: config.baseUrl + name, ''
				t 'updated', {}, moment(post.date, 'YYYY-MM-DD').format()
				t 'content', type: 'html', paths.getPostForPath name
			]
		.join ''
	]

t = (name, attributes, content) ->
	attrStr = _.map attributes, (val, key) ->
		key + '=' + '"' + val + '"'
	.join ' '
	if _.isArray content
		content = content.join ''
	"<#{name} #{attrStr}>#{content}</#{name}>"
