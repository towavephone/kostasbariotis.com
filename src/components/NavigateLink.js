import React from 'react';
import GatsbyLink from 'gatsby-link';
import PropTypes from 'prop-types';

const NavigateLink = ({ post }) =>
  post && (
    <div>
      <GatsbyLink className="navigate-link" to={post.frontmatter.path}>
        {post.frontmatter.title}
      </GatsbyLink>
      <div>{post.frontmatter.date}</div>
      <p className="navigate-desc">{`${post.excerpt}`}</p>
    </div>
  );

NavigateLink.propTypes = {
  post: PropTypes.object,
};

export default NavigateLink;
