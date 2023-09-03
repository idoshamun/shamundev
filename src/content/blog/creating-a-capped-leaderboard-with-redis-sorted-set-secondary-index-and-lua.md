---
date: 2021-03-01T07:04:28.000Z
external: false
slug: creating-a-capped-leaderboard-with-redis-sorted-set-secondary-index-and-lua
title: "Creating a capped leaderboard with Redis sorted set, secondary index, and\
  \ Lua \U0001F947"
---

Leaderboards are all around us. Gone are the days that we could found leaderboards only in arcades and games. Nowadays, every product has gamification baked-in. It can be a referral program leaderboard, users leaderboard by karma or reputation, and others. Seeing a leaderboard automatically drives us into action. We want to capture the first place and receive eternal fame and glory! 🚀

There are endless ways you can build a leaderboard for your product. In this blog post, I want to focus on a specific one that involves Redis. We implemented it not so long ago in our [Buzzword Quiz](https://buzzwordquiz.dev/) project. [You can read more about it here](https://daily.dev/blog/meet-our-5-days-open-source-side-project-and-its-tech-stack).

## Why Redis?

Redis is an open-source in-memory multi-purpose store. It can be used as a standalone database, cache, and even a message broker. Just like SQL databases have PL/SQL for scripting, you can use Lua to augment Redis with new functionality. It has vast support of data structures that include even geospatial indexes.

Not every use case is a good fit for Redis, though. Being an in-memory store, it might be costly to store lots of data there. You need high memory machines that Redis can utilize to store all the data, and they do cost. On the other hand, in-memory means blazingly fast. Querying Redis is usually faster compared to other disk-based alternatives. Of course, this a rule of thumb and may vary between different use cases. Do your homework before you choose your database!

Anyway, for Buzzword Quiz, it makes perfect sense because the leaderboard is capped to 100 rows, and every row contains the score, name (limited by 20 characters), date, and session id. It's roughly 50 bytes per row. This sums up to 5 kB for the whole leaderboard. It can be stored easily on every machine. Thanks to Redis, our leaderboard is loaded extremely fast.

## Sorted set

The sorted set is a Redis data structure that is exactly what we need for our leaderboard. Like any set you know, the data structure stores an array of unique values. The only difference is that a score value accompanies each value. This score is used to order the elements in the set from the smallest to the greatest. The sorted set comes built-in with a set of commands that will help us utilize it to its best. There are the obvious commands to add, update, and remove. But there are also commands to get the rank of a given value, get values by rank, or even get all the values with a score in a given range.

## Secondary index

Sometimes you don't want your sorted set to be your primary data structure for your data. It might make more sense to store your data primarily using the good old string data structure or a hash. And only use the sorted set as a secondary index. In our example, we will use the string data structure to store a JSON encoded string representing a single session. We will then index the session in the sorted set where the score value is the number of correct answers in the session, and the value will be the key to the string that holds the information about the session. It might be a bit abstract, but we will see everything in action in a few moments. Stay with me here.
By applying the secondary index technique, we can query our data in more ways without replicating it. It might come with a slight performance impact, but this is usually neglectable, but again, do your checks.

## Let's build something already

Enough with the chit-chat and the long introduction, let's get it started. We will use Node.js and ioredis. You can easily implement the concept in other languages as well.

We start by installing ioredis:
```
npm i ioredis
```

And if we need TypeScript support, we need to install the types:
```
npm --save-dev i @types/ioredis
```

Now, we need to instantiate a client to communicate with our Redis server:
```
import Redis from 'ioredis';

export const redisOptions = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT, 10),
  password: process.env.REDIS_AUTH,
};

export const redis = new Redis(redisOptions);
```

We extract the Redis connection options from the environment variables. This way, we don't store secrets in our code. We set the host, port, and, if necessary, also the authentication string. We export the newly created client so that other modules can consume it.

### Add a new session

Let's proceed by creating a function that adds a new entity to our leaderboard. A leaderboard entity is a single session that includes the id, name of the player, date, and score. When we want to store complex objects in Redis, we can store them as a hash data structure or a string. For simplicity's sake, we will save it as a string. But for more complex use cases, it might be better to proceed with a hash. When adding a new session, we have to save it as a string and add it to the leaderboard.

```
export function addNewSession(session) {
  const sessionKey = `session:${session.id}`;
  return redis
    .pipeline()
    .set(sessionKey, JSON.stringify(session))
    .zadd('session.score.index', session.score, sessionKey)
    .exec();
}
```

Our function starts by defining the key for our session object in Redis. A key is always a string. We follow the Redis convention `object name:id`. In our case, the object name is "session" and we concatenate its ID. Next, we initialize a pipeline. A pipeline is a mechanism to send multiple commands to the Redis server in a single round trip. We know we want to run multiple commands at once, adding the new session and indexing it in a sorted set. It's a waste to run each command separately. This is exactly why pipeline exists. Don't confuse with transactions though, pipeline doesn't promise atomicity.

Our pipeline starts by sending a SET command to store our session object. In JavaScript, it is equal to:
```
obj[sessionKey] = JSON.stringify(session)
```

Now, we have to add a secondary index to the score value of the session. We use the ZADD command to do exactly this. Our sorted set key is `session.score.index`, and we provide it with the actual score and the key to our session object. The key will be used to fetch all the information later on for the leaderboard. We then execute the pipeline, which returns a promise.

But something's still missing in this function. We want to have a logical cap of 100 rows for our leaderboard. Capping the leaderboard will make sure we don't have data overflow. This is the tricky part because it cannot be achieved with a single command, unfortunately. But lucky us, Redis can be extended using Lua. Let's create a new command that will trim our leaderboard.

ioredis provides a simple interface to define new commands. It assumes a signature of:
```
command key1 value1 key2 value2...
```
Our new sortedTrim command needs a single key and value. The key will be used to access the sorted set, and the value will hold the limit.

```
redis.defineCommand('sortedTrim', {
  numberOfKeys: 1,
  lua: `
    local index = -(ARGV[1]+1)
    local keys = redis.call("zrange", KEYS[1], 0, index)
    redis.call("del", unpack(keys))
    redis.call("zrem", KEYS[1], unpack(keys))
  `,
});
```

Looking at our new command, we first extract all the excessive keys in the leaderboard. We use the ZRANGE command that returns all values in a given rank range in a sorted set. `redis.call` is used to send a command to Redis through the Lua interface. The first argument is the command, followed by its arguments. ZRANGE's first argument is the key of the sorted set, which is the key that our sortedTrim receives. The second argument is the starting rank. The sorted set is sorted in ascending manner, so zero means the smallest score in the set. The last argument is the end rank of the range. Note that we are sending a negative value. This indicates Redis that the offset is from the end of the sorted set. It means running this command will return all the keys of the sorted set except the greatest N scores. With N being the argument that we pass to the sortedTrim command.

Once we have the keys, we can delete the objects and remove them from the sorted set. We will use the DEL command to delete the objects and ZREM to delete their secondary index in the sorted set. The unpack function here takes an array and sends it multiple arguments, just like the JavaScript rest operator.

Our sortedTrim command is ready, so let's use it and update our function:
```
export function addNewSession(session) {
  const sessionKey = `sessions:${session.id}`;
  return redis
    .pipeline()
    .set(sessionKey, JSON.stringify(session))
    .zadd('session.score.index', session.score, sessionKey)
    .sortedTrim('session.score.index', 100)
    .exec();
}
```

Once we define a new command, we can use it as part of our pipeline. ioredis takes care of it for us, so convenient. We provide the sortedTrim command the name of our sorted set and our leaderboard limit.

That does it. It's time to query the leaderboard.

### Get the leaderboard

Getting the leaderboard is also a bit tricky because the sorted set only stores keys to the actual objects. Unfortunately, Redis doesn't have a join-like mechanism in-place as we have in SQL databases. Again, just like we did before, we can extend its functionality by creating a new command. This will save us a roundtrip and make it easier for us. We will call this new command leaderboard.

```
redis.defineCommand('leaderboard', {
  numberOfKeys: 1,
  lua: `
    local keys = redis.call("zrevrange", KEYS[1], 0, ARGV[1])
    if next(keys) == nil then
      return {}
    end
    return redis.call("mget", unpack(keys))
  `,
});
```

Our new command accepts a single key of the sorted set and how many sessions to extract. ZREVRANGE command, like the ZRANGE command, returns the values of the sorted set within a given rank range. The only difference is that ZREVRANGE does it in a descending manner, hence, "rev" (reverse). In short, we use ZREVRANGE to get the top N values in the sorted set. Once we have the keys, we need to get their values using the MGET command. The MGET command returns all the string values of the given keys. One caveat, we need to make sure that if ZREVRANGE returns an empty response, we will return before calling the MGET. Otherwise, the command will fail.

```
export async function getLeaderboard() {
  const response = await redis.leaderboard('session.score.index', 100);
  return response.map(JSON.parse);
}
```

All the is left to do is call our custom command and parse our JSON encoded/ strings.

## Conclusion

This was quite a long article, but I'm proud that you made it so far. By now, you should have an understanding of what the Redis sorted set is and when to use it. How to add a secondary index to your Redis data and create custom commands using Lua to extend Redis. We also learned how to use ioredis and how to create a capped leaderboard using Node.js and Redis.
