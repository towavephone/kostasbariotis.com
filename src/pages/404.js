import React from 'react';
import GatsbyLink from 'gatsby-link';
import Helmet from 'react-helmet';

import Separator from './../components/Separator';
import Menu from './../components/Menu';

export default function NotFound() {
  return (
    <div>
      <Helmet
        title="Not found - 女王控"
        meta={[{ name: 'description', content: 'Not found' }]}
        noIndex={true}
      />
      <Menu />
      <section className="blog container about">
        <div className="medium-8 medium-offset-2 large-10 large-offset-1">
          <header className="header">
            <div className="row text-center">
              <h1>404 Not Found：该页无法显示</h1>
            </div>
          </header>
          <Separator />
          <p className="not-found-section">
            很抱歉，您所访问的地址并不存在，<GatsbyLink to="/">回到首页</GatsbyLink> 或者{' '}
            <a
              href="tencent://AddContact/?fromId=45&fromSubId=1&subcmd=all&uin=634407147&website=www.oicqzone.com"
              title="qq"
            >
              QQ联系我
            </a>{' '}
            关于这次页面问题。
          </p>
        </div>
      </section>
    </div>
  );
}
