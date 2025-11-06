# IS422_Team3_TermProject

PUBLIC REPO URL **(PLEASE SWITCH TO lily_branch NOT MAIN)**: https://github.com/lolunkash03/IS422_Team3_TermProject.git

**Trello Board:**
https://trello.com/b/YtDYzLCw/infosys-424

**Sprint Forecast & Backlog**

Sprint Goal:
The goal for this sprint was to implement user authentication and integrate it with each page. Users can now create accounts, sign in, and sign out through a Firestore-backed authentication system. When a user is signed in, their information is stored in the database, and the sign-in form is hidden to reflect their active session.

User Stories and Tasks:

User Story 1:

As a new user, I want to create an account using my email and password so that I can securely access the application.

-Built sign-up and sign-in forms for user registration and login.

-Connected authentication functions to the Firestore database.

-Stored user email and account information securely in Firestore.

User Story 2:

As a returning user, I want to stay signed in and see different options when logged in so that I can continue using the app without re-entering my credentials.

-Implemented user login persistence using Firebase Authentication.

-When a user is signed in, the sign-in and sign-up forms disappear.

-Added a sign-out option that clears the active session.

Future Backlog:

In the next sprint, the team plans to expand functionality by developing the blog content system and implementing user-specific features such as viewing or saving read history. Additional improvements will include enhancing UI responsiveness, adding input validation, and exploring third-party authentication options.

Sprint Summary:

This sprint successfully established the app’s authentication foundation using Firestore. Users can now create accounts, sign in, and sign out securely. The system updates the interface in real time, ensuring that only signed-in users have access to the main content.

Daily Scrum #1
Alex:

Yesterday: Set up Firebase Authentication in our project and configured sign-up and sign-in functionality with email and password.

Today: Test authentication features and verify that new users appear correctly in Firebase Authentication.

Problems: Encountered an issue with Firebase initialization when switching from local host to live deployment.

Lily:

Yesterday: Updated the Trello board with new tasks for authentication, About Me, and Blog page features. Also updated Gantt chart with new due dates.

Today: Begin styling the login and signup forms using Bulma to make them consistent with the home page.

Problems:

Jack:

Yesterday: Created layouts for the login and signup pages and added navigation links to them from the home page.

Today: Work on the “About Me” page layout and connect it to the navbar so it’s accessible across all pages.

Problems: Need clarification on whether the About Me section should include admin-only details or be public.

Yiming:

Yesterday: Wrote the initial JavaScript logic to handle form validation and authentication events (sign up, sign in, sign out).

Today: Add welcome message and user info display when users are logged in successfully.

Problems:

Charles:

Yesterday: Assisted Alex with Firebase setup and configured security rules for Authentication.

Today: Test all user authentication flows and verify successful sign-out functionality.

Problems: Still trying to ensure sessions clear properly when signing out on mobile browsers.

Justin:

Yesterday: Designed the structure and styling for the new Blog page and linked it to the main navigation.

Today: Add placeholder content to test the page layout and check responsive design.

Problems: Minor formatting issues with image alignment on the blog cards.

Daily Scrum #2
Alex:

Yesterday: Completed Firebase connection testing — users can now successfully register and log in.

Today: Focus on sign-out functionality and ensure user sessions are properly cleared after logout.

Problems: Need to test session persistence across multiple browsers.

Lily:

Yesterday: Finished polishing the styling for login and signup forms and confirmed mobile responsiveness.

Today: Update sprint documentation with screenshots and burndown chart progress.

Problems: None at the moment.

Jack:

Yesterday: Completed “About Me” page and added it to the main navigation bar.

Today: Update the home page with a new section summarizing the site’s purpose and user options (Join, Login, Blog).

Problems: Some spacing inconsistencies between the home page and the new About Me layout.

Yiming:

Yesterday: Implemented dynamic welcome message that displays user email after login.

Today: Test input validation for weak passwords and invalid email formats.

Problems: None currently, but may need to adjust Firebase error messages for better clarity.

Charles:

Yesterday: Tested all authentication flows and confirmed sign-out now works across devices.

Today: Review and clean up authentication-related JavaScript code for readability.

Problems: None currently.

Justin:

Yesterday: Added final touches to the Blog page and ensured navigation between Blog, About Me, and Home pages was smooth.

Today: Prepare visual assets and assist Lily with README screenshots.

Problems: No major problems; everything functioning as expected.

Sprint Review & Reflection
What we learned:
During this sprint, we learned how to implement Firebase Authentication and connect it to our existing web app. We gained a stronger understanding of how user authentication works, including how Firebase handles user sign-up, sign-in, and sign-out processes separately from Firestore. We also learned how to debug and organize our code more effectively by separating Firebase configuration into its own file for cleaner functionality.
What went well and why:
The overall coding and design process went smoothly. The page layouts were consistent with previous pages, which helped maintain a cohesive look across the site. The design also reflected what our client expected to see, keeping the color scheme, structure, and layout familiar and professional. Team coordination improved from the first sprint — we used Trello more efficiently and stayed on top of our tasks.
What challenges we faced:
While working on authentication and Firebase setup, we ran into a few technical issues. Specifically, after pasting the Firebase Authentication logic, the code under DOM elements such as
const signUpForm = document.getElementById("signUpForm");
const signUpError = document.getElementById("signUpError");

caused errors and prevented the authentication from functioning properly. To fix this, we created a separate firebase.js file and placed all the Firebase configuration and logic there. After testing again, both sign-in and sign-up features worked successfully, and the app correctly displayed user information such as the email and account creation time.
How we will improve next sprint:
Improve the overall look and consistency of the website and include the sign-in/sign-up links across all pages.

Create and refine the new about.html page to provide more information about the organization and its mission.

Client feedback (if applicable):
The client appreciated the progress on the design and how the layout aligns with their expectations. They also liked that the site’s functionality is starting to come together visually and technically.
