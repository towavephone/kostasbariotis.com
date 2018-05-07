import React from 'react';
import PropTypes from 'prop-types';
import {
  InstantSearch,
  PoweredBy,
  SearchBox,
  Hits,
  Stats,
  Pagination,
} from 'react-instantsearch/dom';

import Hit from './Hit';

export default function Search(props) {
  const { algolia } = props;

  return (
    <div>
      {algolia &&
        algolia.appId && (
          <InstantSearch
            appId={algolia.appId}
            apiKey={algolia.searchOnlyApiKey}
            indexName={algolia.indexName}
          >
            <SearchBox translations={{ placeholder: '搜索' }} />
            <Stats />
            <PoweredBy />
            <Hits hitComponent={Hit} />
            <Pagination />
          </InstantSearch>
        )}
    </div>
  );
}

Search.propTypes = {
  algolia: PropTypes.object.isRequired,
};
