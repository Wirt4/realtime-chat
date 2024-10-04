## Functionality
This is a real-time chat app. 
## Running the App
### Docker
#### Building the Container
note: Make sure `docker` or `docker desktop` is running.
We're using an Alpine Linux image in Docker to approximate Heroku's default dyno container, which uses a lightweight Linux distro.
From the root directory
```bash
docker compose up  
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

#### Stopping the Container
```bash
docker compose down
```

## Deploying the App
Continuous integration is set up with Heroku (live version at https://salthouse-chat-2e94934e3b3e.herokuapp.com/), 
when it's good to publish,
1. merge changes from `dev` to `main`
2. Open the heroku dashboard at `https://dashboard.heroku.com/apps/salthouse-chat/deploy/github`
3. Hit "Deploy Branch from Main"

![Screenshot 2024-10-01 at 2.32.50 PM.png](README%20assets/Screenshot%202024-10-01%20at%202.32.50%E2%80%AFPM.png)

## Credits
Built from template put forth by @johnrushx at [https://nextjsstarter.com/blog/build-nextjs-real-time-chat-app-in-5-steps/](https://nextjsstarter.com/blog/build-nextjs-real-time-chat-app-in-5-steps/)