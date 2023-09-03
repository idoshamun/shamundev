---
date: 2020-12-17T13:53:34.000Z
external: false
lastmod: '2020-12-19T16:57:35.619Z'
slug: server-side-rendering-renaissance
title: Server-Side-Rendering Renaissance
---

In the early days of the internet, web development was very straightforward. There was no JavaScript, which means no React or Vue, no endless debates. The only tool at our disposal for creating websites was HTML.
To create dynamic websites, we had to generate the HTML dynamically in the server. This technique is called server-side-rendering (SSR). For example, upon a user request for a page, the server had to query the database and generate an HTML file and serve it to the client based on the results. Whenever the user navigates to a new page, the page is fully reloaded with the new HTML file. SSR as mentioned was the only way to build websites at the time.
As the internet evolved, the need to create more complex websites increased. This led to introducing CSS and JavaScript. Together they were used to create dynamic websites that can react to user interactions.
A singular point that changed web development forever is the invention of AJAX by Microsoft. AJAX provided a way to modify the DOM on the client-side and dispatch asynchronous HTTP requests back to the server. This opened the door to improve the performance of websites drastically. We no longer need to do a full reload to the page. We can dispatch a request and, based on the response, modify on the client-side the page. Today, AJAX requests are very popular, but at the time, this was innovative and revolutionary.

# The Birth of Single Page Applications

In the search for improving the performance of the web, developers started to wonder if SSR can be replaced with a new technique that will be more performant. SSR's problem is that it delays the rendering of the whole page until all the required data is resolved. This means that the first paint might take a lot of time. Thanks to AJAX, we no longer need to load the page as a whole. We can load parts of it. With the essence of this concept and the frameworks at the time, such as Backbone, Ember, and Angular 1, the Single Page Application (SPA) was born. 
SPA takes care of everything on the client-side, this includes even routing. We can store all our assets in a CDN and deliver them to our users, with no need to dynamically generate a single HTML file. No matter what page the user requests, they will always get the same index.html file as a response.
To provide data dynamically for the SPA, Web API was introduced. Web API consists of HTTP endpoints that only delivers data, usually in JSON format. Some modern implementation of Web API might follow the REST API convention or GraphQL. The SPA can send a request to any of these endpoints to receive the data it needs and modify the DOM accordingly.

# Server-Side-Rendering 2.0

Although single-page-applications seemed very promising, they sacrificed an important aspect of the web, which is SEO. Suddenly, search engines could not index the different pages of a SPA correctly. At the time, the search engine bots heavily relied on the meta tags in the HTML's head. And now, with SPA, the meta tags can only be set in the client because there's no server. Unfortunately, the bots didn't execute JavaScript, so the meta tags cannot be updated. Thus it caused the bots to misbehave on these sites. By now, the bots have evolved and some of them do execute JavaScript but it still not bullet-proof. It's worth noting that SEO is essential for the growth of many products, such as Stackoverflow and GitHub.
This calls for a new solution that will combine the pros of both worlds of SSR and SPA. The hybrid model, or as I love to call it, SSR 2.0, delivers different HTML for every page but does not necessarily render everything on the server-side. You render only the bare minimum required for SEO and then let the client-side do the rest incrementally.
Next.js is one of the frameworks that push server-side-rendering to the front line and keep innovating in this domain. Next.js made it more user-friendly to build a server-side-rendering application that follows the best practices of performance and includes a modern framework (React) inside.
One of their latest inventions is called Incremental Static Generation (ISG). With ISG, you can render the page on the server and then cache it in the CDN so the following visitors will get it almost instantly. Of course, you could have done it before, but Next.js made it all so simple. Cache invalidation is one of the hardest problems to solve for a developer, and they do it for you. You can also set a cache policy. For example, refresh the page every 1 minute.
When I migrated daily.dev from SSR to ISG, it dramatically increased the Lighthouse score. And it was super easy to do.
ISG is an important step to make SSR applications much more performant and I believe it will be embraced by more SSR frameworks.

# What's Next?

The growing popularity of web development will not stop any time soon, which means new frameworks and techniques will emerge. If I read the map correctly, we're about to do a full cycle. We started with SSR, one application for both back-end and front-end. Followed by SPA, one application for the front-end, and another one for the Web API. And the next trend is going to be Zero-API, with no need for a dedicated application for Web API. This is what Ruby on Rails and Elixir Phoenix are all about. For some reason, this idea didn't penetrate the JavaScript community. But now it seems that it does, have a look at RedwoodJS and Blitz.js that would like to achieve exactly this.






