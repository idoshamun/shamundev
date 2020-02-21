import React from 'react';
import { Helmet } from 'react-helmet';
import _ from 'lodash';

import {safePrefix} from '../utils';
import Header from './Header';
import Footer from './Footer';
import SEO from './SEO';

export default class Body extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Helmet>
                  <meta charSet="utf-8"/>
                  <meta name="viewport" content="width=device-width, initialScale=1.0" />
                  <link rel="shortcut icon" href="/favicon.png" />
                  <link href="https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i" rel="stylesheet"/>
                  <link rel="stylesheet" href={safePrefix('assets/css/main.css')}/>
                  {(_.get(this.props, 'pageContext.frontmatter.template') === 'post') &&
                  _.get(this.props, 'pageContext.frontmatter.canonical_url') &&
                  <link rel="canonical" href={_.get(this.props, 'pageContext.frontmatter.canonical_url')}/>
                  }
                </Helmet>
                <SEO
                  title={_.get(this.props, 'pageContext.frontmatter.title')}
                  description={_.get(this.props, 'pageContext.frontmatter.excerpt')}
                  image={_.get(this.props, 'pageContext.frontmatter.content_img_path')}
                  pathname={_.get(this.props, 'pageContext.url')}
                  article={_.get(this.props, 'pageContext.frontmatter.template') === 'post'}
                  datePublished={_.get(this.props, 'pageContext.frontmatter.date')}
                />
                <div id="page" className={'site style-' + _.get(this.props, 'pageContext.site.siteMetadata.layout_style') + ' palette-' + _.get(this.props, 'pageContext.site.siteMetadata.palette')}>
                  <Header {...this.props} />
                  <div id="content" className="site-content">
                    <div className="inner">
                      <main id="main" className="site-main">
                        {this.props.children}
                      </main>
                      <Footer {...this.props} />
                    </div>
                  </div>
                </div>
            </React.Fragment>
        );
    }
}
