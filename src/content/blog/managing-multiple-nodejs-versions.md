---
date: 2020-09-14T11:22:35.000Z
external: false
lastmod: '2020-12-19T17:01:03.312Z'
slug: managing-multiple-nodejs-versions
title: Managing multiple NodeJS versions
---

We all switch around different projects, sometimes even daily. Every project has its own requirements in terms of dependencies and runtime. Lucky for us, NPM takes care of the dependencies but we still need to manage the runtime. Some projects may use a LTS version and others may live on the edge and use the latest version of node.

# Meet NVM

nvm (node version manager) manages multiple node versions and switch between them in an instant.
Even if you use a single node version, it's so much easier to install and update it via nvm.

# Installing

Install it using this one-liner:
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
```

Or check out the full instructions on the [GitHub repo](https://github.com/nvm-sh/nvm)

# Getting Started

Let's say we want to install node v14.3.0, it's easy as:
```
nvm install 14.3.0
```
Just change 14.3.0 to your required version.

If you want to install the latest LTS, run:
```
nvm install --lts
```

Once we have a few node versions installed we can activate a specific version with the use command:
```
nvm use 14.3.0
```

# Global modules

Global modules are not shared across different node versions. You have to install the global dependencies for every node version. It can be annoying but it makes sense. Some dependencies might not be compatible with certain node version.

# .nvmrc

Here is the best part! You can add to your project a .nvmrc file to specify exactly the node version.
Going back to our example before, let's save our node version to .nvmrc.

```
echo "14.3.0" > .nvmrc
```
Now every time I `cd` into this directory or its children, I can run `nvm use` to activate the version of my project. In our case it's 14.3.0.

I can even commit this file to the git repo so other developers can use it as well.

That's it! Now you can easily switch between projects without thinking about the desired node version. 👾



_[Daily](https://api.daily.dev/get?r=devto) delivers the best programming news every new tab. We will rank hundreds of qualified sources for you so that you can hack the future._


