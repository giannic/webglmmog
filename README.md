# WebGL MMOG
# DMD Senior Capstone Project
# Gianni Chen

## Live Game
The live game can be accessed at:  
[Live WebGL Game](http://ec2-54-224-18-235.compute-1.amazonaws.com:3000/)

## Demo Video
A short video of the demo game using this framework can be found at:  
[Demo Game Video](https://vimeo.com/65649003)

## Directory Structure
- README.md
- app.js
- client.js
- clouds.js
- config.js
- core.js
- engine.js
- entities.js
- game.js
- images/
- lib/
- main.js
- obj/
- package.json
- routes/
- stylesheets
- timer.js
- views/
- world.js

## Core Files
#### app.js
This is the server file that handles all the incoming and outgoing traffic between the clients and server.

#### client.js
This is the client file responsible for all the setup work when each client connects, as well as any actions that initiate on the client side.

#### config.js
This is the config that sets some globals to make sure they are consistent across all clients and the server.

#### core.js
This contains the base objects reused many times in the game.

#### engine.js
This runs the core logic of the game, including the calculation of all interactions between players.

#### main.js
Driver file that calls all the necessary functions to run the game.

#### world.js
This stores the variables of the world in the game.


## Installation
The following javascript packages are required for installation:
- jquery
- node.js
- socket.io
- three.js

## Build instructions
1. npm install  
2. node app  
3. Connect to port 3000  

## three.js
Currently using: THREE.js r58

## Presentation
The presentation is in HTML5 and thus requires reveal.js to be present as a sibling directory to this repository.
