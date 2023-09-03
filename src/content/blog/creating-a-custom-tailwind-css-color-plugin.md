---
date: 2021-04-05T21:00:00.000Z
external: false
slug: creating-a-custom-tailwind-css-color-plugin
title: Creating a custom Tailwind CSS color plugin
---

Tailwind CSS is a utility first CSS framework. As such, it provides a lot of pre-built CSS classes that you can use immediately in your HTML without adding a single CSS file. But the one thing that makes it a fantastic framework is the ability to extend it even further. Tailwind CSS provides an API for other developers to write plugins that will help them to build beautiful user interfaces. In this post, I will show how to create a plugin for the caret-color CSS property. It doesn't come out of the box, but I find it useful.

## Tailwind CSS plugin

So what is a Tailwind CSS plugin exactly? It's a JavaScript function. Simple as it gets. To create a new plugin, we need to customize the Tailwind configuration file. Let's open tailwind.config.js file, and add a new plugin to the plugins array. We also need to import the tailwindcss/plugin module that is needed for writing custom plugins.

```
// tailwind.config.js
const plugin = require('tailwindcss/plugin')

module.exports = {
  // The rest of our Tailwind configuration
  plugins: [
    plugin(function(args) {
      // Our plugin
    }),
  ]
}
```

Our plugin function receives a single parameter that contains a few helper functions. We can use destructuring to extract only the ones we need. Most of the plugins will not need all of them.

According to [Tailwind CSS documentation](https://tailwindcss.com/docs/plugins), these are the available functions:
* addUtilities(), for registering new utility styles
* addComponents(), for registering new component styles
* addBase(), for registering new base styles
* addVariant(), for registering custom variants
* e(), for escaping strings meant to be used in class names
* prefix(), for manually applying the user's configured prefix to parts of a selector
* theme(), for looking up values in the user's theme configuration
* variants(), for looking up values in the user's variants configuration
* config(), for looking up values in the user's Tailwind configuration
* postcss, for doing low-level manipulation with PostCSS directly

With plugins, we can customize Tailwind as we desire:
* Adding new Tailwind utility classes
* Creating custom Tailwind components.
* Writing new variants.
* Extend Tailwind base styles.
* Even change PostCSS settings. 

I wrote plugins for my custom typography rules, button component classes, and now for caret color.

## Our new caret-color plugin

Our plugin's final result is to create new utility classes in the form of caret-gray-100 to set the CSS property caret-color the same way we can do with other properties such as background color, text color, border color, and others. With this in mind, let's create a new file caret.js. I like to create all my local plugins in a tailwind directory but suit yourself.

Here's our plugin:

```
const plugin = require('tailwindcss/plugin');

const generateColors = (e, colors, prefix) =>
  Object.keys(colors).reduce((acc, key) => {
    if (typeof colors[key] === 'string') {
      return {
        ...acc,
        [`${prefix}-${e(key)}`]: {
          'caret-color': colors[key],
        },
      };
    }

    const innerColors = generateColors(e, colors[key], `${prefix}-${e(key)}`);

    return {
      ...acc,
      ...innerColors,
    };
  }, {});

module.exports = plugin.withOptions(({ className = 'caret' } = {}) => {
  return ({ e, addUtilities, theme, variants }) => {
    const colors = theme('colors');
    const caretColors = generateColors(e, colors, `.${className}`);
    addUtilities(caretColors, variants('caretColor'));
  };
});
```

A quick search on GitHub or NPM will show that a caret-color plugin already exists, but I couldn't use it because it assumes a 2 levels color palette, and in my case, it's a bit deeper. But you can find the original version here: https://github.com/GraxMonzo/tailwind-caret-color.

Anyway, let's go ahead and see what's going on here. You can see that we use the withOptions variant to expose an options object for our plugin. In our plugin, the only option that we expose is the base class name of our utility classes. Our default is 'caret'.

First, we extract the colors from our theme. We use these colors to generate an object of utility classes using our generateColors function. The object consists of the class name as a key and the CSS properties as values. We provide the newly created caretColors to the provided Tailwind's addUtilities function. The second argument for this function is the variants that can be customized through Tailwind's configuration. Variants allow us to change the caret color in case of hover, active, dark mode, and other states. The generateColors is a recursive function that iterates over all the provided colors. Given the nature of the colors object, that its values can be either a string or another object, I thought that recursive would be the simplest way to go. So if the value is a string, we immediately add a new rule to our result. And if it's an object, we call the generateColors function with the child colors and extend the class prefix according to the key of the color. This way, we can get class in the form of `caret-xxx-yyy-zzz'. Please note that we use the e function to make sure we escape the classes.

The only thing left to be done is to add our new plugin to the Tailwind config file:

```
// tailwind.config.js
module.exports = {
  // The rest of our Tailwind configuration
  plugins: [
    require('./tailwind/caret'),
  ],
}
```

## Conclusion

Hooray! Tailwind CSS plugins are a fantastic tool to adapt Tailwind to our application and extend its functionality. Now we know how to create custom plugins for Tailwind CSS that are based on the theme. Feel free to use this template for whatever custom plugin you may want to create. 
