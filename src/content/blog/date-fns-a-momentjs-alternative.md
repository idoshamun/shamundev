---
date: 2020-09-22T10:53:23.000Z
external: false
lastmod: '2020-12-19T17:00:26.878Z'
slug: date-fns-a-momentjs-alternative
title: 'date-fns: a moment.js alternative'
---

JavaScript Date is no fun! It's OK for the basics, but once you want to do more complex manipulations, you have to go back and forth from milliseconds (number) to Date. It makes our code less readable and coding more tedious.

[Moment.js](https://momentjs.com/) was my go-to library for everything that has to do with dates. JavaScript date format, adding or subtracting time, converting between timezones, and many more. Momentjs has its drawbacks, but it was a great tool. Unfortunately, the team decided to declare that it's now in maintenance mode and is considered a legacy project. It means only one thing we have to look for alternatives.

Recently, I started using [date-fns](https://date-fns.org/), and I like it! date-fns is a set of utility functions for JavaScript dates. Unlike moment, date-fns uses the Date object and doesn't create a new object to encapsulate it. 
Second, it's genuinely a set of functions. You import whatever functions you want and use them with the Date objects. Yes, yes, you got it right, tree-shaking out-of-the-box! Your production bundle will include only the functions you export and used.

On their website, they mention a few more perks, which are fantastic! Typescript support, immutable by default, consistent with timezones, internationalization & localization support (with tree-shaking as well!), and more goodies.

The community is already pretty big with 181 contributors, including financial contributors, among them you can also find Addy Osmani.

Coding time!

```js
import { format, formatDistance, formatRelative, subDays } from 'date-fns'

format(new Date(), "'Today is a' iiii")
//=> "Today is a Monday"

formatDistance(subDays(new Date(), 3), new Date())
//=> "3 days ago"

formatRelative(subDays(new Date(), 3), new Date())
//=> "last Friday at 7:26 p.m."
```

Please note that we import only functions and provide them with a regular js date object.

To achieve the same with moment.js:

```js
import moment from 'moment';

`Today is a ${moment().format('dddd')}`
//=> "Today is a Monday"

moment().subtract(3, 'days').fromNow()
//=> "3 days ago"

moment().subtract(3, 'days').calendar();
//=> "Last Friday at 7:26 p.m."
```

This time we have to import the moment function, which creates a new object with all momentjs functionality. It means no tree-shake, and we cannot use js date object. We must convert it to a momentjs object first.

I think that's all you need to know to give it a try and see if you like it. 

P.S
I want to thank the moment.js team from the bottom of my heart! ❤️


## More posts that might be interesting as well

* [Managing multiple NodeJS versions](https://daily.dev/posts/managing-multiple-nodejs-versions)
* [My 5 Practical CSS Tips](https://daily.dev/posts/my-5-practical-css-tips)
* [Breaking The Gateway](https://daily.dev/posts/breaking-the-gateway)
* [Theming styled-components with CSS custom properties](https://daily.dev/posts/theming-styled-components-with-css-custom-properties)
* [I've made up my mind. I know how to choose my next tech stack ✨](https://daily.dev/posts/ive-made-up-my-mind-i-know-how-to-choose-my-next-tech-stack)

