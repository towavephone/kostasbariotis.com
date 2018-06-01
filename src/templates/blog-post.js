import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GatsbyLink from 'gatsby-link';
import {
    FacebookShareButton,
    GooglePlusShareButton,
    TwitterShareButton,
    RedditShareButton,
} from 'react-share';
import Img from 'gatsby-image';
import BulletListTags from '../components/BulletListTags';
import NavigateLink from '../components/NavigateLink';
import Separator from '../components/Separator';
import MetaTags from '../components/MetaTags';
import Gitalk from 'gitalk';
import ArticleSchema from '../components/schemas/ArticleSchema';
import { events, query as domQuery } from 'dom-helpers';
import { throttle } from 'lodash';
import Icon from '../components/Icon';
import cx from 'classnames';

export default class Template extends Component {
    constructor(props) {
        super(props);
        this.isProduction = process.env.NODE_ENV === 'production';
        this.state = {
            collapse: false,
            collapseFirst: true,
            transparent: true,
            anchors: [],
        }
        this._handleScroll = throttle(this.handleScroll, 200);
    }

    componentDidMount() {
        if (this.isProduction) {
            const { mainPost: post } = this.props.data;
            const gitalk = new Gitalk({
                clientID: 'c6d8d75c91d5c0cfa42d',
                clientSecret: 'b8e5e295b87b062e292978826729dc7178187fbe',
                repo: 'GatsbyBlog',
                admin: ['towavephone'],
                owner: 'towavephone',
                id: post.frontmatter.path,
                title: post.frontmatter.title,
                body: post.frontmatter.path + post.excerpt,
                distractionFreeMode: true,
                createIssueManually: false,
            });
            gitalk.render('gitalk-container');
        }
        // 监听滚动事件
        events.on(window.document, 'scroll', this._handleScroll);
        events.on(window, 'hashchange', this.handleHashChange);
        const hash = decodeURIComponent(window.location.hash);
        if (hash) this.props.scrollTo(hash);
    }
    componentWillUnmount() {
        events.off(window.document, 'scroll', this._handleScroll);
        events.off(window, 'hashchange', this.handleHashChange);

        this.props.enableHideHeader(true);
    }
    handleHashChange = () => {
        const hash = decodeURIComponent(window.location.hash);

        if (hash) this.props.scrollTo(hash);
    }
    // 滚动事件
    handleScroll = e => {
        const scrollTop = domQuery.scrollTop(e ? e.target : window);
        const height = window.innerHeight;
        const { transparent, anchors } = this.state;
        const contentToTop = document.getElementsByClassName('separator')[0].offsetTop + 220;
        if (scrollTop > contentToTop && transparent) {
            this.setState({ transparent: false });
        }

        if (scrollTop <= contentToTop && !transparent) {
            this.setState({ transparent: true, collapse: false});
        }

        // 滚动位置检测
        let index = 0;

        anchors.forEach((anchor, idx) => {
            const { top, anchor: a } = anchor;

            if (idx === index) {
                if (scrollTop > top - 60) {
                    index++;
                } else {
                    index--;
                }
            }

            a.classList.remove('active');
        })

        if (anchors.length > 0) {
            if (index <= 0) {
                // 取第一个
                anchors[0].anchor.classList.add('active');
            } else if (index >= anchors.length) {
                // 取最后一个
                anchors[anchors.length - 1].anchor.classList.add('active');
            } else {
                anchors[index].anchor.classList.add('active');
            }
        }
    }
    // 处理目录，获取一些数据信息
    dealWithCategory(cb) {
        const scrollTop = domQuery.scrollTop(window);
        const anchorList = this.$category.querySelectorAll('a');
        const anchors = [];

        for (let i = 0, len = anchorList.length; i < len; i++) {
            const anchor = anchorList[i];
            const { hash } = anchor;
            const hashValue = hash[0] === '#' ? hash : `#${hash}`;
            const id = decodeURIComponent(hashValue.slice(1));
            const rect = document.getElementById(id).getBoundingClientRect();

            events.on(anchor, 'click', e => {
                e.preventDefault();

                if (history.pushState) {
                    history.pushState(null, null, hashValue);

                    this.props.scrollTo(id);
                } else {
                    window.location.hash = hashValue;
                }

                return false;
            })

            anchors.push({
                id,
                hash: hashValue,
                top: rect.top + scrollTop,
                anchor,
            })
        }

        this.setState({ anchors }, cb);
    }
    // 切换侧边栏
    handleToggleCollapse = () => {
        if (!this.state.collapse) {
            this.props.enableHideHeader(false);
        } else {
            this.props.enableHideHeader(true);
        }

        if (this.state.collapseFirst) {
            this.dealWithCategory(this._handleScroll);
        }

        this.setState({
            collapse: !this.state.collapse,
            collapseFirst: false,
        });
    }
    render() {
        const { data } = this.props;
        const { mainPost: post } = data;
        const { nextPost: next } = data;
        const { siteUrl } = data.site.siteMetadata;
        const fullUrl = `${siteUrl}${post.frontmatter.path}`;
        const {
            collapse,
            transparent,
        } = this.state
        return (
            <div>
                <ArticleSchema
                    authorName={`女王控`}
                    title={`${post.frontmatter.title}`}
                    description={post.excerpt}
                    date={post.frontmatter.date}
                />
                <MetaTags
                    title={`${post.frontmatter.title}`}
                    description={post.excerpt}
                    tags={post.frontmatter.tags}
                    path={post.frontmatter.path}
                    siteUrl={siteUrl}
                    noIndex={post.frontmatter.draft}
                />
                <main className={cx({ 'blog container': true, 'collapse-catalog':collapse })}  role="main">
                    <div className="medium-8 medium-offset-2 large-10 large-offset-1 post">
                        <header className="post-head">
                            <h1 className="post-title">{post.frontmatter.title}</h1>
                        </header>
                        <section className="post-meta">
                            <div className="row">
                                <div className="medium-4">
                                    <ul className="list-inline">
                                        <li>
                                            <GatsbyLink to="/" className="author-avatar" itemProp="name">
                                                <Img sizes={data.file.childImageSharp.sizes} />
                                            </GatsbyLink>
                                        </li>
                                        <li>
                                            <div className="author-name">女王控</div>
                                            <time className="post-date" dateTime={post.frontmatter.date}>
                                                {post.frontmatter.date}
                                            </time>
                                        </li>
                                    </ul>
                                </div>
                                <div className="medium-offset-3 medium-5" style={{ textAlign: 'right' }}>
                                    <BulletListTags tags={post.frontmatter.tags} draft={post.frontmatter.draft} />
                                    <div className="timeSize">
                                        阅读时间：{post.timeToRead}分钟 文章字数：{post.wordCount.words}字
                                    </div>
                                </div>
                            </div>
                        </section>
                        <Separator />
                        <article className="main-post">
                            <section className="post-content" dangerouslySetInnerHTML={{ __html: post.html }} />
                            <Separator />
                            <footer className="post-footer">
                                <section className="share text-center">
                                    {!post.frontmatter.draft ? (
                                        <ul className="share-buttons list-inline">
                                            <li>
                                                <b>分享到</b>
                                            </li>
                                            <li className="link-twitter">
                                                <TwitterShareButton
                                                    url={fullUrl}
                                                    title={post.frontmatter.title}
                                                    via="kbariotis"
                                                    className="share-twitter"
                                                >
                                                    <span>Twitter</span>
                                                </TwitterShareButton>
                                            </li>
                                            <li className="link-facebook">
                                                <FacebookShareButton url={fullUrl} className="share-facebook">
                                                    <span>Facebook</span>
                                                </FacebookShareButton>
                                            </li>
                                            <li className="link-google-plus">
                                                <GooglePlusShareButton url={fullUrl} className="share-google-plus">
                                                    <span>Google+</span>
                                                </GooglePlusShareButton>
                                            </li>
                                            <li className="link-reddit" title={post.frontmatter.title}>
                                                <RedditShareButton url={fullUrl} className="share-reddit">
                                                    <span>Reddit</span>
                                                </RedditShareButton>
                                            </li>
                                        </ul>
                                    ) : (
                                            <small>这是草稿页，默认分享关闭</small>
                                        )}
                                </section>
                            </footer>

                            <section className="blog-section">
                                {this.isProduction && (
                                    <div>
                                        <header className="header">
                                            <h2>评论</h2>
                                        </header>
                                        <div id="gitalk-container" />
                                    </div>
                                )}
                            </section>

                            <section className="blog-section">
                                {next ? (
                                    <header className="header">
                                        <h2>阅读下一章</h2>
                                    </header>
                                ) : null}
                                <NavigateLink post={next} />
                            </section>
                        </article>
                    </div>
                    <div className={cx({ headings: true, fixed: !transparent })}>
                        <div className="index-title">目录</div>
                        <div
                            ref={el => (this.$category = el)}
                            className="index-list"
                            dangerouslySetInnerHTML={{ __html: post.tableOfContents }}
                        />
                    </div>
                    <div
                        className={cx({ 'collapse-icon': true, show: !transparent })}
                        onClick={this.handleToggleCollapse}
                    >
                        <Icon
                            type={collapse ? 'cross' : 'text-document'}
                            style={{ color: '#fff', fontSize: '24px' }}
                        />
                    </div>
                </main>
            </div>
        );
    }
}

Template.propTypes = {
    data: PropTypes.object,
    scrollTo: PropTypes.func,
};

export const pageQuery = graphql`
  query BlogPostByPath($mainPostPath: String!, $nextPostPath: String!) {
    file(relativePath: { eq: "avatar.png" }) {
      childImageSharp {
        sizes {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
    site {
      siteMetadata {
        title
        description
        siteUrl
      }
    }
    mainPost: markdownRemark(frontmatter: { path: { eq: $mainPostPath } }) {
      html
      excerpt
      timeToRead
      tableOfContents
      wordCount {
        words
      }
      frontmatter {
        date(formatString: "YYYY-MM-DD HH:mm:ss")
        path
        tags
        title
        draft
      }
    }
    nextPost: markdownRemark(frontmatter: { path: { eq: $nextPostPath } }) {
      html
      excerpt
      frontmatter {
        date(formatString: "YYYY-MM-DD HH:mm:ss")
        path
        tags
        title
        draft
      }
    }
  }
`;
