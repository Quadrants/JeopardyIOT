<p style="color: red; font-weight: bold">>>>>>  gd2md-html alert:  ERRORs: 0; WARNINGs: 0; ALERTS: 12.</p>
<ul style="color: red; font-weight: bold"><li>See top comment block for details on ERRORs and WARNINGs. <li>In the converted Markdown or HTML, search for inline alerts that start with >>>>>  gd2md-html alert:  for specific instances that need correction.</ul>

<p style="color: red; font-weight: bold">Links to alert messages:</p><a href="#gdcalert1">alert1</a>
<a href="#gdcalert2">alert2</a>
<a href="#gdcalert3">alert3</a>
<a href="#gdcalert4">alert4</a>
<a href="#gdcalert5">alert5</a>
<a href="#gdcalert6">alert6</a>
<a href="#gdcalert7">alert7</a>
<a href="#gdcalert8">alert8</a>
<a href="#gdcalert9">alert9</a>
<a href="#gdcalert10">alert10</a>
<a href="#gdcalert11">alert11</a>
<a href="#gdcalert12">alert12</a>

<p style="color: red; font-weight: bold">>>>>> PLEASE check and correct alert issues and delete this message and the inline alerts.<hr></p>


Jeopardy: IOT Edition

**Group Members**

Adam Douiri [douir002@umn.edu](mailto:douir002@umn.edu), Anthony Rutherford [ruthe140@umn.edu](mailto:ruthe140@umn.edu), and Michael Montano-Aguilar [monta356@umn.edu](mailto:monta356@umn.edu)

**What does the device do? **

We use three Photons to interact with an online jeopardy board. One of these is the host board, which the host uses to mark answers as incorrect or correct, and two of these are contestant boards that players can use to buzz in with. The contestant who presses the buzzer the fastest gets to answer the jeopardy question, we then award “money” if the contestant gets it correct, and in the case that they don’t, another contestant is able to steal. Much like real Jeopardy!

**How does it work?**

We use Particle IO’s built-in functions and events to interact between the web and microcontroller sides of our project. For example, when the host clicks on a question, a function is sent to the boards to start displaying the timer on our LCD Screen. Then when a player buzzes in, an event is published which gets received in JavaScript.

**Sensors and Actuators**



* Buttons: On the contestant boards, this is used to send an event through the cloud to the website which will decide who pressed the button first to the millisecond. On the host board, the host can press either a green button for a correct response or a red button for an incorrect response.
* Buzzers: Audio feedback to add flavor to the project. When a contestant presses their button, a short beep plays on their board.
* LCD Screens (Scoreboard): On the contestant boards, LCD screens are used to display the points that each player has and other information about the game. On the host board, this is used to display the correct answer to the question without revealing it to the contestants.

**Cloud Connectivity**

**Particle -> Web **Our project uses events to send data to our Jeopardy website which gets received using JavaScript code. The events sent by the Photon are all triggered by button presses: ‘ButtonPressed’ is sent whenever a contestant presses a button, ‘CorrectButton’ is sent when the host presses the green button indicating a correct response, and ‘IncorrectButton’ is sent when the host presses the red button for a wrong answer.

**Web -> Particle **Using the Particle API JavaScript SDK, we call functions on each Particle. In our project, this is specifically used for starting the timer for answering questions when the Jeopardy game begins. We do this using our cloud function “aerStartTimer” which is called through a Particle API method named “callFunction”. The other two functions are “aerSetScore” and “aerSetAnswer”, which update the scores and answers on the contestant and host boards respectively.

**JavaScript Code Description**

The “first thing” that we do in our JavaScript code is set up our buttons using a nested for loop.

We append the function “buttonFunction”, passing in the arguments giving the position of the button on the board (i and b respectively). These arguments are later used to pull from our jeopardyQuestions and jeopardyAnswers arrays. 



<p id="gdcalert1" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image1.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert2">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image1.png "image_tooltip")


_createButton Function_

