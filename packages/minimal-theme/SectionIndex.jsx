var React = require('react');
var Router = require('react-router');
var Paths = require('antwar-core/PathsMixin');
var SectionLink = require('antwar-core/SectionLink');
var _ = require('lodash');

var Link = Router.Link;

var Blog = React.createClass({

  mixins: [ Router.State, Paths ],
  render: function() {
    var items = _.map(_.sortBy(this.getAllItems(), 'date').reverse(), function(item, i) {
      return <li key={'item-' + i}>
        <h3>
          <SectionLink item={item}>{item.title}</SectionLink>
          {item.isDraft ? <span>Draft</span> : null}
        </h3>

        <span>{item.date}</span>
        <p>{item.preview}</p>
      </li>
    });
    return (
      <div>
        <h1>Blog Items</h1>
        <ul>{items}</ul>
      </div>
    );
  }

});

module.exports = Blog;
