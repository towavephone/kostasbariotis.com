import React from 'react';
import GatsbyLink from 'gatsby-link';

const Footer = () => (
  <div>
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="medium-8 medium-offset-2 large-10 large-offset-1 text-center">
            我是{' '}
            <GatsbyLink className="footer-link" to="/" title="towavephone.com Home">
              女王控
            </GatsbyLink>，一个前端开发者，黑猫女王控，五更琉璃粉。我的使命是编写干净高效的代码，解决前端上的问题，并学习一些东西。更多请阅读{' '}
            <GatsbyLink className="footer-link" to="/about" title="关于我">
              关于我
            </GatsbyLink>{' '}
            。
          </div>
        </div>
      </div>
    </footer>

    <footer className="footer-social">
      <ul className="social">
        <li>
          <a
            href="tencent://AddContact/?fromId=45&fromSubId=1&subcmd=all&uin=634407147&website=www.oicqzone.com"
            title="qq"
          >
            <i className="icon-qq" />
          </a>
        </li>
        <li>
          <a
            rel="noopener noreferrer"
            target="_blank"
            href="https://github.com/towavephone"
            title="github"
          >
            <i className="icon-github" />
          </a>
        </li>
        <li>
          <GatsbyLink to="/rss.xml" title="订阅我">
            <i className="icon-rss" />
          </GatsbyLink>
        </li>
        <li>
          <a href="mailto:634407147@qq.com" title="634407147@qq.com">
            <i className="icon-mail" />
          </a>
        </li>
      </ul>
      <div className="text-center">
        Copyright {new Date().getFullYear()}{' '}
        <GatsbyLink to="/" title="女王控">
          女王控
        </GatsbyLink>
        <span className="separator"> • </span> Design by{' '}
        <a rel="noopener noreferrer" href="http://www.attheo.do" target="_blank">
          Thanos Theodoridis
        </a>
      </div>
    </footer>
  </div>
);

export default Footer;
