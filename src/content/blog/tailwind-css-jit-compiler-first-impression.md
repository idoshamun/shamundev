---
date: 2021-03-22T22:00:00.000Z
external: false
lastmod: '2021-04-01T08:34:11.190Z'
slug: tailwind-css-jit-compiler-first-impression
title: 'Tailwind CSS JIT Compiler: First Impression'
---

Last week, Adam Wathan, announced the JIT (just-in-time) compiler release. He shared a video on YouTube covering the new compiler. This release is one of the most important milestones of Tailwind CSS in the past months or even years. It's all about improving the developer experience. I had the pleasure to try it out and even contribute to the repository on GitHub. The new experience is delightful. So I rushed into utilizing it in the [daily.dev webapp](https://app.daily.dev/). Let's dive in and explore why the new just-in-time compiler is such a major announcement.

## Tailwind CSS drawback

Tailwind CSS is a utility-first CSS framework. Its PostCSS plugin generates atomic classes that we can use in HTML to style a component rapidly. The problem is that too many classes are produced, and it yields a massive CSS bundle. In production, we can use PurgeCSS (comes out-of-the-box with TailwinCSS) to remove classes that we don't use in our HTML. But in development, unfortunately, it is not possible. We need all the classes available in the generated CSS. This leads to a frustrating developer experience. It takes several seconds for Webpack to refresh a build when you change the slightest thing. And even Chrome's DevTools might have difficulty processing the stylesheet because of its file size. It feels laggy whenever you try to use it. The problem grows exponentially as soon as you start to add more settings to your tailwind.config.js file. For example, in our web app case, we added 16 color families that each include 9 colors, resulting in 144 colors. For each color, many classes are being generated. There are multiple color properties (background, color, border, etc.) and variants (hover, focus, etc.). For each combination, a class is generated in build time. Tailwind CSS provides a way to reduce the number of classes generated. We can turn off variants and tweak the configuration file. But still, it might not be enough. In some extreme cases, building Tailwind CSS in watch mode lead my Nextjs CLI to crash due to overflow. I think developer experience is a crucial part of choosing a library, and as we understand by now, Tailwind CSS has a fundamental issue with its DX. Developers even built open-source tools to improve Tailwind CSS's build time. A popular example is [Windi CSS](https://windicss.org/). The Tailwind Labs team realized that they must address this issue of the development experience. And this is exactly what they did in the latest launch. 

## The next generation of Tailwind CSS

The new JIT compiler, inspired by Windi CSS, is here to save the day. The current build tool generates all the classes in development and then purges most of them in production. The just-in-time compiler generates only the necessary classes in the first place. It even allows creating dynamic classes on the fly. 
The new compiler has several advantages:
* Blazingly fast builds.
* No need to tweak variants in the config file. They are all enabled by default.
* Identical CSS in development and production.
* Sweet development experience.

It reduced my build times from several seconds to milliseconds in development. It was such a pain that all of a sudden thanks to the just-in-time compiler is now gone.

## Installing the JIT Compiler

To use the new compiler we first need to install it from NPM:
```
npm install -D @tailwindcss/jit
```

If you don't have Tailwind CSS and PostCSS installed, make sure to install them:
```
npm install -D tailwindcss postcss
```

Now instead of adding Tailwind CSS to postcss.config.js, we need to use the jit package:

```
  module.exports = {
    plugins: {
      '@tailwindcss/jit': {},
      autoprefixer: {},
    }
  }
```

Lastly, we need to set tailwind.config.js purge setting. It tells the compiler where to search for the used classes.

```
module.exports = {
  purge: [
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
  theme: {
    // ...
  }
  // ...
}
```

In the above example, the compiler will search for classes in every HTML file in the public directory. And also in every Javascript, JSX, or Vue file in the src directory and its TypeScript equivalent.

That's it! Your project is all set-up and now you can run the development CLI command to enjoy a lightning-fast build.

## Caveats

There are few caveats to cover before you decide to use the just-in-time compiler. 

* It is still experimental and in its early days. This means that things might change and probably will. The API for dynamic classes for example could change its regex pattern. I decided to use JIT only in development and in production I still use the good-old tailwindcss package. It allows me to enjoy the quick build times but not the new dynamic class features. If you fancy copying the same setting here it is:

```
module.exports = {
  plugins: {
    [process.env.NODE_ENV === 'production'
      ? 'tailwindcss'
      : '@tailwindcss/jit']: {},
    autoprefixer: {},
  },
};
```

* We must update the autoprefixer to its latest version. Otherwise, we will see our build failing. This is caused due to a bug in autoprefixer previous versions.
* No more classes autocomplete in the DevTools. The JIT compiler generates only the necessary classes so the browser is not familiar with all the rest. This can be solved using browser extensions for example but at the moment it is not supported.

## Conclusion

Tailwind CSS JIT Compiler is a game-changer when it comes to development experience. It changes generates smaller CSS files in development and reduces build times significantly. It also bundled with some new features that I haven't tried out yet. Remember that the compiler is still experimental before you use it. Enjoy coding!

## References

* Adam Wathan's YouTube announcement:
%[https://www.youtube.com/watch?v=3O_3X7InOw8]

*  [tailwindlabs/tailwindcss-jit repository on GitHub](https://github.com/tailwindlabs/tailwindcss-jit) 
