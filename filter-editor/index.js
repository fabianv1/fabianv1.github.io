/*** 
 * Helper functions 
 ***/

function not (x) {return !x;}

/*** 
 * Raw data storage 
 * TODO: we likely want to export this section to its own file once it's complete 
 * since it will end up being much longer
 ***/

// Each object in data is one group of controls in the editor. The 'options' array
// is the dropdown options and the 'values' array is the knob options.
const data = {
  masterControls: {
    options: [],
    values: ["input1Gain", "input2Gain", "masterDepth", "modSource", "bass",
              "treble", "mix", "loRetain", "outputVolume", "outputBalance"],
  },
  envelope1: {
    options: [
    'ADSR 1 Adjust Attack/Decay',
    'Fast Attack, Adjust Decay',
    'Wide Range 1, Adjust Attack/Decay',
    'Swell',
    'Wide Range 2, Faster Decay',
    'Snappy',
    'ADSR 2 Fast Attack, Adjust Decay',
    'ADSR 3 Adjusst Attack/Decay',
    'ADSR 4',
    'ADSR 5',
    'ADSR 6 Slow Attack, Fast Decay',
    'Fastest Attack, Adjust/Decay',
    'Wide Range 1, Adjust Attack/Decay'
  ],
    values: ['speed', 'sensitivity', 'gate'],
  },
  envelope2: {
    options: [
      'ADSR 1 Adjust Attack/Decay',
      'Fast Attack, Adjust Decay',
      'Wide Range 1, Adjust Attack/Decay',
      'Swell',
      'Wide Range 2, Faster Decay',
      'Snappy',
      'ADSR 2 Fast Attack, Adjust Decay',
      'ADSR 3 Adjusst Attack/Decay',
      'ADSR 4',
      'ADSR 5',
      'ADSR 6 Slow Attack, Fast Decay',
      'Fastest Attack, Adjust/Decay',
      'Wide Range 1, Adjust Attack/Decay'
    ],
    values: ['speed', 'sensitivity', 'gate'],
  },
};

// User Control Numbers for each knob or dropdown.
// The index of an item in the list is its user control number; items are named 
// as `groupname-valuename` or , if it sets multiple values `groupname-values`. 
const userControls = [
  'masterControls-input1Gain',
  'masterControls-input2Gain',
  'masterControls-masterDepth',
  // The ones above are real, the ones below are fake/for testing purposes
  'envelope1-sensitivity',
  'envelope1-speed',
  'envelope1-gate',
  'envelope1-values', //should actually be 0x58
  'envelope2-sensitivity',
  'envelope2-speed',
  'envelope2-gate',
  'envelope2-values',
]

// Dropdowns each have their own number-to-value mapping, recorded here. 
// As above, the index of an item in the list is its number.
const dropdowns = { 
  // TODO think about if we want the stuff here to be normal or short-form - maybe ask Rich
  // note has to match whatever is above
  'envelope1-values': [
    'ADSR 1 Adjust Attack/Decay',
    'Fast Attack, Adjust Decay',
    'Wide Range 1, Adjust Attack/Decay',
    'Swell',
    'Wide Range 2, Faster Decay',
    'Snappy',
    'ADSR 2 Fast Attack, Adjust Decay',
    'ADSR 3 Adjusst Attack/Decay',
    'ADSR 4',
    'ADSR 5',
    'ADSR 6 Slow Attack, Fast Decay',
    'Fastest Attack, Adjust/Decay',
    'Wide Range 1, Adjust Attack/Decay'
  ],
  'envelope2-values': [
    'ADSR 1 Adjust Attack/Decay',
    'Fast Attack, Adjust Decay',
    'Wide Range 1, Adjust Attack/Decay',
    'Swell',
    'Wide Range 2, Faster Decay',
    'Snappy',
    'ADSR 2 Fast Attack, Adjust Decay',
    'ADSR 3 Adjust Attack/Decay',
    'ADSR 4',
    'ADSR 5',
    'ADSR 6 Slow Attack, Fast Decay',
    'Fastest Attack, Adjust/Decay',
    'Wide Range 1, Adjust Attack/Decay'
  ],
}

// User Control Numbers:
// - Voice 1 Mode is            0x10
// - Voice 2 Destination is     0x20
// - Voice 3 Enable is          0x30
// - Distortion - Output is     0x40
// - Filter 2 Mod Source is     0x50
// - Sine 2 FM Depth is         0x60
// - Sequencer 1 Value 3 is     0x70
// - Sequencer 2 Value 2 is     0x80 -> 0x01, 0x00
// - Harmony Key is            0x90 -> 0x01, 0x10
// - External Control Max 2 is  0xa0 -> 0x01, 0x20
// - Engaged/Bypass Toggle is   0xb0 -> 0x01, 0x30
// - Decrement Preset is        0xb5 -> 0x01, 0x35

