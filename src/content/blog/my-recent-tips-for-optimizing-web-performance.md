---
date: 2021-02-09T14:57:10.000Z
external: false
slug: my-recent-tips-for-optimizing-web-performance
title: My Recent Tips For Optimizing Web Performance
---

If you don't care about web performance, you're missing out. Better performance leads to first and foremost a better user experience. But not only, it also improves the conversion rate, and surprisingly also the SEO of the website. Recently, Google implemented detecting a few performance metrics, called Web Vitals, as part of their SEO check. High-performance websites will be ranked higher. This article will give you a few tips that you can apply immediately to improve your performance.

# Write less, do more

Every JavaScript line you write potentially reduces the performance of our app. It increases the bundle size which the browser has to download over the network. The browser has to parse the script which also takes time. And finally, has to load it to the memory and execute. The shorter the code the better. And I don't mean variables names and esthetics because using a proper minify will do this work for you.

# Never do today what you can do tomorrow

You might always have heard the exact opposite sentence in your life. But this time I tell you to embrace this motto. Defer script loading, execute API requests (AJAX), and other actions only when you need them. When the page loads focus on the critical chain and make sure it loads as fast as possible. Only then load the remaining data. Let's take Twitter as an example, the feed is the critical chain. We need to optimize loading it fast and only then we can proceed with loading the notifications. But it's not just data, it's also the code itself. Today, we have tools like dynamic import, React Suspense, and other tools to lazy load scripts and components.

# Dependencies often comes with a burden

Not all dependencies are equal in terms of performance. Some have a small bundle and others might have a huge bundle. Tracking the bundle size of the dependencies is very important because it affects the final bundle size of our application. And again, the bigger the bundle, the worse the performance. Many times I found myself choosing dependencies by their bundle size. You can use webpack analyzer, Bundlephobia, and other tools to check the size of a library.

# Measure or it didn't happen

You might have decided, OK I'm going to improve my application performance. You sat down, refactored your code, or even better deleted some. And now you're happy that your website performs better. But it might not be the case, you need to always monitor and measure the performance of our app. You can use PageSpeed, LightHouse, Web Vitals, the DevTools profiler, whatever you want just make sure to measure. Change one thing at a time and measure the change. Some changes might even make your performance worse. Always validate your assumptions by measuring.

# Don't go crazy

Performance is super important but it's not the only thing out there. Don't go crazy on performance and be obsessive about achieving 100 on LightHouse. If you did achieve it, it's awesome but sometimes 90 is also fine. Going from 90 to 100 can be orders of magnitude harder than 70 to 90. You should care about performance but not only.

# Wrap up

We made it till the end! Now you should have the right attitude and mindset to improve and maintain your website's performance. And the best tip of all is don't exaggerate.

Until next time 🍻

