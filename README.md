# SE2022-11-HikeTracker
Main project for the Software Engineering II course (group 11)

## Technology
- Language: Javascript
- Backend: Node.js server
- Frontend: React.js

## Hard-coded Users
| email | password | accessRight |
|-------|----------| ----------- |
| u2@p.it | password | hiker |
| u3@p.it | password | local-guide |

## Commands for Testing
_cd ./server_ 

_npm run test_ (Unit Test) 

_npm run apiTest_ (Integration Test)


# Commands for Docker

To use the docker service for client;


Pull:
   - git pull origin main 
   - docker pull erengul/se2022-11-hiketracker-client:latest
   - docker run -it -p 3000:3000 erengul/se2022-11-hiketracker-client:latest
    
    It will runs over the 3000 port


To use the docker for server;
Pull:
    - git pull origin main # Do not forget !!
    - docker pull erengul/se2022-11-hiketracker-server:latest
    - cd /server/
    - sudo docker run -v $PWD/db:/db -p 3001:3001 erengul/se2022-11-hiketracker-server:latest
