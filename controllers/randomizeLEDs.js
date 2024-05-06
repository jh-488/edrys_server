const fs = require("fs");
const path = require('path');
const { sketchPath, BOARD_PORT } = require("../helpers/helpers");
const { compileSketch, uploadSketch } = require("../controllers/sketchControllers");
const dataPath = "../challengesData/missingLed.json";

// Turn on two LEDs randomly on the board (used for the "missing-led" challenge)

const LEDsPins = [13, 12, 11];

const getRandomPins = () => {
  const firstPinIndex = Math.floor(Math.random() * LEDsPins.length);
  let secondPinIndex;
  do {
    secondPinIndex = Math.floor(Math.random() * LEDsPins.length);
  } while (secondPinIndex === firstPinIndex); // Ensure second pin is different from the first
  
  return [LEDsPins[firstPinIndex], LEDsPins[secondPinIndex]];
};

let turnedOnLEDs = [];
let turnedOffLED;

generateSketch = () => {
  const [LED1, LED2] = getRandomPins();
  turnedOnLEDs = [LED1, LED2];
  turnedOffLED = LEDsPins.filter((pin) => !turnedOnLEDs.includes(pin))[0];
  
  // Save the turned on and turned off LEDs Pins to a JSON file
  try {
    const LEDsData = {turnedOnLEDs: turnedOnLEDs, turnedOffLED: turnedOffLED};
    fs.writeFileSync(path.join(__dirname, dataPath), JSON.stringify(LEDsData, null, 2), "utf8");
  } catch (error) {
    console.error(error);
  }
   

  return `
    int LED1 = ${LED1};
    int LED2 = ${LED2};

    void setup() {
      pinMode(LED1, OUTPUT);
      pinMode(LED2, OUTPUT);

      digitalWrite(LED1, HIGH);
      delay(400);
      digitalWrite(LED2, HIGH);
    }

    void loop() {
    }
  `;
};


const randomizeLEDs = (ws) => {
  const randomizeLEDsSketch = generateSketch();
  fs.writeFileSync(sketchPath, randomizeLEDsSketch, "utf8");

  compileSketch(sketchPath)
    .then((response) => {
      console.log(response);
      uploadSketch(BOARD_PORT, sketchPath)
        .then((response) => {
          console.log(response);
          ws.send(JSON.stringify({ledsRandomized: true}));
        })
        .catch((error) => {
          console.error(error);
          ws.send(JSON.stringify({error: "Internal server error. Please try again later."}));
        });
    })
    .catch((error) => {
      console.error(error);
      ws.send(JSON.stringify({error: "Internal server error. Please try again later."}));
    });
};


module.exports = { randomizeLEDs };