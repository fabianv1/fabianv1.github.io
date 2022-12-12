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
if (navigator.requestMIDIAccess) {navigator.requestMIDIAccess({ sysex: true })
  .then((access) => {
    const input = access.inputs.values().next().value;
    input.open();
    input.onmidimessage = (message) => {
      if (message.data.length == 12) updateReadValue(message);
      if (message.data.length == 80) updatePingResult(message);
    }
  })
}

/**
 * Set up ping sending and receiving from the filter
 **/
let altStatus = 0; // alt button is off by default

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
  const presetNum = byteDeconvert([message.data[11], message.data[12]]);
  document.getElementById('current-preset').innerHTML = presetNum;
  if (message.data[70] === 1) { // preset_edit flag is true
    // 200 = no edit in editor, 201 = multi-edit, other numbers = user control num of the single edit
    control_number =  byteDeconvert(message.data.slice(71, 73))
    if (control_number !== 200 && control_number != 201) {
      sendReadMessage(userControls[control_number])
    } else if (control_number == 200) {
      // filter may still be edited, so check those four knobs
      knobs = message.data[74] ? ['envelope1-sensitivity', 'masterControls-mix', 'filter1-q', 'masterControls-outputLevel'] : 
        ['masterControls-input1Gain', 'masterControls-masterDepth', 'filter1-frequency', 'envelope1-speed'];
      knobs.forEach(control => sendReadMessage(control));
      sendReadMessage('masterControls-input1Gain', resetEdit=true); // read first control just to reset
    } else if (control_number == 201) {
      readAllValues();
    }
  }
  if (message.data[74] !== altStatus) {
    document.getElementById('alt-button').innerText = message.data[74] ? 'on' : 'off';
    altStatus = message.data[74];
  }
}

// Ping filter every second
window.setInterval(sendPingMessage, 1000);

// Send a read message to every control
function readAllValues() {
  messageOrder = 0; 
  for (control of userControls) {
    if (document.getElementById(control) != null) {
      // Some controls are listed for completeness but don't exist in code (see data.js for more)
      sendReadMessage(control);
    }
  }
  sendReadMessage('masterControls-input1Gain', resetEdit=true); // read first control just to reset
}
readAllValues(); // read everything on startup so that current values are displayed in the editor

/**
 * Single-value read message sending and receiving from the filter
 **/

function sendReadMessage(control, resetEdit=false) {
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
      //     Start  ------ID------   --Command-- -Control*-  Extra Bytes  End
      msg = [0xf0, 0x00, 0x01, 0x6c, 0x00, 0x60, 0x00, 0x00, 0x00, 0x00, 0xf7];
      msg[6] = userControl[0];
      msg[7] = userControl[1];
      if (resetEdit) msg[9] = 1; // extra command to reset the edited flag back to false
      output.send(msg);

    })
  }
}

function updateReadValue(message) {
  // Message syntax is:
  // Start --Command-- -------------------Data Value-----------------  End
  // 0xF0, 0x00, 0x60, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x14, 0xF7
  // Data value is almost always only last two bytes
  let controlBeingRead = userControls[byteDeconvert(message.data.slice(1, 3))];
  const elmnt = document.getElementById(controlBeingRead);
  const group = controlBeingRead.split('-')[0];
  const option = controlBeingRead.split('-')[1];

  const value = byteDeconvert([message.data[9], message.data[10]]);
  // value could correspond to a number, boolean, or string depending on what kind of option is in control
  if (Object.keys(data[group]['dropdowns']).includes(option)) {  // dropdown -> string
    if (controlBeingRead in differentlyOrderedDropdowns) {
      // elmnt is actually the dropdown's label wrapper, so need to set the second child (after the label text)
      elmnt.childNodes[1].value = differentlyOrderedDropdowns[controlBeingRead][value];
    } else {
      elmnt.childNodes[1].value = data[group]['dropdowns'][option][value];
    }
  } else if (data[group]['knobs'].includes(option)) {  // knob -> number
    elmnt.value = value;
  } else {  // checkbox -> boolean
    elmnt.checked = value == 1;
  }
}

/**
 * Single-value write message sending and receiving from the filter
 **/

function sendWriteMessage(control, value) {
  console.log(`sending write message from ${control} with value ${value}`);

  let userControl = userControls.indexOf(control);
  const group = control.split('-')[0];
  const option = control.split('-')[1];

  if (['octave1-source', 'octave2-source'].includes(control)) { // special case for octave 1 and 2 sources
    sendOctaveSourceWrite(control, value);
    return;
  }

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
 * Special sendWriteMessage for octave1-source and octave2-source User Control Numbers
 * the octave source, octave, and envelope parameters must be set together
 **/
function sendOctaveSourceWrite(control, value) {
  let octave, source, envelope;
  let octave_val, source_val, envelope_val;

  data_mapping = {
    '1 Octave Down': [0x03, 0x03, 0x00],
    '2 Octaves Down': [0x02, 0x03, 0x00],
    '1 Octave Up': [0x05, 0x05, 0x01]
  }
  if (control === 'octave1-source') {
    [octave, source, envelope] = [0x28, 0x2b, 0x2c];
    [octave_val, source_val, envelope_val] = data_mapping[value];
  } else {
    [octave, source, envelope] = [0x35, 0x38, 0x39];
    [octave_val, source_val, envelope_val] = data_mapping[value];
    source_val++;
  }

  if (navigator.requestMIDIAccess) {navigator.requestMIDIAccess({ sysex: true })
    .then((access) => {
      const output = access.outputs.values().next().value;
      output.open();

      // Bytes are annotated below, corresponding to the syntax given above. 
      // Bytes that need to be set are marked *, the rest should not be changed
      //     Start  ------ID------   --Command-- -Control*- ------Data Value*------  End
      msg = [0xf0, 0x00, 0x01, 0x6c, 0x00, 0x70, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xf7];

      msg[7] = source;
      msg[11] = source_val;
      output.send(msg);
      msg[7] = octave;
      msg[11] = octave_val;
      output.send(msg);
      msg[7] = envelope;
      msg[11] = envelope_val;
      output.send(msg);
    })
  }
}

// Send a write only when no other calls to this function are made in 500 ms
let timerId = null;
function sendDelayedWriteMessage(control, value) {
  if (timerId) clearTimeout(timerId);
  timerId = setTimeout(() => sendWriteMessage(control, value), 500);
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

/**
 * Test function to make sure bidirectional messaging still works
 */

function testMessages() {
  if (navigator.requestMIDIAccess) {navigator.requestMIDIAccess({ sysex: true })
    .then((access) => {
      document.getElementById('testResult').innerText = "Beginning test. Please wait a few seconds.";
      const output = access.outputs.values().next().value;
      output.open();
      const input = access.inputs.values().next().value;
      input.open();
      input.onmidimessage = (message) => {
        document.getElementById('testResult').innerText = "Filter connected.";
      }

      msg = [0xf0, 0x00, 0x01, 0x6c, 0x00, 0x60, 0x00, 0x00, 0xf7];
      output.send(msg);
      setTimeout(function() {
        if (document.getElementById('testResult').innerText !== "Filter connected.") {
          document.getElementById('testResult').innerText = "Filter not connected.";
        }
      }, 5000); // wait five seconds
    })
  } else {
    document.getElementById('testResult').innerText = "Filter not connected.";
  }
}