/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import '../scss/boot.scss';

import Footer from '../components/Footer';
import { events, query as domQuery } from 'dom-helpers';
import { throttle } from 'lodash';
import { scrollTop, isMobile, isEmptyObject } from '../utils/common';
import Icon from '../components/Icon';
import cx from "classnames";
// layouts/index.js
export default class IndexLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menu: false,
            header: true,
            enableHideHeader: true,
            transparent: true,
            scale: 1,
            cover: '',
            title: '',
            progress: 0,
        };
        if (typeof window !== 'undefined') {
            this.smoothScroll = window.smoothScroll;
        }
        this.lastScrollTop = 0;
        this._handleScroll = throttle(this.handleScroll, 200)
    }
    componentDidMount() {
        events.on(window.document, 'scroll', this._handleScroll)
        this.handleScroll({ target: window.document.body })
    }

    componentWillUnmount() {
        events.off(window.document, 'scroll', this._handleScroll)
        this.smoothScroll.destroy()
    }
    // 滚动事件
    handleScroll = e => {
        const scrollTop = domQuery.scrollTop(e.target)
        const scrollHeight =
            window.document.documentElement.scrollHeight ||
            window.document.body.scrollHeight
        const height = window.innerHeight
        const { transparent, progress } = this.state
        const scrollDirection = scrollTop > this.lastScrollTop
        const scrollDistance = Math.abs(scrollTop - this.lastScrollTop)
        const state = {}

        this.lastScrollTop = scrollTop

        if (scrollTop <= height) {
            state.scale = 1 + scrollTop / (2 * height)
        }

        if (scrollTop >= height - 192) {
            if (scrollDirection && scrollDistance >= 20 && this.state.header) {
                // 向下滚动，影藏 header
                state.header = false
            }

            if (!scrollDirection && scrollDistance >= 20 && !this.state.header) {
                // 向上滚动，显示 header
                state.header = true
            }

            if (transparent) {
                state.transparent = false
            }

            state.progress = (
                (scrollTop - height + 192) /
                (scrollHeight - height + 192 - height) *
                100
            ).toFixed(0)
        }

        if (scrollTop <= height - 192) {
            if (!this.state.header) {
                state.header = true
            }

            if (!transparent) {
                state.transparent = true
            }

            if (progress) {
                state.progress = 0
            }
        }

        if (!isEmptyObject(state)) this.setState(state)
    }

    // 切换 菜单栏显隐
    toggleMenu = menu => {
        if (!menu) {
            window.document.documentElement.classList.add('disabled')
        } else {
            window.document.documentElement.classList.remove('disabled')
        }

        this.setState({
            menu: !menu,
        })
    }
    scrollTo = hash => {
        if (!hash) {
            this.smoothScroll.animateScroll(
                window.document.querySelector('title'),
                null,
                {
                    offset: 0,
                    easing: 'easeInOutCubic',
                }
            )

            return
        }
        const value = hash[0] === '#' ? hash.slice(1) : hash
        this.smoothScroll.animateScroll(
            window.document.querySelector(`[id='${value}']`),
            null,
            { offset: 50, easing: 'easeInOutCubic' }
        )
    }
    enableHideHeader = enable => {
        this.setState({
            enableHideHeader: enable,
        })
    }
    render() {
        const {
            menu,
            header,
            enableHideHeader,
            transparent,
            scale,
            progress,
        } = this.state;
        let { data, children } = this.props;
        let { description, title } = data.site.siteMetadata;
        const showHeader = !enableHideHeader || header;
        return (
            <div>
                <Helmet titleTemplate={`%s - ${title}`} defaultTitle={title}>
                    <meta name="description" content={description} />
                    <html lang="zh-cn" /> {/* this is valid react-helmet usage! */}
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
                    <meta name="HandheldFriendly" content="True" />
                </Helmet>
                <section className="main-content">
                    {children({
                        ...this.props,
                        scrollTo: this.scrollTo,
                        enableHideHeader: this.enableHideHeader
                    })}
                </section>
                <Footer />
                <div
                    className={cx({ totop: true, show: !transparent })}
                    onClick={() => this.scrollTo()}
                >
                    <Icon type="arrow-up"/>
                    <span className="progress">{progress}%</span>
                    <div className="bg" style={{ height: `${progress}%` }} />
                </div>
            </div>
        );
    }
}

IndexLayout.propTypes = {
    children: PropTypes.func,
    data: PropTypes.object,
};

export const pageQuery = graphql`
  query LayoutQuery {
    site {
      siteMetadata {
        title
        description
        author
      }
    }
  }
`;
