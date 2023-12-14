---
date: 2023-12-14T16:02:21.748Z
external: false
slug: type-safety
title: Type Safety for the Rest of Us
---

Unless you live under a rock, you probably saw the controversy around Turbo 8 dropping TypeScript. DHH just loves doing that. I've been developing type-free applications for quite a while, which comes with a cost.

I've built projects in JavaScript and Python with no types (not even type hints!).
And as long as all developers can memorize the project and the context, you will probably be fine. The problem starts when you have to onboard new developers or go on a two-week holiday and come back. Suddenly, you are not sure what this function returns (if at all) or what the second argument is. This is when you start looking for solutions to better document your code, either by using TypeScript (in the case of JS) or by introducing tooling to help you, like JSDoc, mypy, and others. What tool to use is a subjective matter and dependent on the language and ecosystem. But no doubt you'll need one.

Developing applications without types gives you a perceived feeling of speed. You can move fast. You don't have to pause on the nuances of a typing system. You just code whatever you want. But code like code is something we often change; we need to fix bugs, extend capabilities, maintain, etc. Follow-up attempts to read the code will end up with you trying to decipher the types and trying to remember how the hell you named this property that you really need to use now. Yes, it will take you longer to write type-safe code, and yes, you'll probably bang your head in the wall once or twice, but you'll get much more maintainable code that you can revisit and patch in the future. You'll get an enforcement and compilation process to validate your code, reducing the likelihood of unexpected behavior (to some extent 😬). I've debugged and fixed too many production issues that could have been detected during build time to know it's not fun and something I'd like to avoid as much as possible.

You should be careful not to abuse the type system, though many developers use the `any` type to overcome typing challenges. This is where things get messy; if you use a typed language, use it properly. This hybrid approach will lead you to more chaos than you think. And this is why many developers are frustrated about that.

So unless you're DHH, give yourself a break and don't overlook types. If your favorite language is statically typed, good for you. Otherwise, look for a type of hinting solution that can help you with that. Save yourself countless hours debugging weird stuff.
