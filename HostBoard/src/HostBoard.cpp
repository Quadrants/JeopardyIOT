/******************************************************/
//       THIS IS A GENERATED FILE - DO NOT EDIT       //
/******************************************************/

#line 1 "c:/Users/antrut0405/Desktop/iot/HostBoard/src/HostBoard.ino"
/*
 * Project HostBoard
 * Description:
 * Author:
 * Date:
 */

#include <Particle.h>
#include "LiquidCrystal_I2C_Spark/LiquidCrystal_I2C_Spark.h"

int setAnswer(String answer);
void setup();
void loop();
#line 11 "c:/Users/antrut0405/Desktop/iot/HostBoard/src/HostBoard.ino"
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

  Particle.function("aerSetAnswer", setAnswer);

  setAnswer("Waiting...");
}

bool correctPressedLast = false;
bool incorrectPressedLast = false;

// loop() runs over and over again, as quickly as it can execute.
void loop()
{
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

  correctPressedLast = correctNow;
  incorrectPressedLast = incorrectNow;
}