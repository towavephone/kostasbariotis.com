import React from 'react';
import PropTypes from 'prop-types';
import {
  InstantSearch,
  PoweredBy,
  SearchBox,
  Hits,
  Stats,
  Pagination,
  HitsPerPage,
} from 'react-instantsearch/dom';

import Hit from './Hit';

export default function Search(props) {
  const { algolia } = props;

  return (
    <div>
      {algolia && algolia.appId && (
        <InstantSearch
          appId={algolia.appId}
          apiKey={algolia.searchOnlyApiKey}
          indexName={algolia.indexName}
        >
          <div className="clearfix">
            <SearchBox translations={{ placeholder: '搜索' }} />
            <HitsPerPage
              defaultRefinement={5}
              items={[
                {
                  label: '每页 5 个',
                  value: 5,
                },
                {
                  label: '每页 10 个',
                  value: 10,
                },
                {
                  label: '每页 20 个',
                  value: 20,
                },
                {
                  label: '每页 100 个',
                  value: 100,
                },
              ]}
            />
          </div>
          <Stats />
          <PoweredBy />
          <Hits hitComponent={Hit} />
          <Pagination padding={2} showFirst showLast showNext showPrevious totalPages={3} />
        </InstantSearch>
      )}
    </div>
  );
}

Search.propTypes = {
  algolia: PropTypes.object.isRequired,
};
