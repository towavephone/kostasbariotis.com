/* global graphql */
import React from 'react';
import PropTypes from 'prop-types';

import Separator from './../components/Separator';
import MetaTags from './../components/MetaTags';
import TagsComponent from './../components/TagsComponent';

export default function Tags({ data }) {
  const edges = data.allMarkdownRemark && data.allMarkdownRemark.edges;

  const tags = {};

  edges.forEach(({ node }) => {
    if (node.frontmatter.tags) {
      node.frontmatter.tags.split(', ').forEach(tag => {
        if (!tags[tag]) {
          tags[tag] = 1;
        } else {
          tags[tag]++;
        }
      });
    }
  });

  const tagsArr = [];
  Object.keys(tags).forEach(tagName => {
    tagsArr.push({ size: tags[tagName], tagName });
  });

  tagsArr.sort(function(a, b) {
    return b.size - a.size;
  });

  return (
    <div>
      <MetaTags
        siteUrl={data.site.siteMetadata.siteUrl}
        path={'/tags'}
        title={`标签`}
        description={'标签'}
        noIndex={false}
        tags=""
      />
      <section className="blog container about tags">
        <div className="medium-8 medium-offset-2 large-10 large-offset-1 post-meta">
          <header className="header">
            <div className="row text-center">
              <h1>文章标签</h1>
            </div>
          </header>
          <Separator />
          <main role="main">
            <TagsComponent tags={tagsArr} />
          </main>
        </div>
      </section>
    </div>
  );
}

Tags.propTypes = {
  data: PropTypes.object,
};

export const tagsPageQuery = graphql`
  query tagsPageSiteMetadata {
    site {
      siteMetadata {
        siteUrl
      }
    }
    file(relativePath: { eq: "avatar.png" }) {
      childImageSharp {
        sizes {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      limit: 1000
      filter: { frontmatter: { draft: { ne: true } } }
    ) {
      edges {
        node {
          frontmatter {
            tags
          }
        }
      }
    }
  }
`;
