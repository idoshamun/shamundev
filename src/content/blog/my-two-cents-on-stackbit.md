---
date: 2020-02-22T10:19:13.902Z
external: false
slug: my-two-cents-on-stackbit
title: My Two Cents On Stackbit
---

Less than a year ago, I launched my first personal blog. It was powered by [Hugo](https://gohugo.io/), a fast static site generator written in golang, and I used no CMS. I had a hard time maintaining and writing new blog posts because I have found this process cumbersome. Creating a directory for every new blog, adding there all the assets, writing the markdown, commit to git and finally push. Lots of manual steps that eventually pulled me off from writing, I had so many excuses. 

A few months later I heard about [Stackbit](https://www.stackbit.com/), a platform that "glues" together all the elements of [JAMStack](https://jamstack.org/). A term coined a while back by [Netlify](https://www.netlify.com/), stands for __J__avaScript, __A__PI & __M__arkup. Obviously, it serves Netlify well by promoting its services but it also has a tremendous meaning of breaking the myth of server-side rendering apps. You can build performant web apps with static pages or even single-page applications when built right.

Going back to our story, Stackbit integrates the different components needed for a static site. First, you choose or build the theme for your website. I think they are currently focused on portfolio websites and personal blogs, but that's my guess. Second, you choose your favorite static site generators (Jekyll, Hugo, Gatsby, and more). It's a critical decision if you want to customize the prebuilt theme and add more capabilities to your website.
Finally, you select a CMS (Netlify CMS, Contentful and others) to manage your website content. In terms of hosting Stackbit only supports Netlify, pretty obvious, and GitHub as a Git platform.

If you are new to this JAMStack shenanigan, Stackbit makes it super easy to walk your first steps. It limits your decisions to a set of popular platforms and scaffolds the project for you. Everything just works from the first moment, whenever you push code to GitHub it will automatically deploy your site to Netlify and even when publishing new content in the CMS. Usually, the latter requires a bit more heavy-lifting. You even get a nice widget on your website to quickly navigate to your GitHub repo, Netlify, or your CMS. This widget also updates you about the status of the current deployment which is pretty neat.

With that said, this goodness comes with a burden. I feel like there is a lot of black magic going on behind the scenes. In order to abstract the CMS and the static site generator platforms, Stackbit had to develop many things from scratch which sometimes make it incompatible with the ecosystem. For example, I use Contentful and Gatsby but my Stackbit project doesn't use the community driver to integrate the two and Stackbit does the heavy lifting by downloading all the content from Contentful and providing it as a filesystem to Gatsby.
As a developer, I love to be in control so if there is some kind of magic I would like it to be documented or even manipulated by me.

Another thing is that Stackbit value is very clear in terms of creating the project, but once you've done it I'm not sure what it is. I know that they are in a beta phase so probably they are cooking more surprises. They mention in the website in-line editing and collaboration tools but I didn't see it implemented yet.

In any way, I believe Stackbit has great potential and can make our lives as independent bloggers much easier. In the future, using tools like Stackbit, having your JAMStack blog can be a commodity. For me, it made everything super easy. Now I have my own blog integrated perfectly with Contentful, I even changed the prebuilt theme and added advanced SEO features. Hopefully, it will drive me to write now that I don't have excuses.
