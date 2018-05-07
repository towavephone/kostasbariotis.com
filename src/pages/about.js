/* global graphql */

import React from 'react';
import PropTypes from 'prop-types';
import Img from 'gatsby-image';

import Separator from './../components/Separator';
import Menu from './../components/Menu';
import MetaTags from './../components/MetaTags';

export default function About({ data }) {
  return (
    <div>
      <MetaTags
        siteUrl={data.site.siteMetadata.siteUrl}
        title={`关于`}
        path={`/about`}
        description={'我是女王控，欢迎来到我的小站'}
        noIndex={false}
        tags=""
      />
      <Menu />
      <section className="blog container about">
        <div className="medium-8 medium-offset-2 large-10 large-offset-1">
          <header className="header">
            <div className="row text-center">
              <Img sizes={data.file.childImageSharp.sizes} className="header-avatar" />
              <h1>我是女王控，欢迎来到我的小站</h1>
            </div>
          </header>
          <Separator />
          <main role="main">
            <div className="row about-section">
              <div className="medium-2 about-section-title">简要介绍</div>
              <div className="medium-10">
                <p>欢迎来到女王控的家！我是一个逗比型青年，初音粉，93老鲜肉，前端、安卓小萌新；</p>
                <p>动漫爱好者，爱好各种动漫，卖萌求抱走；</p>
                <p>博客建于2017年11月15日，兴趣驱使，用于自由地发表言论与分享我想分享的东西。</p>
              </div>
            </div>
            <div className="row about-section">
              <div className="medium-2 about-section-title">开博缘由</div>
              <div className="medium-10">
                <p>在建立改造博客网站的过程中，学习和巩固前端基本知识；</p>
                <p>通过写博客的方式，加深理解，显性化自己的隐性知识；</p>
                <p>共享知识，吸引同好，交流进步。</p>
              </div>
            </div>
            <div className="row about-section">
              <div className="medium-2 about-section-title">博客主题</div>
              <div className="medium-10">
                <p>
                  博客目前使用的是<a
                    target="_blank"
                    rel="nofollow noreferrer noopener"
                    href="https://github.com/kbariotis"
                  >
                    @kbariotis
                  </a>的博客主题，介绍请转<a
                    target="_blank"
                    rel="nofollow noreferrer noopener"
                    href="https://github.com/kbariotis/kostasbariotis.com"
                  >
                    GitHub
                  </a>页面。
                </p>
              </div>
            </div>
            <div className="row about-section">
              <div className="medium-2 about-section-title">欢迎交流</div>
              <div className="medium-10">
                <p>个人邮件及社交网站等信息见边栏底部；</p>
                <p>有什么留言或问题直接在文末留下评论即可。</p>
              </div>
            </div>
          </main>
        </div>
      </section>
    </div>
  );
}

About.propTypes = {
  data: PropTypes.object,
};

export const aboutPageQuery = graphql`
  query AboutPageSiteMetadata {
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
  }
`;
