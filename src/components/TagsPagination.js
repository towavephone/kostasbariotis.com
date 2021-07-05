import React from 'react';
import GatsbyLink from 'gatsby-link';
import PropTypes from 'prop-types';

const Pagination = ({ tag, page, pagesSum }) => (
  <header className='header extra-pagination inner text-center'>
    <nav className='pagination clearfix' role='navigation'>
      {page === 2 && (
        <GatsbyLink className='newer-posts' to={`/tag/${tag}/`}>
          <span aria-hidden='true'>←</span> 上一页
        </GatsbyLink>
      )}
      {page > 2 && (
        <GatsbyLink className='newer-posts' to={`/tag/${tag}/page/${page - 1}/`}>
          <span aria-hidden='true'>←</span> 上一页
        </GatsbyLink>
      )}
      <span className='page-number'>{`第 ${page} 页，共 ${pagesSum} 页`}</span>
      {page < pagesSum && (
        <GatsbyLink className='older-posts' to={`/tag/${tag}/page/${page + 1}/`}>
          下一页 <span aria-hidden='true'>→</span>
        </GatsbyLink>
      )}
    </nav>
  </header>
);

Pagination.propTypes = {
  tag: PropTypes.string,
  page: PropTypes.number,
  pagesSum: PropTypes.number
};

export default Pagination;
