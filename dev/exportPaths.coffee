paths = require '../paths'
_ = require 'lodash'

module.exports = -> _.assign {}, paths.allPages(), { posts: paths.allPosts() }
