---
date: 2021-01-05T15:36:00.000Z
external: false
lastmod: '2021-01-06T08:42:50.041Z'
slug: web-vitals-optimizations-advanced-dynamic-import-patterns
title: 'Web Vitals Optimizations: Advanced Dynamic Import Patterns'
---

Web performance is a crucial part of the user experience of our web application. It has a direct impact on the conversion rate. Walmart found that for every 1-second improvement in page load time, conversions increased by 2% ([see source](https://www.cloudflare.com/learning/performance/more/website-performance-conversion-rates/)). And if that's not enough, search engines favor fast websites. They rank them higher than slow websites. So improving your web application's performance can increase both the conversion rate and the organic customer acquisition rate. 

# Web Vitals

[Web Vitals](https://web.dev/learn-web-vitals/) (coined by the Chrome team) are a set of metrics to measure the performance of a website. Optimizing for these metrics ensures your visitors will enjoy a much better experience.
Core Web Vitals are a subset of the aforementioned Web Vitals that is relevant to any web page. The subset focuses on three performance aspects, loading, interactivity, and visual stability. In this article, we will focus on improving two of them, loading and interactivity. They're represented by these two metrics, Largest Contentful Paint (LCP) and First Input Delay (FID). There are many strategies to improve these metrics, but we'll focus on reducing the bundle size. 

# Bundle size

The page bundle size significantly affects both LCP and FID. Both server-side-rendered applications and single-page-applications can end-up with bloated JavaScript bundles. The bigger the bundle, the more time it takes to download the bundle, parse the code into actionable machine commands, and eventually evaluate it. As long as the main thread is focused on any of these, it cannot do anything else, which increases LCP and FID. Addy Osmani wrote an extensive article about [the cost of JavaScript](https://v8.dev/blog/cost-of-javascript-2019) if you fancy going deeper.
Even if we apply best practices such as tree shaking and code splitting in our project, the bundle can become huge. So what should we do? Dynamic import and loading prioritization!

# Dynamic import

Not many know, but there are two forms of import we can use, static and dynamic. A static import is a well-known form and is our default choice. It looks like `import defaultExport from "module-name";` and it tells the bundler (e.g., Webpack) that this module is mandatory to run our code. The bundler will bundle the module code with our code into a single JavaScript file. The more modules we statically import, the bigger the bundle will be. But obviously, not all imports are the same. Some are required to run our code immediately, and some can be lazy-loaded until a certain event occurs. So why do we have to load all this JavaScript at once? We don't. We can use dynamic import. Dynamic import looks like a regular function call and returns a promise that resolves to the imported module, `import("module-name").then((module) => ...);`. Using dynamic import, we tell the bundler to create a separate bundle for this module and load it in runtime. This makes sure the imported module will not be bundled in our main bundle, keeping the main bundle small and efficient. [React lazy](https://reactjs.org/docs/code-splitting.html) and [Next.js dynamic](https://nextjs.org/docs/advanced-features/dynamic-import) utilize dynamic import to lazy-load React components easily. They are both a function that receives a function as an argument and returns a React component. The function argument must return a promise that resolves into a React component by itself. Here's an example: `const DynamicComponent = dynamic(() => import('./component'))`. Of course, both React lazy and Next.js dynamic provide you a way to handle errors and show a fallback element while the component is loading (out of scope). So now we have two levels of import. The first is a static import, which bundles the module into our bundle. The second is a dynamic import, which imports the module as soon as requested as a separate bundle. This should boost our performance, but we can take it even further and load some JavaScript bundles only after the page is completely loaded.

# Import after page load

In this section, we will see how we can use React lazy and Next.js dynamic to create a new function that imports a component only after the page is loaded. For simplicity's sake, I'll show how to implement it with Next.js, but the same concept can be easily applied to React lazy or even other frameworks such as Vue.

Let's first create a function that returns a promise that resolves once the page is loaded. A page loading process consists of three phases, loading, interactive, and completed. The function receives an argument that states at what phase we should load the resource. We use the `readystatechange` event to listen to changes in the loading process.

```ts
export default function onPageLoad(
  readyState: DocumentReadyState = 'interactive',
): Promise<void> {
  return new Promise((resolve) => {
    if (
      document.readyState === readyState ||
      document.readyState === 'complete'
    ) {
      return resolve();
    }

    const callback = (event: ProgressEvent<Document>) => {
      if (
        event.target.readyState === readyState ||
        document.readyState === 'complete'
      ) {
        document.removeEventListener('readystatechange', callback);
        return resolve();
      }
    };
    document.addEventListener('readystatechange', callback);
  });
}
```

Our `onPageLoad` function first returns a promise as planned. In the promise, we check for the current ready state of the document. It's an important edge case that we have to deal with; otherwise, the promise might never resolve. If the page is already loaded, we resolve the promise. Second, we create a callback function for the event listener and subscribe to the `readystatechange` event. In the callback, we check the new ready state of the document. If it equals the requested state or if the document is completely loaded, we can resolve the promise and unsubscribe.

This was the heavy lifting, and now the only thing that remained to do is to create our new dynamic function that will load the component on page load.

```ts
import dynamic from 'next/dynamic';
import onPageLoad from './onPageLoad';

export default function dynamicPageLoad<P>(
  loader: () => LoaderComponent<P>,
  readyState: DocumentReadyState = 'interactive',
): React.ComponentType<P> {
  return dynamic<P>(() => onPageLoad(readyState).then(loader), { ssr: false });
}
```

Like Next.js dynamic function, we receive a loader function that returns a promise with a React component and an optional ready state to prioritize the loading. In the function, we use the good-old dynamic function, but before providing the loader function, we chain it to the `onPageLoad` function that we created earlier. This makes sure the import statement will not be called before the page is loaded. The second parameter to the dynamic function disabled evaluating this expression in the server. This is required because we use the document object, which is available only to the client.
 
We can use our function to make sure our components will be imported after the page load as follows:
`const DynamicComponent = dynamicPageLoad(() => import('./component'))`.

Now, a lot of JavaScript code can be downloaded, parsed, and evaluated only after our page is loaded. It makes sure the main thread will have more time for critical resources, thus improving our LCP and FID metrics.

# Conclusion

Good web performance can improve our conversion rate and SEO. One of the ways to improve performance is to reduce the initial bundle size. By utilizing dynamic import, we can lazy-load JavaScript modules, which shrinks the initial bundle size. We also learned how to prioritize dynamic imports by loading some of the modules only after the page is loaded using our custom dynamic function.

