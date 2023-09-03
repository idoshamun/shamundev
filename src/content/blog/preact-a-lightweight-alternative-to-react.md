---
date: 2021-01-25T07:55:25.000Z
external: false
slug: preact-a-lightweight-alternative-to-react
title: Preact - A lightweight alternative to React
---

React is the most popular frontend library these days. It's maintained by Facebook and has 163K stars on GitHub. Big tech companies such as Facebook (duh!), Twitter, Netflix, and GitHub use React to power their products.

Although its immense popularity, there are voices in the developers' community who claim that React bloats the application's bundle size. Looking at the bundles of both react and react-dom shows that it's true.  [Bundlephobia](https://bundlephobia.com/) is a great website to check bundle sizes. The minified bundle of react + react-dom sizes 128kB. That means our application bundle starts at 128kB before we even wrote a single line of code. Quite heavy, I must admit.

# Why should we care about our bundle size?

Every kilobyte of JavaScript that the browser has to download, parse, and execute reduces our application's performance. Here's why:

- The browser has to download the bundle over the network which in many cases delays the initial load. Now you might think that it's negligible, but the truth is that it's not. Not all your visitors will be connected to a fast, stable internet connection. Most of them will probably use their mobile phones with a flaky connection. Some of them even use a 2G connection. According to Bundlephobia, the download time of react-dom in an emerging 3G connection (~50 kB/s) is 0.79s. Almost one second!
- Once the script is downloaded, the browser has to parse it into machine commands. This also takes time. The bigger the script, the more code to parse.
- After downloading and parsing, the browser has to execute our code. And again, the more code to execute, the more time it takes.
- Lastly, a bigger bundle leads to more memory consumption. The parsed code and runtime variables are all stored in memory.

Better performance leads to a better conversion rate, better SEO rank, and an overall better user experience. If you care about these you should care about performance and optimizing it.

# Meet Preact

Preact is a lightweight alternative to React that focuses on performance. Unlike other alternatives to React, such as Vue.js and Angular, Preact keeps the same modern API as React.  And if that's not enough, there's an extensive compatibility layer with React to make sure your existing React code can be used in Preact. It's called preact/compat. According to Preact's website, Preact's bundle size is 3kB, and preact/compat adds two more kilobytes. If you start your application from scratch, the preact package is a perfect fit. But if you migrate an existing React application or heavily relied on React's eco-system, then you should consider using preact/compact as well.

Although not as close to being adopted as React, many big companies use Preact to power their products. Groupon, Uber, Lyft, Hashicorp, DEV, and daily.dev (hehe 😂), to name a few.

## Why use Preact?

If you care about performance, this is exactly what Preact has to offer. They maintain a strict performance budget for their project and puts performance as their top priority. A nice anecdote, Preact has no dependencies.

## Why not use Preact?

- Preact's community is by far smaller than React's. Although it's mostly compatible with React, specific Preact issues might require the community's help. With that being said, the contributors are very accessible and helpful.
- Preact is not maintained by a big tech company like Facebook. This is an important decision factor, especially in enterprises.

# Doing the switch

The Preact team did magnificent work in helping developers migrating from React to Preact. The key lies in the preact/compat, the compatibility layer. The only single-step required is "aliasing". In "aliasing", we tell our bundler that a specific import is resolved using a different import. In our case, we specify our bundler that react and react-dom are resolved by using preact/compat. That's it! We don't need to change our imports or our code in any way. Let's see what it takes to do aliasing with webpack.

```javascript
const config = { 
   //...snip
  "resolve": { 
    "alias": { 
      "react": "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",
     // Must be below test-utils
    },
  }
}
```

You need to add the above snippet in your webpack config file. You can check out the  [official docs for more bundlers](https://preactjs.com/guide/v10/getting-started/#aliasing-react-to-preact). This configuration tells webpack that wherever it sees `import something from 'react'` it will substitute it with `import something from preact/compat`. The same holds for the other packages mentioned in the configuration as well.

## Next.js

The Preact team maintains a plugin to make the migration for a Next.js application a breeze as well. I did this process for daily.dev web application, and it was so much easier than I imagined. [next-plugin-react](https://github.com/preactjs/next-plugin-preact) is available on npm, and it takes only two steps to install.

The first step is to install all dependencies and set the correct aliasing:
```
npm install --save next next-plugin-preact preact react@npm:@preact/compat react-dom@npm:@preact/compat react-ssr-prepass@npm:preact-ssr-prepass preact-render-to-string
```

The second and last step is to wrap your Next.js config with the next-plugin-react as follows:
```
const withPreact = require('next-plugin-preact');

module.exports = withPreact({
    /* regular next.js config options here */
});
```

You can see my pull request to migrate from React to Preact for a real-life project:
https://github.com/dailydotdev/daily-webapp/pull/206/files
Most of the changes besides applying the above is changing to `@testing-library/preact` from `@testing-library/react`. Besides that, I had a few synchronization issues. Operations that used to be sync in React became async in Preact. This forced me to change the tests to use `waitFor` instead of asserting the condition immediately. Another compatibility issue was triggering a blur event in tests using the `blur` event type in Preact compared to `focusout` in React. Overall, it was a rapid process, even for an application with ~200 tests. In a day-to-day experience, I never felt any compatibility issues with React.

# Conclusion

You made it so far, and I'm proud of you! In this post, we learned about Preact, a lightweight alternative to React. Preact is compatible with React's eco-system, and it's only 5kB compared to React, which is over 100kB. On the other hand, Preact's community is rather small and cannot be compared to React's community. The process of migrating an existing React application is quick and easy, thanks to Preact's compatibility layer. If you care about performance, you should at least consider Preact as an alternative.

Until next time 🍻