Next we have “buttonFunction”, the function begins by updating the amount of money up for grabs based on the dollar quantity of the button that was pressed. The function then sets up a new button called ‘jeopardyScreen’, which is used to display the question and answer selected. We append the function “newJeopardy” to the “onclick” of this button, which will be explained in more detail later. After displaying this screen, we then call multiple particle functions, the first one being ‘aerSetAnswer’, which sets the answer of the question on the host board’s LCD screen. Then we use “aerStartTimer” which starts the timer required to buzz in on our two players LCD screens. We then listen to our player’s Photons using the function waitForButtonPress, and then decide who will win using getButtonResponse after the five seconds allocated for responding. The variable “wasStealing” being set to false is due to our stealing feature, which we’ll later explore in this report.



<p id="gdcalert2" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image2.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert3">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image2.png "image_tooltip")


_buttonFunction Function_

Delving more into waitForButtonPress, we use the Particle API function “getEventStream” to receive the information from both Photons. We then use getButtonResponse to find out which Particle buzzed in first by using string manipulation and then using a series of if statements. We then set the “winner” variable to the winning photon, which will then be later used for our “onCorrectAnswer” and “onWrongAnswer” functions.

When we initially proposed our idea of a Jeopardy project to Dr. Orser, we had been warned that a significant challenge for our project would be sending information from our board to our JavaScript, and that the limitations around Photons as far as time (the Photon can only send events every one second) could be a potential challenge. Because this was uncharted territory (we had not learned how to deal with either issue in our labs), we made sure we were able to manage this before the rest of our project. We were able to quickly pick up on the Particle API, but due to our unfamiliarity with JSON, we initially struggled trying to fetch timestamps. Not only this, when we had the timestamps we had struggled with turning it into something useful. After finding out how to get the respective timestamps (which admittedly was easier than we thought), we decided to use string manipulation and some simple math to find out the exact time, and a series of if statements in order to tell which board had the smaller amount of time. This was still buggy, however, but through testing we were able to identify a lot of the issues, most of which stemmed from our “responseTimes” value being recycled, which we would fix by setting the values in this array to null on multiple occasions. 



<p id="gdcalert3" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image3.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert4">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image3.png "image_tooltip")
_waitForButtonPress and getButtonResponse Functions_

After getting a winner, we use our host board’s buttons to determine whether or not the answer the player provided was correct. If the answer is correct, our process is pretty straightforward, we change some text on the screen, give the player their money, close out the large “jeopardyScreen” using the “newJeopardy” function, and update every player's scores using “updateScores”. 

In the case that the player gets it wrong it gets a little more complicated. We didn’t really expect this part to be as difficult as it was, and it certainly was a little complicated to set up with our coding “infrastructure” at the time. We first struggled thinking about a way we could block the wrong answerer from buzzing in again – primarily because we had so many ways of doing it but trouble figuring what our best option was. Our first attempt was to use an if-statement to call “waitForButtonPress” (at the time this wasn’t a function and we had the same code running in two places), which we would later come back to doing. However, we had a line in our Particle code that limited when we could start listening for events, so we initially assumed this was a JavaScript problem. We tried a few different solutions to our problem, all with their own issues, but we eventually realized the real issue (the Particle code) and came back to our initial solution. We also had a problem with people being able to steal even after being the initial loser, which we would fix with the “wasStealing” variable. All in all, however, this kind of came out as a positive, since we were able to clean up a lot of our code in looking for the non-existent JavaScript problem. At first we were recycling the “responseTimes” array in our “getButtonResponse” function, but then we introduced two new variables, we initially had two variables “winner” and “pastwinner”, but we realized it was unnecessary and made our code cleaner, and we simplified our previously blocky if statement down to a single line.



<p id="gdcalert4" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image4.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert5">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image4.png "image_tooltip")


_onCorrectAnswer and onWrongAnswer Functions (Note: We use getEventStream elsewhere in the code to call these functions from the host board)_

Another function that we have in the code is our newJeopardy function, which we use to display the question and answer for our Jeopardy game. It also sets the original button pressed as disabled and with no text (we use a special whitespace character for this purpose, since leaving a normal “space-bar” whitespace character messes things up). We use a global variable called “buttonMode” to change the purpose of jeopardyScreen. “updateScores” is relatively self-explanatory, we update the text in the document and we update the scores displayed on the LCD screens using Particle API’s function “callFunction”. 



