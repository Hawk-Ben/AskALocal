# Ask a Local

Live site: https://askalocal.onrender.com/

To log in, enter any username and password on the login page. If the username does not exist yet, an account is created with that password.

Ask a local is a web based service that allows the user to look at a street map centered on themselves and see events happening around them. The user will be able to see various pins on different locations that hold an event that's happening at that location. Each event will have its own page with various information presented, such as the time of the event, who is hosting the event and an event description. Each user will also be able to mark an event as attending. Each user will also have their own page, listing the events they are hosting and attending, which users can click on.
Users may also host their own events to put onto Ask a Local. Users can enter an address and create a pin with information about when the event is, an event description and any other necessary information that users would need to know if they were to attend the event. Hosts can also see how many people are planning on attending their event and who is attending. 

For the specifics we will be using Node.js for the runtime and npm as the package manager. For the backend framework we will use Express, with MongoDB for persistence. Authentication will be handled with express session and bcrypt. For the bundler we will use Vite. For the frontend framework we will use React with TypeScript. For routing we will use TanStack Router. For the street map we will be using MapLibre GL with OpenStreetMap for the tiles.

During the development of AskALocal one challenged we faced was rendering the street map of the local area. Instead of attempting to load the entire surronding street map we loaded in the map by tiles individually so tiles not seen by the user don't need to be rendered until the user zooms in or out. Another challenge we faced was editing the user information, at first we created a new user with the given information but learned that created a whole new user ID which broke the hosting and editing systems for events because it didn't reconize the new user, so we changed each field of the user individually instead.

Contributions to the project
Lex: Developed the log in page and the base of the website we all built out of
Mohammed: Created the street map interface and event pins
Caleb: Developed the event creation backend as well as the event edit page
Griffin: Created the event sidebar and connected the users to events to see users hosting or attending events
Ben: Developed the user display and editting page as well as the user backend to store in the server

Video link: https://youtu.be/CJs5FMG2GuM