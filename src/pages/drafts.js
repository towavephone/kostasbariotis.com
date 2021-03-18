/* global graphql */

import React from 'react';
import PropTypes from 'prop-types';
import GatsbyLink from 'gatsby-link';

import Separator from './../components/Separator';
import Posts from './../components/Posts';
import MetaTags from './../components/MetaTags';

export default function Drafts({ data }) {
  let { edges } = data.allMarkdownRemark;
  let { siteUrl } = data.site.siteMetadata;
  let length = edges.length;
  let [...posts] = edges;
  posts.length = 3;
  posts = posts.map(post => post.node);
  return (
    <div>
      <MetaTags
        siteUrl={siteUrl}
        path={'/drafts'}
        title={`草稿`}
        tags=""
        description={'这些是未完成的草稿页'}
        noIndex={true}
      />
      <section className="blog container">
        <div className="medium-8 medium-offset-2 large-10 large-offset-1">
          <header className="header">草稿</header>
          <p className="drafts-description">这些是未完成的草稿页</p>
          <Separator />
          <div className="posts">
            <Posts posts={posts} />
            <Separator />
            <article className="post text-right">
              <header className="post-head">
                {length > 3 ? (
                  <h3 className="post-title">
                    <GatsbyLink to="/drafts/page/1">阅读更多 &gt;</GatsbyLink>
                  </h3>
                ) : null}
              </header>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}

Drafts.propTypes = {
  data: PropTypes.object,
};

export const pageQuery = graphql`
  query DraftsQuery {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      limit: 4
      filter: { frontmatter: { draft: { eq: true } } }
    ) {
      edges {
        node {
          excerpt(pruneLength: 250)
          id
          frontmatter {
            title
            date(formatString: "YYYY-MM-DD HH:mm:ss")
            path
            tags
            draft
          }
        }
      }
    }
  }
`;
