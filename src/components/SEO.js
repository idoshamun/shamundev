import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';

const SEO = ({ title, description, image, pathname, article, datePublished }) => (
  <StaticQuery
    query={query}
    render={({
               buildTime,
               site: {
                 siteMetadata: {
                   defaultTitle,
                   // titleTemplate,
                   defaultDescription,
                   siteUrl,
                   defaultImage,
                   twitterHandle,
                 },
               },
             }) => {
      const seo = {
        title: title && (title + ' - ') + defaultTitle,
        description: description || defaultDescription,
        image: `${image || defaultImage}`,
        url: `${siteUrl}${pathname || '/'}`,
      };

      const author = defaultTitle;
      const siteLanguage = 'en-US';

      const schemaOrgWebPage = {
        '@context': 'http://schema.org',
        '@type': 'WebPage',
        url: siteUrl,
        headline: description,
        inLanguage: siteLanguage,
        mainEntityOfPage: siteUrl,
        description: defaultDescription,
        name: defaultTitle,
        author: {
          '@type': 'Person',
          name: author,
        },
        copyrightHolder: {
          '@type': 'Person',
          name: author,
        },
        copyrightYear: '2019',
        creator: {
          '@type': 'Person',
          name: author,
        },
        publisher: {
          '@type': 'Person',
          name: author,
        },
        datePublished: datePublished,
        dateModified: buildTime,
        image: {
          '@type': 'ImageObject',
          url: defaultImage,
        },
      };

      // Initial breadcrumb list

      const itemListElement = [
        {
          '@type': 'ListItem',
          item: {
            '@id': siteUrl,
            name: 'Homepage',
          },
          position: 1,
        },
      ];

      let schemaArticle = null;

      if (article) {
        schemaArticle = {
          '@context': 'http://schema.org',
          '@type': 'Article',
          author: {
            '@type': 'Person',
            name: author,
          },
          copyrightHolder: {
            '@type': 'Person',
            name: author,
          },
          copyrightYear: (new Date()).getFullYear().toString(),
          creator: {
            '@type': 'Person',
            name: author,
          },
          publisher: {
            '@type': 'Organization',
            name: author,
            logo: {
              '@type': 'ImageObject',
              url: image,
            },
          },
          datePublished: datePublished,
          dateModified: buildTime,
          description: seo.description,
          headline: seo.title,
          inLanguage: siteLanguage,
          url: seo.url,
          name: seo.title,
          image: {
            '@type': 'ImageObject',
            url: seo.image,
          },
          mainEntityOfPage: seo.url,
        };
        // Push current blogpost into breadcrumb list
        itemListElement.push({
          '@type': 'ListItem',
          item: {
            '@id': seo.url,
            name: seo.title,
          },
          position: 2,
        });
      }

      const breadcrumb = {
        '@context': 'http://schema.org',
        '@type': 'BreadcrumbList',
        description: 'Breadcrumbs list',
        name: 'Breadcrumbs',
        itemListElement,
      };

      return (
        <>
          <Helmet title={seo.title}>
            <meta name="description" content={seo.description}/>
            <meta name="image" content={seo.image}/>
            {seo.url && <meta property="og:url" content={seo.url}/>}
            {(article ? true : null) && (
              <meta property="og:type" content="article"/>
            )}
            {seo.title && <meta property="og:title" content={seo.title}/>}
            {seo.description && (
              <meta property="og:description" content={seo.description}/>
            )}
            {seo.image && <meta property="og:image" content={seo.image}/>}
            <meta name="twitter:card" content="summary_large_image"/>
            {twitterHandle && (
              <meta name="twitter:creator" content={twitterHandle}/>
            )}
            {seo.title && <meta name="twitter:title" content={seo.title}/>}
            {seo.description && (
              <meta name="twitter:description" content={seo.description}/>
            )}
            {seo.image && <meta name="twitter:image" content={seo.image}/>}
            {twitterHandle && <meta name="twitter:creator" content={twitterHandle} />}
            {!article && <script type="application/ld+json">{JSON.stringify(schemaOrgWebPage)}</script>}
            {article && <script type="application/ld+json">{JSON.stringify(schemaArticle)}</script>}
            <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
          </Helmet>
        </>
      );
    }}
  />
);

export default SEO;

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  pathname: PropTypes.string,
  article: PropTypes.bool,
};

SEO.defaultProps = {
  title: null,
  description: null,
  image: null,
  pathname: null,
  article: false,
};

const query = graphql`
    query SEO {
        site {
            buildTime(formatString: "YYYY-MM-DD")
            siteMetadata {
                defaultTitle: title
                defaultDescription: description
                siteUrl
                defaultImage: image
                twitterHandle
            }
        }
    }
`;