paths = require('../paths')
moment = require('moment')
_ = require 'lodash'

module.exports = (page) ->
	t 'feed', {xmlns: 'http://www.w3.org/2005/Atom'}, [
		t 'title', {}, 'eldh.co'
		t 'link', {href: 'http://www.eldh.co/atom.xml', rel: 'self'}, ' '
		t 'link', {href: 'http://www.eldh.co'}, ' '
		t 'updated', {}, moment().format()
		t 'id', {}, 'http://www.eldh.co'
		t 'author', {}, [
			t 'name', {}, 'Andreas Eldh'
			t 'email', {}, 'andreas.eldh@gmail.com'
		]
		_.map paths.allPosts(), (post, name) ->
			t 'entry', {}, [
				t 'title', {}, post.title
				t 'link', href: 'http://www.eldh.co/' + name, ''
				t 'updated', {}, moment(post.published, 'YYYY-MM-DD').format()
				t 'content', type: 'html', paths.postForPath name
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
