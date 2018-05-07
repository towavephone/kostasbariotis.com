import React from 'react';
import PropTypes from 'prop-types';
import GatsbyLink from 'gatsby-link';
import CommaSeparatedTags from './CommaSeparatedTags';

export default function Hit(props) {
  const { hit: post } = props;

  return (
    <article className="posts" key={post.objectID}>
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
  );
}

Hit.propTypes = {
  hit: PropTypes.object.isRequired,
};
