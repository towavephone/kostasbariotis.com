import React from 'react';
import PropTypes from 'prop-types';
import { withPrefix } from 'gatsby-link';

export default function ArticleSchema({ authorName, title, description, date }) {
  const data = `{
    "@context": "http://schema.org/",
    "@type": "BlogPosting",
    "author": "${authorName}",
    "headline": "${title}",
    "datePublished": "${date}",
    "description": "${description}",
    "publisher": {
      "@type": "Person",
      "name": "${authorName}",
      "logo": {
        "@type": "ImageObject",
        "url": "${withPrefix('/schema/avatar.png')}"
      }
    }
  }`;
  return <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: data }} />;
}

ArticleSchema.propTypes = {
  authorName: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  date: PropTypes.string
};
