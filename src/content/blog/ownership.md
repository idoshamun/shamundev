---
date: 2023-11-10T16:40:03.289Z
external: false
slug: ownership
title: Ownership as the Key to Engineering Scalability
---

As engineers, the conversation often centers around system scalability. However, for startups, organizational scalability is an equally crucial aspect to consider. As startups rapidly expand, it falls upon us as managers to ensure this growth is managed healthily, fostering an environment where the company can flourish. A pivotal strategy in achieving this is empowering engineers with complete ownership of their projects from inception to completion. This approach nurtures their professional growth, minimizes reliance on stakeholders, alleviates the burden on team leads, and enables the company to move fast (and hopefully not break things). At daily.dev, we've crafted a unique method to bring this theory to life. Let's delve into how we accomplish this.

## Feature lead

This role goes by many names, but we call it the "Feature Lead." Essentially, every feature is championed by a single engineer who takes on the responsibility of bringing it to life. This doesn't imply they work in isolation. Instead, they are the go-to person for that feature. Everyone, including non-engineering stakeholders like product and design, recognizes their role.

The assignment of a feature lead is a decision made by the team lead once a feature transitions from the product planning phase. Upon being appointed, the feature lead embarks on developing the feature.

## Decision record

Developing a feature begins with creating a detailed document called the "Decision Record" (DR). This document serves as the blueprint for the entire feature, outlining the proposed system design clearly and comprehensively. Key components of the DR include database schema modifications, API changes, events, data flow diagrams, and other critical details that enable stakeholders to assess and understand the proposed solution.

An integral part of the DR is the breakdown of the feature into specific tasks. These tasks are then incorporated into the sprint planning and assigned to various engineers. The review process for the DR is thorough, involving the team lead and myself as the CTO and other team members. In cases where the feature requires integration with other systems, members of the relevant teams are also involved in the review process. For significant features, multiple rounds of review may be necessary before the finalization of the DR.

As our engineering org has grown, the importance of getting this initial step right has become increasingly apparent. Amending a plan at this stage is far more cost-effective than reworking an incorrectly implemented feature. We aim to minimize instances where a pull request must be entirely rewritten due to misalignment with the initial plan. The DR has proven invaluable in achieving this, ensuring alignment and clarity right from the outset.

## Bringing the plan to life

With the DR in hand, our engineers hit the road and start building the feature. The DR offers a broad overview of the project and provides detailed guidance on executing specific tasks. During this process, engineers consult with the feature lead if any technical queries or concerns arise. The feature lead makes final decisions on technical matters, which are respected and adhered to by the entire team.

An essential part of the feature lead's responsibilities is to review all relevant PRs. This is to ensure that every aspect of the implementation aligns with the plan outlined in the DR. Through this meticulous review process, the lead ensures consistency and adherence to the envisioned design, reinforcing the integrity of the final product.

## DevOps

In many organizations, the team only partially owns the deployment and operations. However, we recognize its critical importance and ensure that this responsibility falls squarely on the shoulders of our engineers rather than a separate DevOps team. The feature lead is also entrusted with deploying and monitoring the feature's release. This includes writing code to provision necessary infrastructure and integrating metrics and logs.

We operate without a traditional DevOps team. This arrangement requires our developers to be self-sufficient in managing all aspects of their projects, including the deployment. To facilitate this, some of our team members, who possess more experience in infrastructure and DevOps, collaborate with me to create infrastructure building blocks. These blocks are designed to be user-friendly, allowing other engineers to utilize them for their infrastructure needs easily.

This approach equips the feature lead and developers with a comprehensive understanding of the production environment. In the event of any issues, they are well-prepared to pinpoint the problem and implement a fix swiftly. This hands-on deployment and problem-resolution strategy has proven highly effective, demonstrating its value in our engineering practices.

## Benefits

Our approach brings forth several significant benefits that enhance our projects and team members and allow us to scale our engineering org.

Firstly, it serves as a powerful tool for developer growth and understanding. When engineers assume the role of a feature lead, they are not just managing a technical task but immersing themselves in the complete landscape of the project. This includes engaging with product teams to understand the underlying business logic, discussing technical aspects with senior engineers, and learning from operating the system in production. Such a comprehensive experience sharpens their technical skills and broadens their understanding of the project, often leading to better coding practices informed by this newfound perspective.

Another advantage is the reduction in dependency on high-demand stakeholders. In many organizations, reaching out to an overloaded DevOps team or constantly seeking approvals from senior engineers can significantly slow down the process. Our method sidesteps this bottleneck. By empowering feature leads to managing critical aspects of the project, including deployment and monitoring, we minimize the reliance on these busy stakeholders. This approach streamlines the workflow and ensures that senior engineers' involvement is optimized and reserved for critical decision-making moments.

Moreover, this strategy alleviates the workload of team leads. With feature leads responsible for breaking the project into manageable tasks and overseeing their completion, team leads can focus on broader project management and oversight, efficiently handling multiple projects and ensuring each progresses smoothly.

These foster a work environment where ownership, accountability, and collaboration are paramount. Engineers develop a deeper connection to their work, leading to higher-quality results. The need for cross-functional communication enhances collaboration skills as engineers coordinate with various departments.

## Challenges

While this approach offers numerous benefits, it also comes with its own set of challenges.

Firstly, the role of a feature lead brings with it increased responsibility and pressure. These engineers guide a feature through every phase, from its initial design to its eventual deployment. For less experienced people, this heightened responsibility can be a source of considerable pressure. It requires technical prowess and the ability to manage a project's various facets effectively.

Another challenge lies in the diverse skill set required for the role. Beyond technical expertise, a feature lead must exhibit proficiency in project management, communication, and leadership. This broad range of necessary skills means engineers might need additional training or support to develop these competencies fully. It's not just about writing code; it's about leading a project to success while coordinating with different stakeholders and managing various project elements.

Maintaining quality consistency across different features is another significant hurdle. With different engineers leading various features, there's a natural variation in standards and approaches. Ensuring consistent quality and a cohesive style across the board becomes challenging, requiring vigilant oversight and possibly standardized guidelines.

To effectively address these challenges, it is crucial to establish robust support systems within the organization. This includes providing opportunities for learning, fostering an environment where collaboration and knowledge sharing are the norms, and ensuring regular check-ins and mentorship programs. Workload management also plays a vital role in preventing burnout and maintaining well-being and effectiveness. By implementing these measures, we can continue to leverage the benefits of this approach while minimizing its potential drawbacks.

## Conclusion

Providing engineers with end-to-end responsibility by assigning feature leads is not just a structural choice; it's a strategic one that has proven to yield efficient, cohesive, and more skilled engineering teams, effectively navigating the common bottlenecks of the tech industry.