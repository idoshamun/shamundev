---
date: 2023-11-01T11:26:03.686Z
external: false
slug: client-side-servering
title: "Client-Side-Servering: My Perspective on Next.js Server Actions"
---

In the evolving web development landscape, we've witnessed many patterns, from server-side rendering to the flashy new 'Server Actions' introduced in Next.js 14. This innovation flips the script: now, the client code generates server endpoints, or, as I call it, client-side-servering. While not entirely novel—other frameworks dabbled here before - Next.js's extensive community and Vercel's backing signal a widespread adoption. But brace yourselves, the post is opinionated and skeptical of this new move.

## Server Actions

Consider the Server Action, illustrated below (taken from nextjs docs):

```jsx
export default function Page() {
  async function create(formData: FormData) {
    'use server'
    // mutate data
    // revalidate cache
  }
 
  return <form action={create}>...</form>
}
```

With a simple `'use server'` directive, a local function morphs into an endpoint, invoked automatically upon form submissions. Neat, right? But let's unpack this.

## The Promise

Server Actions propose a utopian file structure where client and server code coexist in harmony, echoing React's approach to HTML and CSS. The transpiler applies all best practices, security, performance, and support for disabled javascript environments.

## Security Concerns

Colocating client and server blur boundaries that are best kept clear. Unlike what react did to html and css there are security implications to blurring the lines. The transpiler's role in safeguarding against threats like SQL injections, CSRF, and sandboxing raises eyebrows. How much can it really handle? Traditionally, server-side-rendering puts the server in charge, which is a safe environment owned and controlled by us. With this new paradigm of client-side-serving, it's the client calling the shots, and that's a gamble that might not sit well with everyone.

## RPC

Server Actions == RPC, inheriting its drawbacks. The naive developer may overlook the network call behind a function call, neglecting necessary precautions like loading states, error handling, retries, and performance optimization. The abstraction surfaces concerns like do we know what data goes over the wire? Can we control it?

## Reusability

Custom endpoints empower developers with full control, useful for multi-platform applications. How does one invoke a Server Action from an Android app? And more importantly how do you make sure the contract doesn't change over time?

## Vendor Lock

Deploying Server Actions might initially be exclusive to Vercel, potentially creating a dependency on their ecosystem. Other providers may play catch-up, but with each nextjs update, the cycle repeats.

## Junior Developers

While seasoned developers might navigate these complexities, newcomers could be unaware. 
Educated in a world where Server Actions are the norm, oblivious to the underlying subtleties and what happens under the hood. I know I'm an old man yelling at the cloud, but give me a break.

## Conclusion

While a sprinkle of magic can enrich development and make us productive, Server Actions have crossed my line. I'd rather have good old server-side rendering to colocate my code. A word to the wise: ponder these reflections before using Server Actions.

There you have it — my take on Server Actions. Whether it's the future of web development or a step too far, only time will tell. But one thing's for sure: the debate is just getting started.

## Down the Rabbit Hole

If you want explore further, here are some thoughtful pieces:
- [Rich Harris's](https://www.youtube.com/watch?v=uXCipjbcQfM) insights on web development offer a refreshing perspective.
- [Matt Rickard's](https://matt-rickard.com/on-mixing-client-and-server) take on mixing client and server echoes similar sentiments.
- [A tweet on JSX](https://twitter.com/bcomnes/status/1719032058474029339) captures the essence of simplicity in language use.