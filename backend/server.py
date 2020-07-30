from flask import Flask, jsonify, request
from hardwareController import *
from datetime import datetime
from apscheduler.schedulers.blocking import BlockingScheduler
import _thread
from apscheduler.schedulers.asyncio import AsyncIOScheduler

app = Flask(__name__)

feedevents = []
waterChangeLog = 'none'

@app.route("/feedevents", methods=['GET', 'POST'])
def feedEventsGetAndPost():
  global feedevents
  if request.method == 'GET':
    if len(feedevents) == 0:
      return "none"
    else:
      return jsonify(feedevents)
  else:   # POST method
    newId = len(feedevents)
    newFeedTime = request.form['feedtime']
    newFeedDuration = request.form['feedduration']
    newFeedElement = {
      'id': newId,
      'feedtime': newFeedTime,
      'feedduration': newFeedDuration
    }
    feedevents.append(newFeedElement)
    return jsonify(feedevents)

@app.route("/feedevents/<id>", methods=['PUT', 'DELETE'])
def feedEventsPutAndDelete(id):
  global feedevents
  if request.method == 'PUT':
    updateFeedTime = request.form['feedtime']
    updateDuration = request.form['feedduration']
    if len(feedevents) > int(id) and len(feedevents) > 0:
      for element in feedevents:
        print(element)
        if element['id'] == int(id):
          element['feedtime'] = updateFeedTime
          element['feedduration'] = updateDuration
          break
      return jsonify(feedevents)
    else:
      return "none"
  else:   # delete request
    if len(feedevents) > int(id) and len(feedevents) > 0:
      element2Remove = None
      for element in feedevents:
        if element['id'] == int(id):
          element2Remove = element
          feedevents.remove(element)
          break;
      prevId = 0
      for element in feedevents:
        if element['id'] == prevId + 1:
          element['id'] = prevId
        prevId += 1
      return jsonify(feedevents)
    else:
      return "none"

@app.route("/feedaction", methods=['GET'])
def feedAction():
  try:
    if len(request.form) == 0:
      pwm = valve_init()
      valve_action(pwm)
      return 'success'
    elif (request.form['feedduration'] != None):
      pwm = valve_init()
      valve_action(pwm, int(request.form['feedduration']))
      return 'success'
  except:
    return 'wrong request'

@app.route("/waterchangelog", methods=['GET', 'POST'])
def changeLogs():
  global waterChangeLog
  if request.method == 'GET':
    return waterChangeLog
  elif request.method == 'POST':
    waterChangeLog = datetime.now().strftime('%Y,%b,%d')
    print(waterChangeLog)
    return waterChangeLog

def feedevents_executor():
  global feedevents
  current = datetime.now().strftime("%H,%M")
  for feedevent in feedevents:
    scheduled = datetime.strptime(feedevent['feedtime'], "%I:%M%p").strftime("%H,%M")
    if current == scheduled:
      pwm = valve_init()
      valve_action(pwm, int(feedevent['feedduration']))
    

def setupFeedEventsExecutor(threadName, delay):
  # If I am using scheduler, the task is running on a separate process
  # the global variable "feedevents" are not supported to shared between processes
  #scheduler = AsyncIOScheduler()
  #scheduler.add_executor('processpool')
  #scheduler.add_job(feedevents_executor, 'interval', seconds=5)

  #try:
  #  scheduler.start()
  #  print('scheduler started!')
  #except (KeyboardInterrupt, SystemExit):
  #  pass
  
  # An issue here ! I don't have more time to dig this out
  # But thread is running twice, and one of twice cannot see feedevents' update
  while True:
    time.sleep(30)
    feedevents_executor()

if (__name__ == "__main__"):
  _thread.start_new_thread(setupFeedEventsExecutor, ("Thread-1", 0, )) 
  app.run(host='0.0.0.0', port=5000, debug=True)
