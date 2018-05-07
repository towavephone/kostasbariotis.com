import React from 'react';
import GatsbyLink from 'gatsby-link';
import PropTypes from 'prop-types';

const Pagination = ({ prevPath, nextPath, page, pagesSum }) => (
  <header className="header extra-pagination inner text-center">
    <nav className="pagination" role="navigation">
      {prevPath ? (
        <GatsbyLink className="newer-posts" to={prevPath}>
          <span aria-hidden="true">←</span> 上一页
        </GatsbyLink>
      ) : null}
      <span className="page-number">{`第 ${page} 页，共 ${pagesSum} 页`}</span>
      {nextPath ? (
        <GatsbyLink className="older-posts" to={nextPath}>
          下一页 <span aria-hidden="true">→</span>
        </GatsbyLink>
      ) : null}
    </nav>
  </header>
);

Pagination.propTypes = {
  prevPath: PropTypes.string,
  nextPath: PropTypes.string,
  page: PropTypes.number,
  pagesSum: PropTypes.number,
};

export default Pagination;
