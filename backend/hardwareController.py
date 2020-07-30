import RPi.GPIO as GPIO
import time

valvePwmPin = 18
pwmFrequency = 50 # PWM on 50Hz, servo needs 20ms pulse
valveClosePos = 7.5 
valveOpenPos = 7.0
defaultValveOpenDuration = 0.4 # default 3 second valve opening
currentControlPin = 23   # Transistor control pin

def valve_init():
  GPIO.setmode(GPIO.BCM)
  GPIO.setup(valvePwmPin, GPIO.OUT)
  GPIO.setup(currentControlPin, GPIO.OUT)
  GPIO.setwarnings(False)
  GPIO.output(currentControlPin, GPIO.LOW)

  pwm = GPIO.PWM(valvePwmPin, pwmFrequency)
  pwm.start(valveClosePos)
  return pwm

def valve_action(pwm, duration=defaultValveOpenDuration):
  valve_open(pwm)
  time.sleep(duration)
  valve_close(pwm)

def valve_open(pwm):
  GPIO.output(currentControlPin, GPIO.HIGH)
  pwm.ChangeDutyCycle(valveOpenPos)

def valve_close(pwm):
  pwm.ChangeDutyCycle(valveClosePos)
  time.sleep(2)   # give it one second to let motor returns to close pos
  GPIO.output(currentControlPin, GPIO.LOW)

if __name__ == "__main__":
  pwm = valve_init()
  try:
    while True:
      #pwm.ChangeDutyCycle(5)
      #time.sleep(0.5)
      #pwm.ChangeDutyCycle(7.5)
      #time.sleep(0.5)
      #pwm.ChangeDutyCycle(10)
      #time.sleep(0.5)
      #pwm.ChangeDutyCycle(12.5)
      #time.sleep(0.5)
      #pwm.ChangeDutyCycle(10)
      #time.sleep(0.5)
      #pwm.ChangeDutyCycle(7.5)
      #time.sleep(0.5)
      #pwm.ChangeDutyCycle(5)
      #time.sleep(0.5)
      #pwm.ChangeDutyCycle(2.5)
      #time.sleep(0.5)
      time.sleep(5)
      valve_action(pwm)
  except KeyboardInterrupt:
      pwm.stop()
      GPIO.cleanup()
