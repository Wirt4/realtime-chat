The purpose of this document is to show a fresh developer how to use and edit the application

To locally host the application, you'll need Docker and the correct .env variables. 
You'll need correct values for:
- REDIS_URL
- REDIS_TOKEN
- NEXTAUTH_SECRET
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- NEXTAUTH_URL
- PUSHER_APP_ID
- PUSHER_KEY
- PUSHER_SECRET
- PUSHER_CLUSTER.

To host locally with the existing setup, you want NEXTAUTH_URL to be http://localhost:3000. 
Get the docker desktop app and make sure it's running. Run `docker compose up` to start the app locally. 
Run `docker compose down` to close it.

When making changes, write code tests-first. 
