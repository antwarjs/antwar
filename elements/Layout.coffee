React = require 'react'
Router = require 'react-router'
RouteHandler = React.createFactory Router.RouteHandler
Paths = require './PathsMixin'
config = require 'config'

{ html, head, body, div, title, script, link, main, meta } = require 'react-coffee-elements'

module.exports = (Body) ->
  return React.createClass
    displayName: 'Layout'

    mixins: [ Router.State, Paths ]

    render: ->
      pageTitle = @getPageTitle()
      html {},
        head {},
          title "#{if pageTitle then pageTitle +  ' / ' else ''}#{config.siteName}"
          meta
            name:'viewport'
            content:'width=device-width, initial-scale=1, maximum-scale=1, minimal-ui'
          link
            rel: 'alternate'
            type: 'application/atom+xml'
            title: config.siteName
            href: '/atom.xml'
          if process.env.NODE_ENV is 'production'
            link
              rel: 'stylesheet'
              href: '/assets/main.css'
        body {},
          Body {}, RouteHandler()
          if process.env.NODE_ENV isnt 'production'
            script src: '/main-bundle.js'
