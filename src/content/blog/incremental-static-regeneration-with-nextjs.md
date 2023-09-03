---
date: 2021-01-12T11:53:06.000Z
external: false
slug: incremental-static-regeneration-with-nextjs
title: Incremental Static Regeneration with Next.js
---

[Next.js](https://nextjs.org/) is a multi-page [React](https://reactjs.org/) framework bundled with all the features you need for production use cases. It is one of the leading platforms for building a React application.

Until recently, only two serving strategies were available: Static Site Generation (SSG) and Server Side Rendering (SSR). But Next.js v9.5 introduces a new strategy called Incremental Static Regeneration (ISR), a hybrid version of the two. 

This post will cover the relevant bits of this new strategy and explain why it's a game-changer for web development. 

## Static site generation vs server side rendering

The difference between SSG and SSR is when the page's HTML is generated. When using SSG, the HTML is generated in build time. SSG pre-rendering makes it easy to cache and fast to deliver. 

The term "static" comes from the fact that the HTML is static. But it doesn't necessarily mean that the *page* is static. You can fetch data and create dynamic interactions using client-side JavaScript.

[According to the Next.js team](https://nextjs.org/docs/basic-features/pages#two-forms-of-pre-rendering), SSG is the recommended way to proceed. It should be the default choice as long as it fits. Some of the SSG use-cases may include a blog, portfolio website, e-commerce application, or documentation website.

On the other hand, SSR generates the page's HTML on each request. It is much more flexible than SSG because you can change the HTML without building the application every time. So if you have data that is continuously updated, SSG might not be a good fit. 

Imagine serving your Twitter homepage as a static page. You can't even imagine that, can you? This flexibility has a significant impact on the performance and makes it much harder to cache. SSR is the way to go whenever SSG is not the right fit for you. 

Next.js makes it a breeze to switch between the two modes. Every page should export a function that gets the required properties to render the page. 

The React component of the page does not even know where the properties came from. Let's see an example for SSG and SSR, taken from Next.js documentation.

Here's an SSG example:

```
    export async function getStaticProps() {
      const res = await fetch('https://...');
      const data = await res.json();
    
      return { props: { data } };
    }
```

Every static page should export a `getStaticProps` function. The function is invoked at build time, and the returned `props` are forwarded to the React component as `props`. In this example, we call our remote API endpoint and return its response.

And now, here's the equivalent SSR example:

```
    export async function getServerSideProps() {
      const res = await fetch('https://...');
      const data = await res.json();
    
      return { props: { data } };
    }
```

The only difference is the function name. There's also another fundamental difference, and it's that this time, the function is called on every request, not at build time.

## Incremental static regeneration in Next.js

Incremental Static Regeneration (ISR) is a newly released feature that allows the regeneration of static pages during runtime. It's a hybrid solution of SSG and SSR. 

The page is generated on the first request. Unlike in SSR, where the visitor has to wait for the data fetching, a fallback page is served immediately. 

During the fallback stage, we can present placeholders and a skeleton page until everything is resolved. Skeleton pages are a common pattern that you can see almost everywhere. 

Once the data is resolved, the final page is cached, and consequent visitors will receive the cached version immediately, just like with SSG. We can also set when Next.js should re-validate the page and update it. 

Even when revalidating, the visitor first receives the cached version and only then the updated version. This caching strategy is commonly known as "stale-while-revalidate." Of course, it was possible to achieve even before, but ISR democratized this ability and made it accessible.

Evolving your SSR pages to ISR can significantly increase your application's performance and improve your Lighthouse score by tens of points — as well as delights your visitors with a fast experience.

Using ISR is much like SSG with an additional `revalidate` property. This new property states how often to revalidate the page (in seconds):

```
    export async function getStaticProps() {
      const res = await fetch('https://...');
      const data = await res.json();
    
      return { props: { data }, revalidate: 60 };
    }
```
  
This is how simple it is. Nothing fancy.

Detecting fallback mode is as easy as using React Hooks. The Next.js router holds this information for us. All we have to do is to get the router and extract this information, as follows:

```
    const { isFallback } = useRouter();
```

`isFallback` is a boolean that automatically updates when the fallback mode changes. You can take this snippet and put it in every component you would like.


## Performance aspects

The main reason for recommending SSG over anything else is to reduce the time for first paint and the blocking time — thus, providing a better user experience for your visitors. 

Once you go down the SSR path, you increase the blocking time and, as a result, the first paint. This is because the server has to fetch some data and then generate the HTML on the fly before sending any HTML back to the client. 

To deliver the best experience, we have to choose carefully what data to fetch on the server-side. 

My rule of thumb is to fetch data that is required for meta tags only. Correct meta tags can affect the link's appearance when someone shares it on social media, for example. And they can also improve your SEO. You don't want the search bots to rely on JavaScript to index you correctly. Make it easy for them to scrape and understand your website.

ISR is a bit different, but my general rule of thumb still holds. When using ISR, the first paint and the blocking time might not be affected due to the fallback stage. Next.js immediately sends an HTML back even before fetching the server-side data. Depending on the design of your page, the server-side data fetching might delay the first meaningful paint. 


## A live demo of how ISR, SSG, and SSR work

Before wrapping up, here’s a working example that puts into practice everything we learned. Our demo will randomly pick a public API using this [awesome API](https://api.publicapis.org/) in three ways, ISR, SSG, and SSR. 

The [code is available on GitHub](https://github.com/idoshamun/nextjs-isr-logrocket/tree/main) if you want to try it out yourself.

Let’s start by building our page component. Thanks to Next.js, we can write it once and use it for all methods as long as we provide the same props:

```
    import { useRouter } from 'next/router';
    
    export default function Page(props) {
        const { isFallback } = useRouter();
    
        if (isFallback) {
            return <></>;
        }
    
        return <div>
            <h1>{props.name}</h1>
            <p>{props.description}</p>
        </div>
    }
```

Our props object contains the name of the public API and its description. We display them using a header and a paragraph elements accordingly. One caveat is that we have to check for the ISR fallback mode as mentioned above. 

During this mode, the props might not be defined, so we have to take care of it. I return here an empty element for simplicity's sake, but a better approach is to show loaders or a skeleton page.

Our page is ready, and now we can fetch some data from the API. We will use [node-fetch](https://www.npmjs.com/package/node-fetch) for this purpose, as all the calls are made outside the browser, so the browser’s built-in fetch function is not available.

```
    import fetch from 'node-fetch';
    
    export async function getRandomAPI() {
        const res = await fetch('https://api.publicapis.org/random');
        const json = await res.json();
        return {
            name: json.entries[0].API,
            description: json.entries[0].Description,
        };
    }
```

We call the API endpoint that returns a random public API and organize it into a better structure that includes name and description, just like our props object. 

The essential elements are ready, and all that’s left to do is create the actual Next.js pages — one for every rendering method.

SSR:

```
    import Page from '../Page';
    import { getRandomAPI } from '../publicApis';
    
    export default Page;
    
    export async function getServerSideProps() {
        const props = await getRandomAPI();
        return { props };
    }
```

SSG:

```
    import Page from '../Page';
    import { getRandomAPI } from '../publicApis';
    
    export default Page;
    
    export async function getStaticProps() {
        const props = await getRandomAPI();
        return { props };
    }
```

ISR:

```
    import Page from '../Page';
    import { getRandomAPI } from '../publicApis';
    
    export default Page;
    
    export async function getStaticProps() {
        const props = await getRandomAPI();
        return { props, revalidate: 30 };
    }
```

You can see that all of these implementations look similar. The SSR version uses `getServerSideProps` instead of `getStaticProps`. And the ISR version sets the revalidation period to 30 seconds. Pretty easy, right?

You can see it in action [here](https://nextjs-isr-logrocket.vercel.app/). Note that the SSR version will randomly pick an API on every request. The SSG version will pick one randomly at build time. Lastly, the ISR version will refresh the selected API every 30 seconds.

## Conclusion

Now you should have a sense of understanding about the nuances of SSG, SSR, and ISR. If you optimize for performance, you should first consider using SSG, followed by ISR, and, only as a last resort, SSR. 

Both SSG and ISR have some limitations, and that's precisely why they might not fit every use case like SSR. We also covered some of the performance aspects between the three. My rule of thumb is to server-side fetch only data required for the page's meta tags. Happy coding!

