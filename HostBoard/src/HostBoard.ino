/*
 * Project HostBoard
 * Description: Controls the host board on our UMN Final Jeopardy project.
 * Author: Anthony Rutherford
 * Date: 4/17/2023
 */

#include <Particle.h> // The particle library
#include "LiquidCrystal_I2C_Spark/LiquidCrystal_I2C_Spark.h" // The library used for control of the LCD

using namespace std;

LiquidCrystal_I2C *lcd;

int correctPin = D3;
int incorrectPin = D2;

int setAnswer(String answer)
{
    lcd->clear();
    // Print the score on line 1
    lcd->setCursor(0, 0);
    lcd->print("Answer: ");
    lcd->setCursor(0, 1);
    lcd->print(answer);

    return 1;
}

// setup() runs once, when the device is first turned on.
void setup()
{
  // Put initialization like pinMode and begin functions here.
  pinMode(correctPin, INPUT_PULLDOWN);
  pinMode(incorrectPin, INPUT_PULLDOWN);
  Serial.begin(9600);

  // Initialize the LCD screen and clear it.
  lcd = new LiquidCrystal_I2C(0x3F, 20, 4);
  lcd->init();
  lcd->backlight();
  lcd->clear();

  // Register the function to be called in Javascript, allowing the answer to be set remotely
  Particle.function("aerSetAnswer", setAnswer);

  // Set the answer to a placeholder
  setAnswer("Waiting...");
}

bool correctPressedLast = false;
bool incorrectPressedLast = false;

// loop() runs over and over again, as quickly as it can execute.
void loop()
{
  // Record button states
  bool correctNow = digitalRead(correctPin);
  bool incorrectNow = digitalRead(incorrectPin);

  // The core of your code will likely live here.
  if (correctNow && !correctPressedLast)
  {
    Particle.publish("Correct");
  }
  if (incorrectNow && !incorrectPressedLast)
  {
    Particle.publish("Incorrect");
  }

  // Update button states
  correctPressedLast = correctNow;
  incorrectPressedLast = incorrectNow;
}