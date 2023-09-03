---
date: 2020-07-13T11:14:59.000Z
external: false
lastmod: '2020-12-19T17:03:38.709Z'
slug: pro-tips-for-data-scraping-in-production
title: Pro tips for data scraping in production
---

Data scraping is a delicate art of turning websites into a beautiful machine-readable data structure. 👩‍🎨

The are many use cases for data scraping. The most popular of them is Google Search. Google bots scrape websites to extract the content, analyze relevant keywords, find links on the page, and much more.

Scraping can be a resource-intensive task, not just network-wise but also CPU and memory. It depends on the tool you use to accomplish the task. More on this later.

At [daily.dev](https://daily.dev), we scrape hundreds of blog posts and websites every day. We have two use cases for scraping:
1. We structure blog posts in different shapes and forms into one data structure that we fully index in our database.
2. We always search for new publications, so our bot scrapes the publication's site and looks for metadata such as the title, logo, RSS link, and more.

We are scraping data as an offline job, as well as a realtime job upon user request. In this post, I would like to share my insights for building an efficient data scraping pipeline.

# Puppeteer 🎎

There are many tools and libraries to scrape data, [cheerio](https://cheerio.js.org/), and [Puppeteer](https://pptr.dev/) are the most famous ones. They are opposite from each other in the way they approach the problem. cheerio is a fast and lean implementation of core jQuery designed specifically for the server. It is not by any means a web browser. On the other side, Puppeteer is a high-level API to control Chrome. Puppeteer runs a headless browser (without UI). Being a web browser, especially Chrome, the last thing we can say about Puppeteer is that it's lean or fast. It consumes a lot of memory, and it takes time to boot compared to cheerio. Besides, Puppeteer installs Chrome and other native dependencies so that the installation process can be a bit long.
Nevertheless, Puppeteer is my go-to tool for data scraping simply because **it's a web browser!** Developers build websites for humans and browsers, not machines. When we choose to build a SPA (single page application), it makes it so much harder for libraries such as cheerio to scrape it. cheerio does not run javascript, and sometimes it is required for loading the data you want to scrape. By using Puppeteer, which is Chrome, you can execute javascript and the required network requests to load all the data required for scraping. Your machine uses the same browser you use for extracting meaningful data. Of course, there are some edge-cases that cheerio can be a better alternative because of its super-fast and lean nature, but they're rare, in my perspective.

# Pooling 🏊‍♀️

Let's take an example use case for data scraping. We would like to build a web server that, upon a user request, scrapes a given blog post and returns the "read time" of the post.
Intuitively for every request, we would create a new Puppeteer instance, navigate to that page, scrape the content, and calculate the read time. 
But and it's a big but, every Puppeteer instance takes time to boot, and also they tend to be very CPU and memory intensive.

Introducing the pool pattern! 🎉
The pool pattern utilizes a set of initialized objects (in our case, Puppeteer instances) - aka "the pool" and is in charge of destroying them as well. You, the developer, can request an instance from the pool, and if there is an available instance, you will get it right away, and if not, the pool will create it for you. The configuration can be much more complicated and may include minimum and maximum number of instances, idle time, etc.
This concept is not new and is heavily used for the databases. Usually, we manage a global connection pool for our application. We do not create a new connection upon every request. We just reuse the same concept but for Puppeteer.

Lucky for us, there is already a nodejs package [generic-pool](https://github.com/coopernurse/node-pool#readme) that implements the pool pattern. Let's use it right away to boost our performance and reduce the overhead:

```js
import * as puppeteer from 'puppeteer';
import * as genericPool from 'generic-pool';

const pptrPool = genericPool.createPool(
  {
    create: () => puppeteer.launch({}),
    destroy: (client) => client.close(),
  },
  { min: 1, max: 5 },
);

// Get an available browser instance
const browser = await pptrPool.acquire();
// Scrape here your data!
// Remember to release the instance back to the pool
await pptrPool.release(browser);
```

Pretty straightforward and easy to implement our custom pool. You need to define a `create` and `destroy` functions, and that's it. We can `acquire` to get an instance and `release` to give it back to the pool.
Make sure to customize the pool configuration to your needs, this is just a sample.

# Puppeteer Context 👊

It takes time, experience, and lots of sweat to grasp the concept of two contexts in one app. When scraping data with Puppeteer, you have the app context, with all the variables and functions you wrote and you the page context. Now the page context does not know a thing about the app context. The page context cares only about the website's javascript and functions. If you want to share variables between the contexts, you need to transfer them explicitly. Don't be fooled by the look of the arrow function! One might think that it shares the closure, but it's not!

Here is an example:

```js
import * as puppeteer from 'puppeteer';

const browser = await puppeteer.launch({});
const page = await browser.newPage();
const res = await page.goto('https://daily.dev/blog');

const myvar = 'hello';
await page.$eval('selector', (el) =>
  console.log(myvar) // undefined
);

await page.$eval('selector', (el, myvar) => 
  console.log(myvar), // hello
  myvar,
);
```

We use the `$eval` function to run a custom function in the page context. Inside this function, we should have the scraping logic. Now we are just trying to log a variable from the app context. In the first example, `myvar` is undefined because the page context doesn't have access to the page context. In the second example, we provide `myvar` as a function parameter, and we can use it as we please.

# Docker 📦

By now, containers are my one-stop-shop for creating application artifacts. [Docker](https://www.docker.com/) makes it super easy to create them. You can define the exact dependencies you need for your app without clashing with existing or other apps' requirements. The app gets a standalone and separate runtime environment, containers support every language and framework you can think of, and you can deploy these containers to almost any service.

When dealing with Puppeteer, Docker gives you an extra layer of security. Puppeteer can potentially execute malicious javascript code when scraping unknown websites. By using Puppeteer inside Docker in the worst-case scenario, the attacker will only have access to your container and not the server itself. Thus, restricting the possible damage, malicious code can infect your system.

Creating a container that supports Puppeteer is a bit tricky, so we'll walk through it step by step by first here is the full Dockerfile:

```Dockerfile
FROM node:14.3-slim

RUN mkdir -p /opt/app
WORKDIR /opt/app

# Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai, and a few others)
# Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer
# installs, work.
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf python make gcc g++ \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Add Tini
ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]

# Add user so we don't need --no-sandbox.
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /opt/app

# Run everything after as non-privileged user.
USER pptruser

COPY package.json package-lock.json ./

RUN npm i --only=prod

COPY build ./

CMD ["npm", "run", "start"]
```

First, we set our container base image to our favorite node version. Make sure to use the slim version. I was not able to use the apline version. 😢
We create a dedicated folder to our app to separate it from the remaining files of the container.
Now we have to install Chrome and its requirements to be used by Puppeteer.
Following Chrome installation, we install [Tini](https://github.com/krallin/tini) to take care of any zombie process that might be created by Chrome. Tini is super useful for reducing memory leaks and overhead.
For security reasons, we create a dedicated user to run Chrome and Puppeteer to prevent attackers from getting superuser permissions.
Lastly, we install production dependencies only, copy the application code, and run it.

That's it! These are my four tips for efficient, secured, and performant data scraping in production. I would love to hear your tips as well. 🙏

