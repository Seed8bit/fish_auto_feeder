async function feedActionApi() {
  const response = await fetch("/feedaction", {
    method: 'GET'
  });
  const data = await (await response.body.getReader().read()).value;
  const string = new TextDecoder("utf-8").decode(data);
  return string;
};

async function feedEventsApi(option, payload = null) {
  if (option === 'GET') {
    const response = await fetch("/feedevents", {
      method: 'GET'
    });
    const data = await (await response.body.getReader().read()).value;
    const string = new TextDecoder("utf-8").decode(data);
    return string;
  } else if (option === 'POST') {
    let formData = new FormData();
    formData.append('feedtime', payload.feedtime);
    formData.append('feedduration', payload.feedduration);
    const response = await fetch("/feedevents", {
      method: 'POST',
      body: formData
    });
    const data = await (await response.body.getReader().read()).value;
    const string = new TextDecoder("utf-8").decode(data);
    return string;
  } else if (option === 'PUT') {

  } else if (option === 'DELETE') {
    let id = parseInt(payload, 10);
    const response = await fetch(`/feedevents/${id}`, {
      method: 'DELETE'
    });
    const data = await (await response.body.getReader().read()).value;
    const string = new TextDecoder("utf-8").decode(data);
    return string;
  } else {
    console.log('method violates')
  }
}

async function waterChangeApi(option) {
  if (option === 'GET') {
    const response = await fetch("/waterchangelog", {
      method: 'GET'
    });
    const data = await (await response.body.getReader().read()).value;
    const string = new TextDecoder("utf-8").decode(data);
    return string;
  } else {      // POST to refresh water log
    const response = await fetch("/waterchangelog", {
      method: 'POST'
    });
    const data = await (await response.body.getReader().read()).value;
    const string = new TextDecoder("utf-8").decode(data);
    return string;
  }
}

export {feedActionApi, feedEventsApi, waterChangeApi};
