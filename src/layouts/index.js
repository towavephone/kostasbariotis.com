/* global graphql */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import '../scss/boot.scss';

import Footer from '../components/Footer';
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
      isUnsplash: false,
    };
    if (typeof window !== 'undefined') {
      this.smoothScroll = window.smoothScroll;
    }
  }
  //   scrollTo = hash => {
  //       if (!hash) {
  //           this.smoothScroll.animateScroll(
  //               window.document.querySelector('title'),
  //               null,
  //               {
  //                   offset: 0,
  //                   easing: 'easeInOutCubic',
  //               }
  //           )

  //           return
  //       }

  //       const value = hash[0] === '#' ? hash.slice(1) : hash

  //       this.smoothScroll.animateScroll(
  //           window.document.querySelector(`[id='${value}']`),
  //           null,
  //           { offset: 50, easing: 'easeInOutCubic' }
  //       )
  //   }

  //   enableHideHeader = enable => {
  //       this.setState({
  //           enableHideHeader: enable,
  //       })
  //   }
  render() {
    let { data, children } = this.props;
    let { description, title } = data.site.siteMetadata;
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
        <section className="main-content">{children({})}</section>
        <Footer />
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
