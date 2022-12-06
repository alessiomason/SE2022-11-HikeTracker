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

## Tests
### Commands for Testing
`cd ./server`

`npm run test` (Unit Tests) 

`npm run apiTest` (Integration Tests)

### Tests status

[![Unit tests](https://github.com/alessiomason/SE2022-11-HikeTracker/actions/workflows/unit_tests.yml/badge.svg)](https://github.com/alessiomason/SE2022-11-HikeTracker/actions)
[![I](https://github.com/alessiomason/SE2022-11-HikeTracker/actions/workflows/integration_tests.yml/badge.svg)](https://github.com/alessiomason/SE2022-11-HikeTracker/actions)


## Docker
### Docker commands for client

To use the docker service for client:

- `git pull origin main` 
- `docker pull erengul/se2022-11-hiketracker-client:latest`
- `docker run -it -p 3000:3000 erengul/se2022-11-hiketracker-client:latest`
    
It will run over the 3000 port

### Docker commands for server

To use the docker for server:

- `git pull origin main`
- `docker pull erengul/se2022-11-hiketracker-server:latest`
- `cd /server/`
- `sudo docker run -v $PWD/db:/db -p 3001:3001 erengul/se2022-11-hiketracker-server:latest`   
        
It will run over the 3001 port

### Run both services

In the root folder, run `docker-compose build && docker-compose up`

- https://hub.docker.com/repository/docker/erengul/se2022-11-hiketracker