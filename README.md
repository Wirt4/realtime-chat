## Running the App
### Docker
#### Building the Container
note: Make sure `docker` or `docker desktop` is running
From the root directory
```bash
docker build -t realtime-chat-image .  
```
#### Running the Container
```bash
docker run --rm -p 3000:3000 --name realtime-chat-container realtime-chat-image
```

#### Stopping the Container
```bash
docker stop realtime-chat-container
```

### Building the App
Continuous integration is set up with Heroku (live version at https://salthouse-chat-2e94934e3b3e.herokuapp.com/), 
so when it's good to publish, merge changes to `main`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Functionality
This is a real-time chat app

## Credits
Built from template put forth by @johnrushx at [https://nextjsstarter.com/blog/build-nextjs-real-time-chat-app-in-5-steps/](https://nextjsstarter.com/blog/build-nextjs-real-time-chat-app-in-5-steps/)