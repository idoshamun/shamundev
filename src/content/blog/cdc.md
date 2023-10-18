---
date: 2023-10-18T12:52:56.580Z
external: false
slug: cdc
title: CDC Changed the Way I Build Software
---

I first learned about Change Data Capture (CDC) few years back thanks to the magnificent book by Martin Kleppmann, [Designing Data-Intensive Applications](https://www.amazon.com/Designing-Data-Intensive-Applications-Reliable-Maintainable/dp/1449373321). That was a pivotal moment in my software development journey. In this blog, we'll delve into what CDC is and why it's a vital ingredient in the recipe of modern software development.

## The Basics

At its core, CDC serves as a design pattern employed to monitor changes within a database by leveraging a third-party service. It functions akin to external database triggers, furnishing the capability to respond to any database alteration at the application level—effectively extending the reach beyond the confines of the database itself. Now, how cool is that?

## Why CDC matters

To grasp the transformative power of CDC, a closer look at the concept of "distributed transactions" is essential. Consider a scenario where we're developing a notification system tasked with maintaining a feed of notifications while also sending corresponding emails to users. One critical function here is adding a notification to the database. A naive approach might involve a function that sequentially adds a record to the database followed by sending an email. However, this simplicity unravels when we confront the complexities of failure scenarios — what if sending the email encounters an issue? Should we trigger a database rollback? How can we extend this functionality to include other channels, such as push notifications? This delicate orchestration is precisely what constitutes a distributed transaction — a composite action involving multiple services that either succeeds or fails as a unified entity.

With CDC, our database becomes the ultimate source of truth for every operation. Returning to our example, the "add notification" function, with CDC in play, only needs to append a single row to the database. By capturing changes in the notifications table, CDC allows us to identify the addition of a new row and trigger the email accordingly. If the email encounters a glitch, we can retry the operation without impacting users, as it seamlessly operates in the background. This eradicates the need to grapple with the intricacies of distributed transactions. Our primary function remains lean, responding to users more swiftly, ensuring fault tolerance through retry mechanisms, and effortlessly expanding to more subscribers like push notifications. While introducing a marginal delay in email delivery compared to the naive implementation, this approach proves negligible in the vast majority of cases.

## How CDC changed my practices

CDC is the easiest way to build event driven systems. When I approach modeling a system, I try to offload as much as possible to the background and keep only the crucial database updates in the foreground. My API usually cosists of validations, business logic, and writing to the database. The rest happens in the background.

Embracing CDC has fundamentally transformed how I approach building event-driven systems. My system modeling strategy now involves a deliberate effort to shift a significant workload to the background, reserving the foreground for critical database updates. In essence, my API framework predominantly encompasses validations, business logic, and writing to the database. The rest happens in the background.

This shift in approach not only streamlines the foreground processes but also enhances the overall efficiency of the system. CDC has become my go-to solution for architecting systems with an event-driven mindset, allowing me to optimize performance, enhance maintainability, and ensure a robust background processing infrastructure.

## A Word of Caution

Analogous to the caution against two services directly accessing the same database, I strongly discourage the exposure of CDC messages owned by service A to service B. CDC, being sensitive to database schema, carries the inherent risk that alterations in the schema can disrupt the functionality of other services. To circumvent this potential pitfall, I adopt a proactive strategy by constructing a dedicated background processor.

This background processor is responsibile of transforming CDC messages into standardized business events. It shields services from direct exposure to database schema. This approach guarantees that the events generated are easily consumable by other services, fostering a robust and reliable communication channel between distinct components of the system. By employing this method, I mitigate the risk of schema changes becoming a disruptive force, enhancing the overall stability and interoperability of the system.

## Debezium

[Debezium](https://debezium.io/) is an open-source platform that implements the CDC pattern. It streams the changes from the source database to a publisher of your choice. Debezium seamlessly integrates with an extensive array of sources and publishers, we use postgres and Google Pub/Sub. It has vibrant community and I can't recommend it more. If you're intrested in embracing CDC that's your go-to tool.

## Conclusion

I strongly encourage you to explore and dive deeper into the realm of CDC. Whether you implement it immediately, having this tool in your repertoire is invaluable. Reflecting on my own journey, integrating CDC was a transformative moment, and I am confident it has the potential to be a game-changer in your endeavors as well. Keep this tool in your toolkit—it might just be the key to unlocking new dimensions in your software development journey.