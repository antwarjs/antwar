var Moment = require('./Moment.jsx'),
  Paths = require('./PathsMixin'),
  React = require('react'),
  Router = require('react-router');

var Post = React.createClass({

  mixins: [Router.State, Paths],

  render: function() {
    var content = this.getPost(),
      published = this.getPathMeta('published'),
      title = this.getPathMeta('title');
    return (
      <div>
        <header>
          <h1>{title}</h1>
          <Moment datetime={published} />
        </header>
        <span dangerouslySetInnerHTML={{__html: content}} />
      </div>
    );
  }
});

module.exports = Post;
