/*** 
 * Message sending 
 ***/

/* Message syntax is as follows:
[
  SysEx Start (1 byte: 0xF0),
  Source Audio MIDI SysEx ID (3 bytes: 0x00, 0x01, 0x6c),
  Command Type (2 bytes: 0x00, 0x70 is Write User Control),
  User Control Number (2 bytes: 0x00, 0x02 is Master Depth),
  Data Value (4 bytes: 16-bits max input but most knobs are 8-bit with max value of 254 [more info below]),
  SysEx End (1 byte: 0xf7)
]
* Note that because MIDI message contents can’t exceed 127 (0x7F),
  8-bit values must be split into two 7-bit values. Since data can be 16 bits, it must have its
  higher 8 bits split into 2 bytes and lower 8 bits split into two bytes, hence the 4 bytes
*/

function setPreset() {
  // console.log(`setting preset at index ${presetIndex} with name ${name}`);
  console.log(`setting preset at index 7 with name hi`);

  if (navigator.requestMIDIAccess) {navigator.requestMIDIAccess({ sysex: true })
    .then((access) => {
      const output = access.outputs.values().next().value;

      output.open();

      // Bytes are annotated below, corresponding to the syntax given above. 
      // Bytes that need to be set are marked *, the rest should not be changed
      //     Start  ------ID------   --Command-- -Preset Index- -If Name-
      msg = [0xf0, 0x00, 0x01, 0x6c, 0x00, 0x6e, 0x00, 0x11, 0x00, 0x01,
          // Each of the following lines are 8 bytes of ascii characters (each represented by two 7-bit words)
          // these are 
             0x00, 0x68, 0x00, 0x69, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
             0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
             0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
             0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
          // End
             0xf7];

      output.send(msg);
    })
  }
}

function loadPreset() {
  console.log(`loading preset hi from index 7`);

  if (navigator.requestMIDIAccess) {navigator.requestMIDIAccess({ sysex: true })
    .then((access) => {
      const output = access.outputs.values().next().value;

      output.open();

      // Bytes are annotated below, corresponding to the syntax given above. 
      // Bytes that need to be set are marked *, the rest should not be changed
      //     Start  ------ID------   --Command-- -Preset Index- -End-
      msg = [0xf0, 0x00, 0x01, 0x6c, 0x00, 0x77, 0x00, 0x07, 0xf7];

      output.send(msg);
    })
  }
}

const button = document.createElement("button");
button.setAttribute('onclick', 'setPreset()');
button.innerText = 'Set current settings as a preset';
document.getElementById('presets').appendChild(button);

const loadButton = document.createElement("button");
loadButton.setAttribute('onclick', 'loadPreset()');
loadButton.innerText = 'Load preset 7';
document.getElementById('presets').appendChild(loadButton)