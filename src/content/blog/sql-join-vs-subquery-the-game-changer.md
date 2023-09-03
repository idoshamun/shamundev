---
date: 2020-11-19T14:24:54.000Z
external: false
lastmod: '2020-12-19T16:59:03.263Z'
slug: sql-join-vs-subquery-the-game-changer
title: 'SQL Join vs Subquery: The Game Changer'
---

When building an SQL query that involves multiple tables, there is always a constant debate about joining the tables or using subqueries.

There are pros and cons to every method. My natural choice is to join the tables. I find it easier to maintain and read. But there's one use case where I'll definitely favor a subquery over a join.

Let's say we're building a blogging system where we have two data models, posts, and comments. The relation between the two is one to many. For every post, there can be many comments.

Now we would like to build an endpoint that returns the top 10 newest posts along with their top 3 newest comments.
The first idea that might come into our heads is to first query for the top 10 posts, and then we can query the comments. We can also consider joining the two tables together, resulting in 30 rows and grouping them in the backend. 

What if I told you that we could create a query that returns the relevant posts and comments without any application code required?

![Say what GIF](https://cdn.hashnode.com/res/hashnode/image/upload/v1608396886205/Quy2-1G0y.gif)

Recently, I discovered the awesomeness of Postgres JSON capabilities! Using JSON functions, we can easily accomplish this task. We can create queries that will make you feel like you're using MongoDB.

Let's see it in action!

```sql
select id, title, (
    select coalesce(jsonb_agg(res), '[]'::jsonb) 
        from (select id, content from comment 
            where comment."postId" = post.id 
            order by "createdAt" desc limit 3) as res
) as comments
from post
order by "createdAt" desc
limit 10;
```

Breath, relax, take a moment to sink it in, and let's see what we've done here...

I assume you have a basic SQL understanding, so you probably understand the general schema. Let's dive into the complex part:

```sql
(
    select coalesce(jsonb_agg(res), '[]'::jsonb) 
        from (select id, content from comment 
            where comment."postId" = post.id 
            order by "createdAt" desc limit 3) as res
) as comments
```

We create here a subquery in a subquery. The inner select creates a result set that stores the newest 3 comments for every post in the main query. 

```sql
select id, content from comment 
            where comment."postId" = post.id 
            order by "createdAt" desc limit 3
```

This is achieved by adding the where clause that refers to the post table. So far, basic subquery stuff.

Now here's the cool part `jsonb_agg`. `jsonb_agg` is an aggregate function, just like `count`. Aggregate function turns a result set of N rows into a single value. In our case, `jsonb_agg` turns N rows into a real JSON array! The b in `jsonb` stands for binary. It encodes the result as binary data for optimizing the response size. The database driver knows to decode it back to a regular JSON object, so don't you worry.

Using `jsonb_agg`, we dynamically create a JSON array for every post that contains the newest 3 comments.

The last part is the `coalesce`, which makes sure that if a post has no comments at all, an empty array will be returned.

Whenever I have to create a query that returns a complex query such as above, I will always go with subqueries and the brilliant `jsonb_agg`. This is very common when building a GraphQL server. It's a great way to solve the N+1 problem.

You survived this far, and I'm proud of you! I hope I unlocked you a new set of features for your next SQL query.






