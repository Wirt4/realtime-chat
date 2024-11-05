# Real-time Chat
Greetings, Programmer. The purpose of this README is to give you the tools
to run the app locally and some guidance on making changes.
![Screenshot 2024-11-04 at 5.15.40 PM.png](README%20assets/Screenshot%202024-11-04%20at%205.15.40%E2%80%AFPM.png)
## Running the App

### Dependencies
Like many Node apps, this chat leans on .env variables.  Set NEXTAUTH_URL to http://localhost:3000 and PUSHER_CLUSTER to us3.
Double check that you have the correct credentials for the following:
- `REDIS_URL`
- `REDIS_TOKEN`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `PUSHER_APP_ID`
- `PUSHER_KEY`
- `PUSHER_SECRET`

#### Turning it on and off again
To run this app locally, you'll need Docker.
To turn the app on, run:
```bash
docker compose up  
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To shut it down, run:
```bash
docker compose down
```

## Making Changes

### Editing
This is a Test-Driven project, so unless it's a CSS issue, write the failing tests first and commit them to prove they fail.
The cycle is "red", "green", "refactor".

Don't worry about changing tests.
It's normal for tests to be updated for new features. And like any other code, unit tests are only right
until proven wrong. So don't be afraid to change, maintain and refactor the test suites.

### Deploying
The app is set up with Heroku (live version at https://salthouse-chat-2e94934e3b3e.herokuapp.com/).
When it's ready to publish,
1. merge changes from `dev` to `main`
2. Open the heroku dashboard at `https://dashboard.heroku.com/apps/salthouse-chat/deploy/github`
3. Hit "Deploy Branch from Main"
![Screenshot 2024-10-01 at 2.32.50 PM.png](README%20assets/Screenshot%202024-10-01%20at%202.32.50%E2%80%AFPM.png)

Users can join then invite each other to 2-person chats using their email addresses as identifiers.
They'll need a Google account to use to log into the app using OAuth once it's up and running.

## Summary
To run the app, you'll need Docker and a Google account.
You'll also need the credentials for Redis, NextAuth, GoogleClient, and Pusher.
Make commits tests first.

## Credits
Built from template put forth by https://github.com/joschan21 at [https://nextjsstarter.com/blog/build-nextjs-real-time-chat-app-in-5-steps/](https://nextjsstarter.com/blog/build-nextjs-real-time-chat-app-in-5-steps/)
