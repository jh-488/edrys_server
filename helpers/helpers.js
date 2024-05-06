// Path where the sketch is stored
const sketchPath = "./sketch/sketch.ino";

// Serial port where the arduino is connected and the board core  
const args = process.argv.slice(2);
const coreIndex = args.indexOf("--core");
const portIndex = args.indexOf("--port");

let BOARD_CORE = null;
let BOARD_PORT = null;

if (coreIndex !== -1 && portIndex !== -1) {
    BOARD_CORE = args[coreIndex + 1];
    BOARD_PORT = args[portIndex + 1];
} else {
    console.error("Error: Please provide the board core using --core <core> or/and the serial port using --port <port>");
    process.exit(1);
}


module.exports = { sketchPath, BOARD_PORT, BOARD_CORE };