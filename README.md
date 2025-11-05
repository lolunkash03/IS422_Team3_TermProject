# IS422_Team3_TermProject

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