/*** 
 * Data generation 
 ***/

const groups = document.querySelector("#groups");

// Initial creation steps for the settings
createOptions(data, groups);
(Object.keys(data)).map(group => createOptions(data[group].options, document.getElementById('parameters'), group));
(Object.keys(data)).map(group => createValues(group, data[group].values, document.getElementById("values")));

displayValues(data, groups.value);
displayOptions(data, groups.value);

// Event listeners to change which settings are visible
groups.addEventListener("change", () => displayOptions(data, groups.value));
groups.addEventListener("change", () => displayValues(data, groups.value));

function createOptions (data, dom, group = null) {
  // Non-null group means we are creating multiple groups of options, so add them in
  // separate select containers and make them invisible for now

  if (not(data instanceof Array)) data = Object.keys(data);
  let container;
  if (group != null) {
    container = document.createElement('select');
    container.setAttribute('id', `${group}-parameters`);
    container.setAttribute('style', 'display: none;');
    container.setAttribute('aria-hidden', 'true');
    container.setAttribute('onchange', `sendMessage('${group}' + '-values', this.value)`);
  } else {
    container = dom;
  }

  for (let name of data) {
    const option = document.createElement("option");
    option.textContent = name;
    option.setAttribute("value", name);
    container.appendChild(option);
  }

  if (group != null) {
    dom.appendChild(container);
  }
}


function createValues (group, data, dom) {
  for (let name of data) {
    const div = document.createElement("div");
    div.setAttribute('id', `${group}-${name}-value`);
    div.setAttribute('style', 'display: none;');
    div.setAttribute('aria-hidden', 'true');
    
    const label = document.createElement("label");
    
    label.innerText = name + ":"

    const input = document.createElement("input");
    input.setAttribute("id", `${group}-${name}`);
    input.setAttribute("type", "number");
    input.setAttribute("class", "number");
    input.setAttribute("min", 0);
    input.setAttribute("max", 254);
    input.setAttribute("onchange", `sendMessage('${group}-${name}', this.value)`);

    label.appendChild(input);
    div.appendChild(label);

    dom.appendChild(div);
  }
}

function displayOptions(data, group) {
  for (let name of Object.keys(data)) {
    if (name === group) {  // Set select visible
      const div = document.getElementById(`${name}-parameters`);
      div.setAttribute('style', 'display: inline;');
      div.setAttribute('aria-hidden', 'false');
    } else {  // Set hidden
      const div = document.getElementById(`${name}-parameters`);
      div.setAttribute('style', 'display: none;');
      div.setAttribute('aria-hidden', 'true');
    }
  }
}

function displayValues (data, group) {
  for (let name of Object.keys(data)) {
    if (name == group) {  // Set values visible
      for (let value of data[name].values) {
        const div = document.getElementById(`${name}-${value}-value`);
        div.setAttribute('style', 'display: block;');
        div.setAttribute('aria-hidden', 'false');
      }
    } else {  // Set hidden
      for (let value of data[name].values) {
        const div = document.getElementById(`${name}-${value}-value`);
        div.setAttribute('style', 'display: none;');
        div.setAttribute('aria-hidden', 'true');
      }
    }
  }
}

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

function sendMessage(control, value) {
  console.log(`sending message from ${control} with value ${value}`);

  let userControl = userControls.indexOf(control);
  let dataValue = parseInt(value); // value will either be an int or a string of text
  if (Number.isNaN(dataValue)) {
    // if a string of text, it's an option in a dropdown, so find out what the corresponding number is
    dataValue = dropdowns[control].indexOf(value);
  }

  console.log(`Before byte manipulation, UCN is ${userControl}, DV is ${dataValue}`);
  userControl = byteConvert(userControl);
  dataValue = byteConvert(dataValue);
  console.log(`After byte manipulation, UCN is ${userControl}, DV is ${dataValue}`);

  if (navigator.requestMIDIAccess) {navigator.requestMIDIAccess({ sysex: true })
    .then((access) => {
      // const input =  access.inputs.values().next().value;
      const output = access.outputs.values().next().value;

      // input.open();
      output.open();

      // Bytes are annotated below, corresponding to the syntax given above. 
      // Bytes that need to be set are marked *, the rest should not be changed
      //     Start  ------ID------   --Command-- -Control*- ------Data Value*------  End
      msg = [0xf0, 0x00, 0x01, 0x6c, 0x00, 0x70, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xf7]

      msg[6] = userControl[0];
      msg[7] = userControl[1];
      msg[10] = dataValue[0];
      msg[11] = dataValue[1]
      output.send(msg)
    })
  }
}

function byteConvert(num) {
  if (num < 128) {
    return [0, num];
  }
  return [1, num-127];
}



