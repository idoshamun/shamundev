---
date: 2021-03-30T06:37:58.000Z
external: false
slug: my-tailwind-css-utility-function-for-creating-reusable-react-components-typescript-support
title: My Tailwind CSS utility function for creating reusable React components (TypeScript
  support)
---

We recently started the transition from styled-components (CSS-in-JS) to Tailwind CSS. I explain in detail why in my blog post:  ["Why I moved from styled-components to Tailwind CSS and what's the future of CSS-in-JS?"](https://daily.dev/blog/why-i-moved-from-styled-components-to-tailwind-css-and-whats-the-future-of-css-in-js).

Although Tailwind CSS tends to be more performant, I still love the styled-components developer experience. Tailwind CSS, at its core, is a PostCSS plugin. All you need to do to use it is to add it to your postcss.config.js file. By nature, a PostCSS is more limited in the features it can offer compared to a JavaScript solution like styled-components or emotion.

## The styled experience

The single feature that I like the most about styled-components is the styled function. It provides us the ability to create designed React components and use them everywhere and even extend them. Let's see an example:

```
import styled from 'styled-components';

const Button = styled.button`
  color: grey;
  background-color: white;
`;
```

See how easy it is to create a new styled component? You don't need to create a CSS file nor use JSX. We use the styled utility and set the design we want. Inside the template literals, we use the good-old CSS syntax with some enhancements such as nesting, autoprefixer, etc. We can now use Button just like every React component. Place it everywhere you want.

## Tailwind components

To create a new Tailwind CSS component in our React project, we have several methods:

* Store the className attribute in a variable

```
const buttonClass = 'bg-green-500 text-white';

// and then use it everywhere like this
<button className={buttonClass} />
```

* Create a dedicated React component that set the relevant classes

```
export default function Button(props) {
  return <button className="bg-green-500 text-white" {...props} />
}
```

* Create a custom class using the Tailwind utility function @apply. The apply function allows embedding utility classes styling in a new custom class.

```
.my-btn {
  @apply bg-green-500 text-white;
}
```

Every method has its pros and cons, but still, I find the developer experience lacking compared to the great experience of the styled function. 

## My classed utility function

When working on a design system or a UI components library, we want to quickly build components with the appropriate styling. The less boilerplate, the better.
Here's my classed function inspired by the styled function. The best thing is that it comes with TypeScript support, and it also supports Preact.

```
import React, {
  Attributes,
  ClassAttributes,
  ElementType,
  FunctionComponentElement,
  ReactElement,
} from 'react';
import classNames from 'classnames';

function classed<P extends Record<string, unknown>>(
  type: ElementType,
  ...className: string[]
): (props?: (Attributes & P) | null) => FunctionComponentElement<P>;

function classed<
  T extends keyof JSX.IntrinsicElements,
  P extends JSX.IntrinsicElements[T]
>(
  type: keyof JSX.IntrinsicElements,
  ...className: string[]
): (props?: (ClassAttributes<T> & P) | null) => ReactElement<P, T>;

function classed<P extends Record<string, unknown>>(
  type: ElementType | keyof JSX.IntrinsicElements,
  ...className: string[]
): (
  props?: (Attributes & P & { className?: string }) | null,
) => ReactElement<P> {
  return function Classed(props) {
    return React.createElement(type, {
      ...props,
      className: classNames(
        // eslint-disable-next-line react/prop-types
        props?.className,
        ...className,
      ),
    });
  };
}

export default classed;
```

And that's how we use the new classed function:

```
const Button = classed('button', 'bg-green-500 text-white');
```

The first argument is the element that we want to use, and the rest are tailwind classes or any other classes.

Let's take a look under the hood of this function. The first thing we noticed is that we need to install the classNames dependency from NPM. I could get away from using it, but I already use it in my project, so it's much easier this way.  [You can read about it on GitHub](https://github.com/JedWatson/classnames#readme). Shortly, it makes manipulating the className property much easier.

For complete TypeScript support, we define this function three times. It's a type overloading technique that helps us define more accurate types of our functions. The first definition is for custom React components. For example, if want to extend the previous Button component as follows:

```
const BigButton = classed(Button, 'py-4 px-8');
```

The second definition is HTML default elements such as button, anchor, div, section, etc. And lastly, the third definition is a unified version of the previous two and the implementation. The function returns a new component that is a proxy for the provided component. In the above case, our Classed component creates a Button element. The only difference is that it sets the className attribute according to the rest of the parameters. The new component supports providing additional classes, and it concatenates everything together. It also fully supports PurgeCSS to make sure we have minimal bundle size. And does not require changes to tailwind.config.js or babel.

The classed function is not yet available as a standalone package, but you can copy it to your project and use it as you please.

There we have it! I hope you like my utility function and use it in your next React project, whether it's a create-react-app project, Next.js project, or any other. You can even replicate the same concept into your Vue project. 
