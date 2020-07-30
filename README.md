## Overview
We are building our Auto Fish Feeder project from scratch.

The main MCU we are choosing is raspberry pi zero, servo motor and transistor. We use GPIO18 to control servo motor and GPIO23 to control transistor.

In Raspberry PI, we set up a Python Flask framework as our backend service and 
React as our frontend service.

In our backend service, we exposed several APIs.
* /feedevents: we can set up a feed event in a time through this API by providing feed time and feed duration
* /feedaction: have one time feed action
* /waterchangelog: get or refresh our water change log in server

The backend service connects hardware function to operate, the servo motor's current is controlled by a NPN transistor which is turned on and off by a GPIO. The PWM generates a 20ms pulse with different duty cycle to control servo motor rotation on different angle.

The frontend service uses React framework which provides delightful layout and plenty components.

## Hardware and Schematic
![schematic](/pictures/schematic.jpg)

* The upper bank has 5V input, the lower bank has 3.3V input

## Demo
![schematic](/pictures/demo.jpg)

