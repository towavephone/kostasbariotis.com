import React from 'react';
import GatsbyLink from 'gatsby-link';
import PropTypes from 'prop-types';

import CommaSeparatedTags from './CommaSeparatedTags';

const Posts = ({ posts }) => (
  <div>
    {posts.filter(post => post.frontmatter.title.length > 0).map((post, index) => (
      <article className="post" key={index}>
        <header className="post-head">
          <h1 className="post-title">
            <GatsbyLink to={post.frontmatter.path}>{post.frontmatter.title}</GatsbyLink>
          </h1>
        </header>
        <time className="post-date" dateTime={post.frontmatter.date}>
          {post.frontmatter.date}
        </time>
        <section className="post-excerpt">
          <p>
            {post.excerpt} <GatsbyLink to={post.frontmatter.path}>&raquo;</GatsbyLink>
          </p>
        </section>
        <footer className="post-meta">
          <CommaSeparatedTags tags={post.frontmatter.tags} />
        </footer>
      </article>
    ))}
  </div>
);

Posts.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object),
};

export default Posts;
