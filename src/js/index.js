
let ws = new WebSocket("ws://178.20.156.145:3000");

let state = [1, undefined, undefined, undefined]
let counter = 1;
let control = null;

ws.onmessage = (message) => {
  data = JSON.parse(message.data);

  if (data.pulled >= 0) {
    changeState(data.pulled);
    formatSwitcher(data.pulled);

    if (counter <= 3) {
      sendCheckRequest(counter, data.stateId);
    }
  }

  if (data.action === 'check') {
    setUnknownLever(counter);
    formatSwitcher(counter);
    counter += 1;
  }

  if (isAppropriateCombination()) {
    sendCommand(data.stateId)
  }

  if (data.token) {
    ws.close();
    showToken(data.token);
  }
}

// ====================== FUNCTIONS ======================

function changeState(lever) {
  state[lever] = -state[lever];
}

function sendCheckRequest(lever2, id) {
  const request = `{ "action": "check", "lever1": 0, "lever2": ${lever2}, "stateId": ${id} }`;
  ws.send(request)
}

function setUnknownLever(lever) {
    state[lever] = data.same ? state[0] : state[0] * -1
}

function isAppropriateCombination() {
  const sum = state.reduce((acc, lever) => acc + lever, 0);

  if (Math.abs(sum) === 4 && sum !== control) {
    control = sum;
    return true;
  } else {
    return false;
  }
}

function sendCommand(id) {
  const command = `{ "action": "powerOff", "stateId": ${id} }`;
  ws.send(command)
}

// ====================== FORMAT ======================

function formatSwitcher(lever) {
  const handler = document.querySelectorAll(".handler")[lever];
  const position = state[lever] === 1 ? 'handler1' : 'handler-1';

  handler.classList.remove('handler1', 'handler-1');
  handler.classList.add(position);
}

function showToken(token) {
  const tokenWrapper = document.querySelector(".token-wrapper");

  tokenWrapper.classList.add('token-wrapper__animated');
  tokenWrapper.textContent = token;
}