/* global graphql */

import React from 'react';
import PropTypes from 'prop-types';
import GatsbyLink from 'gatsby-link';
import Img from 'gatsby-image';

import Separator from './../components/Separator';
import Menu from './../components/Menu';
import Posts from './../components/Posts';
import MetaTags from './../components/MetaTags';

import WebPageSchema from '../components/schemas/WebPageSchema';

export default function Index({ data }) {
  let { edges } = data.allMarkdownRemark;
  let { siteUrl, description, author } = data.site.siteMetadata;
  let length = edges.length;
  // 限制首页展示文章
  // 注意此处需深拷贝，否则再次回到首页看不到阅读更多
  let [...posts] = edges;
  posts.length = 3;
  posts = posts.map(post => post.node);
  return (
    <div>
      <WebPageSchema title={author} description={description} url={siteUrl} />
      <MetaTags
        noIndex={false}
        tags=""
        title={'首页'}
        description={description}
        siteUrl={siteUrl}
        path={'/'}
      />
      <Menu />
      <section className="blog container">
        <div className="medium-8 medium-offset-2 large-10 large-offset-1">
          <div className="blog-header">
            <GatsbyLink to="/" className="blog-header__link" itemProp="name">
              <Img
                className="header-avatar blog-header__img"
                alt={author}
                sizes={data.file.childImageSharp.sizes}
              />
            </GatsbyLink>
            <h1>{author}</h1>
            <p className="header-description" dangerouslySetInnerHTML={{ __html: description }} />
          </div>
          <header className="header">最近文章</header>
          <Separator />
          <div className="posts">
            <Posts posts={posts} />
            <Separator />
            <article className="post text-right">
              <header className="post-head">
                <h3 className="post-title">
                  {length > 3 ? <GatsbyLink to="/page/1">阅读更多 &gt;</GatsbyLink> : null}
                </h3>
              </header>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}

Index.propTypes = {
  data: PropTypes.object,
};

export const pageQuery = graphql`
  query IndexQuery {
    file(relativePath: { eq: "avatar.png" }) {
      childImageSharp {
        sizes {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
    site {
      siteMetadata {
        description
        siteUrl
        author
      }
    }
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      limit: 4
      filter: { frontmatter: { draft: { ne: true } } }
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
