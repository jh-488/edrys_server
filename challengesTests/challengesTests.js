// Function to add the Serial.begin line to a sketch (needed for the serial monitor)
const addSetupBegin = (sketch) => {
  const setupIndex = sketch.lastIndexOf("void setup()");
  if (setupIndex !== -1) {
    const endIndex = sketch.indexOf("}", setupIndex);
    if (endIndex !== -1) {
      return (
        sketch.slice(0, endIndex) +
        "  Serial.begin(9600);\n" +
        sketch.slice(endIndex)
      );
    }
  }
};

// Function to add the test run to a sketch (needed for the ArduinoUnit library)
const addTestRun = (sketch) => {
  const newSketch = addSetupBegin(sketch);

  const loopIndex = newSketch.lastIndexOf("void loop()");
  if (loopIndex !== -1) {
    const endIndex = newSketch.indexOf("}", loopIndex);
    if (endIndex !== -1) {
      return (
        newSketch.slice(0, endIndex) +
        "   Test::run();\n" +
        newSketch.slice(endIndex)
      );
    }
  }
};


// Test for the turn-on-led-001 challenge
const createTurnOnLedSketchTest = (usersSketch) => {
  // Add test code to the user's sketch
  const testCode = `
    #include <ArduinoUnit.h>

    ${usersSketch} 

    test(turnOnLed) {
        assertEqual(digitalRead(LED_BUILTIN), HIGH);
    }
    `;

  const testSketch = addTestRun(testCode);
  
  return testSketch;
};

// Test for the missing-led challenge
const fs = require("fs");
const path = require('path');
const dataPath = "../challengesData/missingLed.json";

const createMissingLedSketchTest = (usersSketch) => {
  // Read the already turned on and turned off LEDs from the JSON file
  const data = fs.readFileSync(path.join(__dirname, dataPath), "utf8");
  const { turnedOnLEDs, turnedOffLED } = JSON.parse(data);

  // Add test code to the user's sketch
  const testCode = `
    #include <ArduinoUnit.h>

    ${usersSketch} 

    test(missingLed) {
      assertEqual(digitalRead(${turnedOnLEDs[0]}), LOW);
      assertEqual(digitalRead(${turnedOnLEDs[1]}), LOW);
      assertEqual(digitalRead(${turnedOffLED}), HIGH);
    }
    `;

  const testSketch = addTestRun(testCode);
  
  return testSketch;
};


// Get the correct test function for the challenge
const testFunctions = (challengeId, usersSketch) => {
  switch (challengeId) {
    case "turn-on-led-001":
      return createTurnOnLedSketchTest(usersSketch);
    case "missing-led":
      return createMissingLedSketchTest(usersSketch);
    default:
      return null;
  }
}

module.exports = { testFunctions };
