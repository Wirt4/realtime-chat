
## Running the App

### Dependencies
The app is run in a docker container so you'll need a copy of Docker desktop. You'll also need to secute the correct \
values for the following env vars:
- REDIS_URL
- REDIS_TOKEN
- NEXTAUTH_SECRET
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- PUSHER_APP_ID
- PUSHER_KEY
- PUSHER_SECRET

Set NEXTAUTH_URL to http://localhost:3000 and PUSHER_CLUSTER to us3.

You'll also need a Google account to use to log into the app using OAuth once it's up and running 

#### Turning it on and off again

Make sure `docker` or `docker desktop` is running.
From the root directory
```bash
docker compose up  
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To shut it down, run.
```bash
docker compose down
```

## Making Changes

### Editing
This is a Test-Driven project, so unless it's a CSS issue, write the failing tests first and commit them to prove they fail. The cycle is "red",
"green, "refactor".

Yes, the tests will have to be updated, and they will have to be updated to match the actual behavior of the app when hosted.
This is because nobody gets an implementation correct the first time except two developers from the 1970s who live on an island
together somewhere off of the Netherlands. Also, they're kind of racist. Anyway, commit history is process, not product. 
The product is what the user interacts with once the app is deployed.

### Deploying
The app is set up with Heroku (live version at https://salthouse-chat-2e94934e3b3e.herokuapp.com/), 
when it's good to publish,
1. merge changes from `dev` to `main`
2. Open the heroku dashboard at `https://dashboard.heroku.com/apps/salthouse-chat/deploy/github`
3. Hit "Deploy Branch from Main"
![Screenshot 2024-10-01 at 2.32.50 PM.png](README%20assets/Screenshot%202024-10-01%20at%202.32.50%E2%80%AFPM.png)

Users can join then invite each other to 2-person chats using their email addresses as identifiers. 

To sum up: To run the app, you'll need Docker, a Google account,  and the appropriate credentials for Redis, NextAuth, GoogleClient, and Pusher.
Make commits TDD: red, green, refactor, and treat the branch name as the unit of composition. 

## Credits
Built from template put forth by https://github.com/joschan21 at [https://nextjsstarter.com/blog/build-nextjs-real-time-chat-app-in-5-steps/](https://nextjsstarter.com/blog/build-nextjs-real-time-chat-app-in-5-steps/)
