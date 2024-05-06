# Edrys Server

A NodeJS server that can run locally to start a WebSockets connection mainly with the [Edrys_Code_Editor](https://github.com/jh-488/Edrys_Code_Editor) and also with other challenges modules. 

The server has two main tasks:
- Receiving code from the Editor Module, compiling it and uploading to the board.
- Receiving code from challenges type modules, adding tests to it and then upload it to the board (so it can send feedback to the client).

To run the server locally :

- Clone this repo and cd to /server
- npm install
- node index.js --core "CORE_NAME" --port "PORT_NAME"    
(e.g. node index.js --core arduino:avr:uno --port COM3)

PS: [Arduino CLI](https://arduino.github.io/arduino-cli/0.35/installation/) (with the platform core) and [Node JS](https://nodejs.org/en/download) should be installed on your local machine.