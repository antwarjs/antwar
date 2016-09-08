const React = require('react');
const SectionLink = require('antwar-core/SectionLink');

const Blog = ({ posts }) => (
  <div>
    <h1>Blog Items</h1>
    <ul>{posts.map((post, i) => (
      <li key={'item-' + i}>
        <h3>
          <SectionLink item={post}>{post.title}</SectionLink>
          {post.isDraft ? <span>Draft</span> : null}
        </h3>

        <span>{post.date}</span>
        <p>{post.preview}</p>
      </li>
    ))}</ul>
  </div>
);

export default Blog;
