---
date: 2021-02-22T06:39:14.000Z
external: false
slug: meet-our-5-days-open-source-side-project-and-its-tech-stack
title: Meet our 5 days open-source side-project and its tech stack
---

## TL;DR

If you are here just to see the tech stack so here it is in all its glory:

### Backend 
* Fastify
* Redis
* Contentful
* App Engine (Google Cloud)

### Frontend
* Nextjs
* Preact
* Emotion
* Vercel

Here's the link to the app:
[https://buzzwordquiz.dev/](https://buzzwordquiz.dev/) 

You can also check out the source here:
 [https://github.com/dailydotdev/buzzwordquiz](https://github.com/dailydotdev/buzzwordquiz) 

To learn more about why we chose every component and why we created this new side-project, keep reading. 🙃

## Introduction

Building a side-project is a common habit of developers. It helps us to get onboard new libraries and frameworks and to try out new things. Some people even make money from their side-project. And actually, this is how daily.dev started. It was a side-project for almost three years before we decided to double down our efforts and go full-time on it.

Team daily.dev is a huge fan of side-projects, and we realized that it'd been a while since our last side-project. We decided to dedicate last week to create a new project.

## Meet Buzzword Quiz

![Buzzword Quiz cover](https://cdn.hashnode.com/res/hashnode/image/upload/v1613898617244/8Nq7vH1j4.jpeg)

Coming up with an idea is one of the most challenging aspects of building a side-project. We wanted to build an application that will make developers smile. After some brainstorming, we decided to make a developer's version of the good-old Logo Quiz. As developers, we see tons of logos and buzzwords every day, so we decided to put it in a test and see how good we are in identifying these logos. 

![Screenshot](https://cdn.hashnode.com/res/hashnode/image/upload/v1613899152369/5_aQSzyHY.png)

Buzzword Quiz is a web application where you have to identify as many logos as possible in 90 seconds. We even have a hall of fame for those of you who ace it and get a marvelous score.

We dedicated 5 days Sunday to Thursday to build it, and on Friday, we launched on  [Product Hunt](https://www.producthunt.com/posts/buzzword-quiz-for-developers) 

## Tech Stack

To make it happen in 5 days, we had to reuse a lot of our internal libraries that we built for daily.dev. So the tech stack is very much influenced by our  [webapp](https://app.daily.dev/) 

### Frontend
* Nextjs
* Preact
* Emotion
* Vercel

We love Nextjs as it offers flexible rendering options, which include server-side-rendering, static-site-generation, and incremental-site-regeneration. Furthermore, its community is super active and responsive. Nextjs puts performance and developers' experience as first priority, and so are we.
Preact is a lightweight alternative to React, and we love keeping our bundles as small as possible to improve performance and SEO.  [Read more about Preact](https://daily.dev/posts/preact-a-lightweight-alternative-to-react).
As for Emotion, we chose it as daily.dev design system is implemented in Emotion already, and we wanted to utilize it. Honestly, I wanted to try out build-time CSS-in-JS, but it would have required so much effort to build a new design system. Finally, the application was deployed to Vercel. Again their developers' experience is great, and it fits perfectly with Nextjs, obviously. 😉

### Backend
* Fastify
* Redis
* Contentful
* Cloudinary
* App Engine (Google Cloud)

We decided to separate the API from the application because Vercel doesn't yet provide integrations with services that we needed but still wanted to use Vercel for deploying the frontend. For our API, we chose Fastify, one of the fastest-growing alternatives to Expressjs. We use it for daily.dev API, and we're super happy with it. Just like Nextjs, Fastify puts performance and experience as their highest priority.

For our active games and leaderboard storage, we chose to go with Redis. We use Google Cloud's managed service, Memory Store. Redis is a great solution because the active games have a predefined time-to-live, so they can't overload the database for long, and the leaderboard is capped to 100 rows. All in all, it's not a lot of information, and Redis should give us the best performance as it keeps the data in-memory. It's like a shared RAM for the API servers.

Contentful is a headless CMS, and that's exactly what we need for storing the questions. A question is a combination of the logo and the correct answer. Contentful provides a content management interface so content managers can add, edit or delete questions without relying on a developer. The best thing is that they have a generous free tier.

Cloudinary is our default choice for delivering media assets. It's so simple and yet so powerful. The logos are hosted on Cloudinary. And we use their on-the-fly transformations to deliver the images in the light webp format.

Finally, App Engine is a Google Cloud solution similar to Heroku. You just deploy your code with a CLI, and they take care of the rest. With cost in mind, App Engine can scale to zero in idle times, which is great for a side-project because we don't pay for the infrastructure if no one uses it.

## What we learned in the process?

* Working on a side-project is a great gateway from our day-to-day work. It refreshes your mind and creativity and a fun activity to work on as a team.
* Launching on Product Hunt is always exciting, and we love the adrenaline rush. 🤩 
* Redis is a powerful database that we don't use often, and we might need to rethink it as it's super fast!
* Utilizing a CMS reduces the bottleneck of relying on developers to manage content. At daily.dev, we don't use any CMS, and every content change has to go through me, which is far from ideal.
* Developers love hacking their way to being number one on the leaderboard. You can check the [Product Hunt](https://www.producthunt.com/posts/buzzword-quiz-for-developers) page to see some tips.
* Building for developers is so much fun! We knew it already, but it's worth mentioning again.

Looking forward to hearing your thoughts about Buzzword Quiz 🍻
[https://buzzwordquiz.dev/](https://buzzwordquiz.dev/) 

