---
date: 2020-10-05T12:53:49.000Z
external: false
lastmod: '2020-12-19T16:59:34.488Z'
slug: my-react-typescript-cheat-sheet
title: My React-TypeScript Cheat Sheet
---

Ever since I started using TypeScript, I can't stop using it. Sometimes finding the correct type and where you should import it from can be a real headache. Especially when building a ReactJS application. This blog post is a great chance to publicly document my most used React TypeScript types. I focus on functional components and react hooks.
The structure of the article is that each paragraph is a standalone tip.

To create a React TypeScript project, we can use Create React App:
```bash
npx create-react-app my-app --template typescript
```

There have been lots of talks about the right way to import React. This is the most updated way to do it:
```jsx
import React from 'react';
```

The return type of a functional component is `ReactElement`
```jsx
import React, { ReactElement } from 'react';
const Component = (): ReactElement => {
  return <></>;
};
```

If you want to extend the props of a native HTML element, you can use the generic class `HTMLAttributes`. Let's say I want to create a new button:
```jsx
import React, { HTMLAttributes } from 'react';

interface MyButtonProps extends HTMLAttributes<HTMLButtonElement> {
  ...
}

const MyButton = (props: MyButtonProps): ReactElement => {
  return <button {...props} />
}
```

Note that we use destructuring to forward the props to the button element.

The children prop is of type `ReactNode`.

React's events system uses its own types and not the native HTML events. Make sure to import the event from the react library. `import { MouseEvent } from 'react'`.

Pass the correct type to the `useRef` generic. If you want to create a ref to an input element:
```jsx
import { useRef } from 'react';

const ref = useRef<HTMLInputElement | null>(null);
```
The `ref.current` type will automatically be `HTMLInputElement`.

The same goes for `useState`.
```jsx
import { useState } from 'react';

const [myState, setMyState] = useState<boolean | null>(null);
```
If you provide an initial value in both cases, the type will be inferred implicitly.

When creating custom hooks make sure to explicitly set the returns type. Otherwise, TypeScript may infer incorrectly the types.

This is far from being a complete cheat sheet but rather documents the things I use the most. Check out this awesome cheat sheet for more information: https://github.com/typescript-cheatsheets/react.