<p id="gdcalert5" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image5.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert6">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image5.png "image_tooltip")


_newJeopardy and updateScores Functions_



<p id="gdcalert6" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image6.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert7">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image6.png "image_tooltip")


_Our Variables (Note: jeopardyQuestions and jeopardyAnswers are both 2D arrays ordered in the same way as the buttons on our JavaScript Jeopardy board)_

**Photon Code Description**

Our photon code is split into two separate projects; one for the host board and one for the contestant board.

The host board consists of three pieces that interact with the web: a function to start the timer, a function to update the player’s score, and an event broadcast upon button press.



<p id="gdcalert7" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image7.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert8">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image7.png "image_tooltip")


The **setup **function just sets up the pins and functions to work properly. We use a library called ‘LiquidCrystal_I2C_Spark’ that gives us access to ‘LiquidCrystal_I2C’, allowing us to control our LCD screens.



<p id="gdcalert8" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image8.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert9">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image8.png "image_tooltip")


Above are shown the respective particle functions that can be called through the Particle API. All they do is set the variables ‘score’ and ‘rem[aining]Time’. These will both be displayed on the LCD screen, and remTime ticks down in the **loop **function.

The loop function is responsible for processing button presses on the board and ticking timers. In order to make buttons as responsive as possible, we avoid using ‘delay’ and opt for marking the number of milliseconds that have passed since the last loop-through. When the button is pressed it turns on the buzzer, which is turned off 250 milliseconds later. Moving down the loop, note that **OnPressButton **isn’t called unless the state of the button changes, to prevent it from being called multiple times on one press.

We tick down remTime by however much time has passed in seconds, making the timer function.

Finally, every 100 ms the LCD gets updated with the up-to-date state of the ‘score’ and ‘remTime’ variables. \
When updated in this way, the LCD looks as such:



<p id="gdcalert9" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image9.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert10">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image9.png "image_tooltip")




<p id="gdcalert10" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image10.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert11">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image10.png "image_tooltip")


**OnPressButton** is pretty straightforward: First, it just prints a message to the Serial monitor for testing, after which it sets buzzerPlayTimer to 0 (this will play a tone for 250ms, see the **loop** function). Finally, it publishes the “ButtonPressed” event which will be picked up by an event stream in Javascript.

That is all of the main functionality of the contestants’ photons. The host board has its own set of functions, however:

**Host Board Electrical Schematic Diagram**

<p id="gdcalert11" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image11.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert12">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image11.png "image_tooltip")


**Player #1 and #2**

<p id="gdcalert12" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image12.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert13">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image12.png "image_tooltip")


[https://pastebin.com/bQutESQn](https://pastebin.com/bQutESQn)  (Contestant Board) \
[https://pastebin.com/cnQKmhB8](https://pastebin.com/cnQKmhB8) (Host Board)

[https://pastebin.com/aLxhvkuj](https://pastebin.com/aLxhvkuj) (JavaScript)

[https://pastebin.com/qRFjjwqZ](https://pastebin.com/qRFjjwqZ) (HTML)

[https://pastebin.com/R18qZumN](https://pastebin.com/R18qZumN) (CSS)

**References**

**Particle Reference Documentation**

[https://docs.particle.io/reference](https://docs.particle.io/reference)

**“Photon Powered LCD Forecast and Time Display” by Brandon Cannaday**

[https://www.hackster.io/TheReddest/photon-powered-lcd-forecast-and-time-display-32bab4](https://www.hackster.io/TheReddest/photon-powered-lcd-forecast-and-time-display-32bab4)

**W3 Schools** for various CSS, HTML, and Javascript tips, tricks, and code snippets.

[https://www.w3schools.com/](https://www.w3schools.com/)

**Code Libraries Used \
**[https://github.com/BulldogLowell/LiquidCrystal_I2C_Spark](https://github.com/BulldogLowell/LiquidCrystal_I2C_Spark)

[https://github.com/particle-iot/particle-api-js](https://github.com/particle-iot/particle-api-js)
