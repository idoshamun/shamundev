---
date: 2020-07-06T13:00:24.000Z
external: false
lastmod: '2020-12-19T17:04:26.936Z'
slug: managing-your-secrets-in-git
title: "Managing your secrets in Git \U0001F5DD"
---

We have always been told not to store secrets in Git. They may be revealed to a potential attacker and can be misused. But what if I told you that at [daily.dev](https://daily.dev), we manage all our secrets in Git?

![Say what meme](https://cdn.hashnode.com/res/hashnode/image/upload/v1608397432713/MfUZQZelZ.gif)

Introducing [git-crypt](https://github.com/AGWA/git-crypt), a git addon that automatically encrypts and decrypts secrets upon commit and checkout.
You need to define what files git-crypt (more on this later) should encrypt and it will take for the rest.
The most incredible feature is that you can't even tell that the files are encrypted. The process is fully transparent to the end-user. It is compatible with git diff and all other git operations. The one single change is that now remote files are encrypted and cannot be accessed without the encryption key.

Now that we can encrypt our secrets we don't have to worry about them being leaked or misused by others. git-crypt follows the best practices in terms of encryption and security.

Before we dive into how exactly we can utilize this tool, let's review the pros and cons.

## Cons

* Secrets cannot be edited without pulling the code.
* No fancy UI to edit the secrets.
* Developers need git-crypt to read and write secrets.
* Secrets cannot be shared across projects easily.
* When reverting the repository, the configuration will be reverted as well and this may cause an out-of-date config to be used.

## Pros

* Infrastructure as code, one of my favorite design patterns. The secrets are managed in Git and thus you can apply any code workflow you are used to. Code reviews, reverts, version comparison, and more.
* Secrets schema is always aligned with the application code. Secrets and application code are deployed as a single unit so even if you revert your application version, the configuration will be reverted as well, making sure the schema is compatible with the code.
* Secrets cannot be shared which forces you to create a standalone config. Sharing secrets between services is just like sharing a database connection, it's a dependency the forces you to coordinate deployments. It's very hard to maintain these dependencies in the long term.
* You know exactly where to find all the secrets for your application.
* CI/CD can easily access the secrets.

By now, you probably understand that this method is not for everyone or every use case. If you are a die-hard fan of infrastructure as code like I do, make sure to test it out.

Let's try it out.
![Coding meme](https://cdn.hashnode.com/res/hashnode/image/upload/v1608397434537/yjcg7MVO3.gif)

## Installing git-crypt

For Brew users, like myself, it's super easy to install:
`brew install git-crypt`

The others probably have to build it from source, but worry not. It should be pretty straightforward as well. [Instructions can be found here](https://github.com/AGWA/git-crypt/blob/master/INSTALL.md).

## Initialization

We need to let git-crypt initialize its environment in our repository. Navigate to your repo and run:
`git-crypt init`

## Configuration

Let's open the `.gitattributes` file in our repo's root directory. We need to add the files and [glob patterns](https://en.wikipedia.org/wiki/Glob_(programming)) we would like to encrypt.

Here is an example:
```
secretfile filter=git-crypt diff=git-crypt
*.key filter=git-crypt diff=git-crypt
secretdir/** filter=git-crypt diff=git-crypt
```

In this example, git-crypt will manage the following files:
* A file named `secretfile`.
* All files that end with `.key`.
* All files that are in the `secretdir` folder and its children.

## Adding a new collaborator

This is the tricky part. You need to run this command for every collaborator of the project, including yourself. Otherwise, this person will not be able to decrypt the secrets. Note that you must have GPG installed for running this command (out of the scope of this blog post).
`git-crypt add-gpg-user USER_ID`

`USER_ID` can be a key ID, a full fingerprint, an email address, or anything that uniquely identifies a public key to GPG.
Once you run this command git-crypt will commit the new changes to apply them. A nice side effect, you can keep track of your collaborators through the git history.

## Unlocking an existing repo

If you pull an existing repo that is protected by git-crypt, you need to unlock it to decrypt everything. You need to make sure that you are a collaborator and has access to the encryption key.
Simply run:
`git-crypt unlock`
And that's it, the encrypted files are now decrypted and ready for you to edit them.

That's it! 🌟 You are ready to go and store your secrets in Git. Make sure to let me know how it goes down in the comments 👇
