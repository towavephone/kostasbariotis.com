import React from 'react';
import GatsbyLink from 'gatsby-link';
import PropTypes from 'prop-types';

const Tags = ({ tags }) => (
  <ul className='tags list-inline text-center'>
    {tags &&
      tags.map((obj) => (
        <li key={obj.tagName}>
          <GatsbyLink to={`/tag/${obj.tagName}/`}>
            {obj.tagName}({obj.size})
          </GatsbyLink>
        </li>
      ))}
  </ul>
);

Tags.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.object)
};

export default Tags;
