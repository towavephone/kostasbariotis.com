/* global graphql */
import React from 'react';
import PropTypes from 'prop-types';

import Separator from './../components/Separator';
import MetaTags from './../components/MetaTags';
import SearchComponent from './../components/Search';
export default function Search({ data }) {
  return (
    <div>
      <MetaTags
        siteUrl={data.site.siteMetadata.siteUrl}
        path={'/search'}
        title={`搜索`}
        description={'搜索'}
        noIndex={false}
        tags=""
      />
      <section className="blog container about search">
        <div className="medium-8 medium-offset-2 large-10 large-offset-1">
          <header className="header">
            <div className="row text-center">
              <h3>文章搜索</h3>
            </div>
          </header>
          <Separator />
          <main role="main">
            <SearchComponent algolia={data.site.siteMetadata.algolia} />
          </main>
        </div>
      </section>
    </div>
  );
}

Search.propTypes = {
  data: PropTypes.object,
};

export const searchPageQuery = graphql`
  query searchPageSiteMetadata {
    site {
      siteMetadata {
        siteUrl
        algolia {
          appId
          searchOnlyApiKey
          indexName
        }
      }
    }
    file(relativePath: { eq: "avatar.png" }) {
      childImageSharp {
        sizes {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
  }
`;
