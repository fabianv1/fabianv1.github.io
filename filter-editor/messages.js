// Message sending - uses the objects in data.js and semi-hardcoded MIDI messages
// to send and receive messages from the filter

/* Message syntax varies depending on message type, but basically is as follows:
[
  SysEx Start (1 byte: 0xF0),
  Source Audio MIDI SysEx ID (3 bytes: 0x00, 0x01, 0x6c),
  Command Type (2 bytes, variable: 0x00 0x70 is Write User Control, 0x00 0x60 is Read User Control),
  User Control Number (2 bytes, variable: e.g. 0x00, 0x02 is Master Depth),
  Data Value for writes (4 bytes, variable: 
      16-bits max input but most knobs are 8-bit with max value of 254 [more info below]),
  SysEx End (1 byte: 0xf7)
]

  Note that because MIDI message contents can’t exceed 127 (0x7F),
  8-bit values must be split into two 7-bit values. Since data can be 16 bits, it must have its
  higher 8 bits split into 2 bytes and lower 8 bits split into two bytes, hence the 4 bytes
*/

/**
 * Set up basic message receiving from the filter
 **/

// Two kinds of messages: 
// 1) status of single filter value
// 2) status of overall filter (called 'ping')
// let controlBeingRead = null;
let messageOrder = 0;
let messagesArray = []
if (navigator.requestMIDIAccess) {navigator.requestMIDIAccess({ sysex: true })
  .then((access) => {
    const input = access.inputs.values().next().value;
    input.open();
    input.onmidimessage = (message) => {
      // console.log(message.data)
      if (message.data.length == 12) updateReadValue(message);
      if (message.data.length == 80) updatePingResult(message);
    }
  })
}

/**
 * Set up ping sending and receiving from the filter
 **/
let latestPingData;

function sendPingMessage() {
  if (navigator.requestMIDIAccess) {navigator.requestMIDIAccess({ sysex: true })
    .then((access) => {
      const output = access.outputs.values().next().value;
      output.open();

      // Bytes are annotated below, corresponding to the syntax given above. 
      //     Start  ------ID------   --Command-- Data Value  End
      msg = [0xf0, 0x00, 0x01, 0x6c, 0x00, 0x45, 0x00, 0x00, 0xf7];
      output.send(msg);
    })
  }
}

function updatePingResult(message) {
  latestPingData = message;
  if (message.data[70] === 1) { // preset_edit flag is true
    console.log('Value edited on filter.')
    burnPreset(127);
    loadPreset(127);
    readAllValues();
  }
}

// Ping filter every second
window.setInterval(sendPingMessage, 1000);

// Send a read message to every control
function readAllValues() {
  messageOrder = 0;
  messagesArray = []
  for (control of userControls) {
    if (document.getElementById(control) != null) {
      messagesArray.push(control);
      // Some controls are listed for completeness but don't exist in code (see data.js for more)
      sendReadMessage(control);
    } else {

    }
  }
}

/**
 * Single-value read message sending and receiving from the filter
 **/

function sendReadMessage(control) {
  // console.log(`sending read message from ${control} with value`);
  messageReceived = false;
  let userControl = userControls.indexOf(control);
  userControl = byteConvert(userControl);
  // console.log(`UCN is ${userControl}`);
  controlBeingRead = control;

  if (navigator.requestMIDIAccess) {navigator.requestMIDIAccess({ sysex: true })
    .then((access) => {
      const output = access.outputs.values().next().value;
      output.open();

      // Bytes are annotated below, corresponding to the syntax given above. 
      // Bytes that need to be set are marked *, the rest should not be changed
      //     Start  ------ID------   --Command-- -Control*-  End
      msg = [0xf0, 0x00, 0x01, 0x6c, 0x00, 0x60, 0x00, 0x00, 0xf7];
      msg[6] = userControl[0];
      msg[7] = userControl[1];
      output.send(msg);

    })
  }
}

function updateReadValue(message) {
  // Message syntax is:
  // Start --Command-- -------------------Data Value-----------------  End
  // 0xF0, 0x00, 0x60, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x14, 0xF7
  // Data value is almost always only last two bytes
  let controlBeingRead = messagesArray[messageOrder]
  const elmnt = document.getElementById(controlBeingRead);
  const group = controlBeingRead.split('-')[0];
  const option = controlBeingRead.split('-')[1];

  const value = byteDeconvert([message.data[9], message.data[10]]);
  // value could correspond to a number, boolean, or string depending on what kind of option is in control
  if (Object.keys(data[group]['dropdowns']).includes(option)) {  // dropdown -> string
    if (control in differentlyOrderedDropdowns) {
      // elmnt is actually the dropdown's label wrapper, so need to set the second child (after the label text)
      elmnt.childNodes[1].value = differentlyOrderedDropdowns[control][value];
    } else {
      elmnt.childNodes[1].value = data[group]['dropdowns'][option][value];
    }
  } else if (data[group]['knobs'].includes(option)) {  // knob -> number
    elmnt.value = value;
  } else {  // checkbox -> boolean
    elmnt.checked = value == 1;
  }
  messageOrder++;
}

/**
 * Single-value write message sending and receiving from the filter
 **/

function sendWriteMessage(control, value) {
  console.log(`sending write message from ${control} with value ${value}`);

  let userControl = userControls.indexOf(control);
  const group = control.split('-')[0];
  const option = control.split('-')[1];

  // value could be a number, boolean, or string depending on what kind of option is in control
  if (Object.keys(data[group]['dropdowns']).includes(option)) {  // dropdown -> string
    if (control in differentlyOrderedDropdowns) {
      dataValue = differentlyOrderedDropdowns[control].indexOf(value);
    } else {
      dataValue = data[group]['dropdowns'][option].indexOf(value);
    }
  } else if (data[group]['knobs'].includes(option)) {  // knob -> number
    dataValue = parseInt(value);
  } else {  // checkbox -> boolean
    dataValue = value ? 1 : 0;
  }

  userControl = byteConvert(userControl);
  dataValue = byteConvert(dataValue);
  console.log(`UCN is ${userControl}, DV is ${dataValue}`);

  if (navigator.requestMIDIAccess) {navigator.requestMIDIAccess({ sysex: true })
    .then((access) => {
      const output = access.outputs.values().next().value;
      output.open();

      // Bytes are annotated below, corresponding to the syntax given above. 
      // Bytes that need to be set are marked *, the rest should not be changed
      //     Start  ------ID------   --Command-- -Control*- ------Data Value*------  End
      msg = [0xf0, 0x00, 0x01, 0x6c, 0x00, 0x70, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xf7];

      msg[6] = userControl[0];
      msg[7] = userControl[1];
      msg[10] = dataValue[0];
      msg[11] = dataValue[1];
      output.send(msg)
    })
  }
}

/**
 * Helper functions
 **/

function byteConvert(num) {
  if (num < 128) {
    return [0, num];
  }
  return [1, num-128];
}

function byteDeconvert(bytes) {
  return 128 * bytes[0] + bytes[1];
}