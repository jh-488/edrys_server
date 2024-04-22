A NodeJS server that can run locally to start the connection with [Edrys_Code_Editor](https://github.com/jh-488/Edrys_Code_Editor). When the data (code) is received from the client, it will store the code in an ".ino" file, compile it and upload it to the board.

To run the server locally :

- Clone this repo and cd to /server
- npm install
- node index.js --port "PORT_NAME"    (e.g. node index.js --port COM3)

PS: [Arduino CLI](https://arduino.github.io/arduino-cli/0.35/installation/) (with the platform core) and [Node JS](https://nodejs.org/en/download) should be installed on your local machine.