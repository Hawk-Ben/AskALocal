# Final Project
*Due October 9th by 1:59 PM*

For your final project, you'll implement a web application that exhibits understanding of the course materials. 
This project should provide an opportunity to both be creative and to pursue individual research and learning goals.

## General description
Your project should consist of a complete Web application, exhibiting facets of the three main sections of the course material:

- Static web page content and design. You should have a project that is accessible, easily navigable, and features significant content.
- Dynamic behavior implemented with JavaScript (TypeScript is also allowed if your group wants to explore it).
- Server-side programming *using Node.js*. Typically this will take the form of some sort of persistent data (database), authentication, and possibly server-side computation.
- A video (less than five minutes) where each group member explains some aspect of the project. An easy way to produce this video is for you all the groups members to join a Zoom call that is recorded; each member can share their screen when they discuss the project or one member can "drive" the interface while other members narrate (this second option will probably work better.) The video should be posted on YouTube or some other accessible video hosting service. Make sure your video is less than five minutes, but long enough to successfully  explain your project and show it in action. There is no minimum video length.

## Project ideation
Excellent projects typically serve someone/some group; for this assignment you need to define your users and stakeholders. I encourage you to identify projects that will have impact, either artistically, politically, or in terms of productivity. 

### Deliverables

#### Form Team (due 9/11)
Students are will work in teams of 3-5 students for the project; teams of two can be approved with the permission of the instructor. Working in teams should help enable you to build a good project in a limited amount of time.  Use the `#project-logistics` channel in Discord to pitch ideas for final projects and/or find fellow team members as needed.

Teams must be in place by end of day on Friday, September 11th. If you have not identified a team at this point, you will be assigned a team. 

#### Proposal (due 9/18 by end of day) 
Provide an outline of your project direction and the names of associated team members. 
The outline should have enough detail so that staff can determine if it meets the minimum expectations, or if it goes too far to be reasonable by the deadline. Please include a general description of a project, and list of key technologies/libraries you plan on using (e.g. React, Three.js, Svelte, TypeScript etc.). Two to four paragraphs should provide enough level of detail. Name the file proposal.md and submit a pull request by Friday, September 18th at 11:59 PM (end of day). *Only one pull request is required per team*.

You will be given some class time to work on your proposal, but please plan on reserving additional time outside of class as needed. There are no other scheduled checkpoints for your project besides the final submission. 

#### Turning in Your Project
Submit a second PR on the final project repo to turn in your app and code. Again, only one pull request per team.

Deploy your app, in the form of a webpage, to Glitch/Heroku/Digital Ocean or some other service; it is critical that the application functions correctly wherever you post it.

The README for your second pull request should contain:

1. A brief description of what you created, and a link to the project itself (two paragraphs of text)
2. Any additional instructions that might be needed to fully use your project (login information etc.)
3. An outline of the technologies you used and how you used them.
4. What challenges you faced in completing the project.
5. What each group member was responsible for designing / developing.
6. A link to your project video.

Think of 1,3, and 4 in particular in a similar vein to the design / tech achievements for A1—A4… make a case for why what you did was challenging and why your implementation deserves a grade of 100%.

## FAQs

- **Can I use XYZ framework?** You can use any web-based frameworks or tools available, but for your server programming you need to use Node.js. Your client-side scripting language should be either JavaScript or TypeScript. While the course staff is happy to help with frameworks used in the class, we can't guarantee we'll be able to assist you with other frameworks / databases; choose carefully!
------------------------------Delete above before turn in-----------------------------------------------------------------------

Ask a local is a web based service that allows the user to look at a street map centered on themselves and see events happening around them. The user will be able to see various pins on different locations that hold an event that's happening at that location. Each event will have its own page with various information presented, such as the time of the event, who is hosting the event, an event description and any accessibility needs or resources required to attend the event. Each user will also be able to mark an event as attending, sending an alert to the event creator that the user has selected to attend their specific event. Each event creator will also have their own page, listing all events they have created and brief descriptions of those events with times and locations that users can click on.
Users may also host their own events to put onto Ask a Local. Users can select a location on their map and create a pin with information about when the event is, an event description and any other necessary information that users would need to know if they were to attend the event. Hosts can also see how many people are planning on attending their event, they will be provided with their name and a link to their profile, that if public will allow them to see what other events they're planning on attending. Users may friend other users and gain access to see the events that their friends plan on attending. 

For the specifics we will be using Node.js for the runtime and npm as the package manager. For the backend framework we will use Express, with MongoDB for persistence (we can use geospatial indexes from Mongo to query location events). Authentication will be handled with express session and bcrypt. For the bundler we will use Vite. For the frontend framework we will use React with TypeScript. For routing we will use TanStack Router. We will be using Tailwind for our CSS framework. For testing we will use Vitest. For the street map we will be using MapLibre GL with MapTiler for the tiles.

During the development of AskALocal one challenged we faced was rendering the street map of the local area. Instead of attempting to load the entire surronding street map we loaded in the map by tiles individually so tiles not seen by the user don't need to be rendered until the user zooms in or out. Another challenge we faced was editing the user information, at first we created a new user with the given information but learned that created a whole new user ID which broke the hosting and editing systems for events because it didn't reconize the new user, so we changed each field of the user individually instead.

Contributions to the project
Lex: Developed the log in page and the base of the website we all built out of
Mohammed: Created the street map interface and event pins
Caleb: Developed the event creation backend as well as the event edit page
Griffin: Created the event sidebar and connected the users to events to see users hosting or attending events
Ben: Developed the user display and editting page as well as the user backend to store in the server

Video link: https://youtu.be/CJs5FMG2GuM