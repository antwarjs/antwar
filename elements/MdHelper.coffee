_ = require 'lodash'
markdown = require 'commonmark'
mdReader = new markdown.Parser()
mdWriter = new markdown.HtmlRenderer()

getLiteral = (part) ->
  return '' unless part._firstChild? or part._literal?
  part._literal or getLiteral part._firstChild

module.exports =

  render: (content) ->
    if _.isObject content then content = content.__content
    mdWriter.render mdReader.parse content

  parse: (content) ->
    if _.isObject content then content = content.__content
    mdReader.parse content

  getContentPreview: (content) ->
    parsed = getLiteral mdReader.parse content
    if parsed.length > 100 then parsed = parsed.substr(0,100) + '…'
    parsed
