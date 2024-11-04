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

This application is an experiment in test-driven development(TDD). 
We're operating on two hypotheses :
 1. TDD code is more readable and  faster to troubleshoot.
 2. TDD forces the programmer to prove they know what the hell they're doing. 

 Commit Structure

When making changes, write code tests-first. Nobody's perfect, and we need proof for stuff.
Exceptions for tests-first:
- Non-dynamic tailwind styling - don't test for css unless it's tied to programmatic logic.
- user testing

Here's the commit strategy. To avoid faking out the commit history, 
commit the failing tests first, then the green tests, then any (green) refactors. The parsable error of composition 
history should be the branch, not the commit
