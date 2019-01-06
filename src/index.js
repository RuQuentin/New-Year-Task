
let ws = new WebSocket("ws://178.20.156.145:3000");

ws.onopen = function() {
  console.log('Connection is set')
}

let data = null;

ws.onmessage = (message) => {
  data = JSON.parse(message.data);

  if (data.action === 'check') {
    console.log(data);
  }

  if (data.pulled) {
    console.log(data);

    const request = `{"action": "check", "lever1": 0, "lever2": 3, "stateId": ${data.stateId} }`

    ws.send(request)
  }

}



// ws.send(request)


// ws.onmessage = (message) => {
//   // const a = message;
//   console.log(message)
// }

// setTimeout(ws.close(), 5000)