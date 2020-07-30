import React, { useEffect, useState } from 'react';
import {Navbar, Card, Button, Form, Table} from 'react-bootstrap';
import logo from './logo.png';
import {feedActionApi, feedEventsApi, waterChangeApi} from './ApiCalls'

function Navigator() {
  return (
    <Navbar bg="dark" variant="dark">
    <Navbar.Brand href="#home">
      <img
        alt=""
        src={logo}
        width="30"
        height="30"
        className="d-inline-block align-top"
      />{' '}
      My Fish Auto Feeder
    </Navbar.Brand>
  </Navbar>
  );
}

function InstantFeedModule() {

  return (
  <Card>
    <Card.Header>Instant Action to feed</Card.Header>
    <Card.Body>
      <Card.Text>
        Clicking the button below to trigger feed action instantly
      </Card.Text>
      <Button variant="primary" onClick={async () => {await feedActionApi()}}>Feed</Button>
    </Card.Body>
  </Card>
  );
}

async function submitSlot({duration, time}) {
  await feedEventsApi('POST', {
    "feedtime": time,
    "feedduration": duration
  })
}

function ScheduledEvents() {
  const [events, setEvents] = useState(null)
  var newDuration;
  var newTime;
  const scheduleTimeChange = (event) => {
    newTime = event.target.value;
  };
  const schuduleDurationChange = (event) => {
    newDuration = event.target.value;
  };
  const deleteScheduleSlot = async (id) => {
    await feedEventsApi('DELETE', id)
  }
  
  useEffect(() => {
    const fetchData = async () => {
      const result = await feedEventsApi('GET')
      setEvents(result);
    };

    fetchData();
  });


  const scheduleTable = events && events !== "none" ? JSON.parse(events).map((event) => {
    return(
    <tr key={event.id}>
      <td>{event.id}</td>
      <td>{event.feedtime}</td>
      <td>{event.feedduration}</td>
      <td><Button variant="danger" onClick={async () => {
        const response = await deleteScheduleSlot(event.id)
        setEvents(response);
      }}>Delete</Button></td>
    </tr>
    );
  }) : <></>;

  return (
    <Card>
    <Card.Header>Existing schedule</Card.Header>
    <Card.Body>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Feed Time</th>
          <th>Feed Duration (in Sec)</th>
          <th>Operation</th>
        </tr>
      </thead>
      <tbody>
        {scheduleTable}
      </tbody>
    </Table>
    </Card.Body>
    <Card.Header>Schedule Time to feed</Card.Header>
    <Card.Body>
      <Card.Text>
        Give time in a day and the duration in second you want feeder operating
      </Card.Text>
      <Form.Group>
        <Form.Control size="sm" as="input" placeholder="7:30PM"
          onChange={(event) => {scheduleTimeChange(event)}}/>
        <br/>
        <Form.Control size="sm" as="input" placeholder="5"
          onChange={(event) => {schuduleDurationChange(event)}}/>
        <br/>
      </Form.Group>
      <Button variant="primary" type="submit" onClick={async () => {
        const response = await submitSlot({time: newTime, duration: newDuration});
        setEvents(response);
      }}>
        Add Slot
      </Button>
    </Card.Body>
  </Card>

  );
}

function WaterChangeLog() {
  const [waterChangeLog, setWaterChangeLog] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const result = await waterChangeApi('GET')
      setWaterChangeLog(result);
    };

    fetchData();
  });


  return (
  <Card>
    <Card.Header>Water Change Log</Card.Header>
    <Card.Body>
      <Card.Text>
        Happen every month to change a quater of water in tank
      </Card.Text>
      <h4>Last time you changed water: {waterChangeLog}</h4>
      <Button variant="primary" onClick={async () => {await waterChangeApi('POST')}}>
        Changed Water today
      </Button>
    </Card.Body>
  </Card>
  );
}

function App() {
  return (
    <>
      <Navigator/>
      <br/>
      <InstantFeedModule/>
      <br/>
      <ScheduledEvents/>
      <br/>
      <WaterChangeLog/>
    </>
  );
}

export default App;
