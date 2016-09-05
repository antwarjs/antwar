var React = require('react');
var Paths = require('antwar-core/PathsMixin');
var Router = require('react-router');
var config = require('config');

var Item = React.createClass({

  mixins: [ Router.State, Paths ],

  render: function() {
    var item = this.getItem()
    var author = item.author ? item.author : config.author.name
    return (
      <div>
        <h1>{item.title}</h1>
        <div>
          {item.isDraft ? <span>Draft</span> : null}
          <div dangerouslySetInnerHTML={{__html: item.content}} />
        </div>
        {item.date}
        {author ? <span>Authored by {author}</span> : null}
      </div>
    );
  }

});

module.exports = Item;
