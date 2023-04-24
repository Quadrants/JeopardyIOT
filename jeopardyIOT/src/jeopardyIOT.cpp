/******************************************************/
//       THIS IS A GENERATED FILE - DO NOT EDIT       //
/******************************************************/

#line 1 "c:/Users/antrut0405/Desktop/iot/jeopardyIOT/src/jeopardyIOT.ino"
/*
 * Project jeopardyIOT
 * Description: Controls the contestant board for our UMN final Jeopardy IOT project
 * Author: Anthony Rutherford
 * Date: 4/17/2023
 */

#include <Particle.h> // The particle IO library
#include "LiquidCrystal_I2C_Spark/LiquidCrystal_I2C_Spark.h" // The spark library, used for control of the LCD display

int StartTimer(String args);
int SetScore(String newScore);
void OnPressButton();
void setup();
void loop();
#line 11 "c:/Users/antrut0405/Desktop/iot/jeopardyIOT/src/jeopardyIOT.ino"
using namespace std;

LiquidCrystal_I2C *lcd;

int buttonPin = D6; // The pin the button is connected to on the Photon

int score = 0;
float remTime = 0; // The remaining time left to "buzz in" with the button.

// Called through Javascript when a question is shown. Starts the timer. args is ignored.
int StartTimer(String args)
{
  remTime = 5;
  return 1;
}

// Called through Javascript when the player's score is updated.
int SetScore(String newScore)
{
  score = newScore.toInt();
  return 1;
}

// Called when the button is pressed
void OnPressButton()
{
  // Print some stuff for debugging
  Serial.println("You pressed the button! :) ");
  Serial.print((double)Time.now());

  // Publish the event
  Particle.publish("ButtonPressed");
}

// setup() runs once, when the device is first turned on.
void setup()
{
  // Initialize the button pin. INPUT_PULLDOWN means it only gets called when the button is pushed down, not when it is released.
  pinMode(buttonPin, INPUT_PULLDOWN);
  pinMode(D7, OUTPUT);

  Serial.begin(9600);

  // Initialize the LCD screen and clear it.
  lcd = new LiquidCrystal_I2C(0x3F, 20, 4);
  lcd->init();
  lcd->backlight();
  lcd->clear();

  // Register the particle functions to be later triggered through Javascript
  Particle.function("aerStartTimer", StartTimer);
  Particle.function("aerSetScore", SetScore);
}

bool buttonStateLast = LOW; // Store the last button state to avoid triggering multiple calls on one press.

unsigned long lastTime = 0;
unsigned long lcdUpdateTimer = 0;

// loop() runs over and over again, as quickly as it can execute.
void loop()
{
  // Store the time in milliseconds to get a delta time for a timer.
  unsigned long nowTime = millis();
  unsigned long deltaTime = nowTime - lastTime;

  lcdUpdateTimer+=deltaTime;

  lastTime = nowTime;

  bool buttonStateNow = digitalRead(buttonPin);

  // If the button was just pressed, send the button press.
  if (buttonStateNow == HIGH && buttonStateLast == LOW)
  {
    OnPressButton();
  }

  buttonStateLast = buttonStateNow;

  // Tick the remaining time, clamping it at a minimum of 0.
  if (remTime > 0)
  {
    remTime -= deltaTime/1000.0;
  }
  else
  {
    remTime = 0;
  }

  if (lcdUpdateTimer > 100) // Every 100ms...
  {
    lcd->clear();
    // Print the score on line 1
    lcd->setCursor(0, 1);
    lcd->print("Score: ");
    lcd->print(score);
    // Print the timer on line 2
    lcd->setCursor(0, 2);
    lcd->print("Time: ");
    lcd->print(remTime);
  }
}