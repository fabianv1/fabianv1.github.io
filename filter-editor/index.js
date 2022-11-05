/*** 
 * Helper functions 
 ***/

function not (x) {return !x;}

/*** 
 * Data generation - relies on objects in data.js to generate the dropdown for each group
 * and each group's associated dropdowns, value knobs, and checkboxes
 ***/

// Initial creation steps for the settings

const groups = document.querySelector("#groups");

createDropdowns(data, groups);
(Object.keys(data)).map(group => Object.keys(data[group].dropdowns).forEach(
  list => createDropdowns(data[group].dropdowns[list], document.getElementById('parameters'), `${group}-parameters-${list}`)));
(Object.keys(data)).map(group => 
  createKnobs(group, data[group].knobs, document.getElementById("knobs")));
(Object.keys(data)).map(group => 
  createCheckboxes(group, data[group].checkboxes, document.getElementById("checkboxes")));

changeGroupDisplay(data, groups.value); // Display for initial group
// Event listener to change which group's settings are being displayed
groups.addEventListener("change", () => changeGroupDisplay(data, groups.value));

// Creation functions

function createDropdowns (data, dom, name = null) {
  // Non-null `name` means we are creating multiple groups of options, so add them in
  // separate select containers and make them invisible for now

  if (not(data instanceof Array)) data = Object.keys(data);
  let container;
  if (name != null) {
    container = document.createElement('select');
    container.setAttribute('id', name);
    container.setAttribute('style', 'display: none;');
    container.setAttribute('aria-hidden', 'true');
    container.setAttribute('onchange', `sendMessage('${name}', this.value)`);
  } else {
    container = dom;
  }

  for (let optionName of data) {
    const option = document.createElement("option");
    option.textContent = optionName;
    option.setAttribute("value", optionName);
    container.appendChild(option);
  }

  if (name != null) {
    dom.appendChild(container);
  }
}

function createKnobs (group, data, dom) {
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

function createCheckboxes (group, data, dom) {
  if (data == undefined) return; // Not all groups have checkboxes

  for (let name of data) {
    const div = document.createElement("div");
    div.setAttribute('id', `${group}-${name}-checkbox`);
    div.setAttribute('style', 'display: none;');
    div.setAttribute('aria-hidden', 'true');
    
    const label = document.createElement("label");
    
    label.innerText = name + ":"

    const input = document.createElement("input");
    input.setAttribute("id", `${group}-${name}`);
    input.setAttribute("type", "checkbox");
    input.setAttribute("onchange", `sendMessage('${group}-${name}', this.checked)`); // TODO message sending?

    label.appendChild(input);
    div.appendChild(label);

    dom.appendChild(div);
  }
}

// Display functions

function changeGroupDisplay(data, group) {
  displayDropdowns(data, group);
  displayKnobs(data, group);
  displayCheckboxes(data, group);
}

function displayDropdowns(data, group) {
  for (let groupName of Object.keys(data)) {
    if (groupName === group) {  // Set select visible
      for (let optionsName of Object.keys(data[groupName].dropdowns)) {
        const div = document.getElementById(`${groupName}-parameters-${optionsName}`);
        div.setAttribute('style', 'display: inline;');
        div.setAttribute('aria-hidden', 'false');
      }
    } else {  // Set hidden
      for (let optionsName of Object.keys(data[groupName].dropdowns)) {
        const div = document.getElementById(`${groupName}-parameters-${optionsName}`);
        div.setAttribute('style', 'display: none;');
        div.setAttribute('aria-hidden', 'true');
      }
    }
  }
}

function displayKnobs (data, group) {
  for (let name of Object.keys(data)) {
    if (name == group) {  // Set values visible
      for (let value of data[name].knobs) {
        const div = document.getElementById(`${name}-${value}-value`);
        div.setAttribute('style', 'display: block;');
        div.setAttribute('aria-hidden', 'false');
      }
    } else {  // Set hidden
      for (let value of data[name].knobs) {
        const div = document.getElementById(`${name}-${value}-value`);
        div.setAttribute('style', 'display: none;');
        div.setAttribute('aria-hidden', 'true');
      }
    }
  }
}

function displayCheckboxes(data, group) {
  for (let name of Object.keys(data)) {
    if (data[name].checkboxes == undefined) continue; // Not all groups have checkboxes

    if (name == group) {  // Set values visible
      for (let value of data[name].checkboxes) {
        const div = document.getElementById(`${name}-${value}-checkbox`);
        div.setAttribute('style', 'display: block;');
        div.setAttribute('aria-hidden', 'false');
      }
    } else {  // Set hidden
      for (let value of data[name].checkboxes) {
        const div = document.getElementById(`${name}-${value}-checkbox`);
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
    if (typeof value === 'boolean') { // Checkbox
      dataValue = value ? 1 : 0 // TODO: not sure how checkboxes are set in the editor
    } else { // Dropdown option
      dataValue = dropdowns[control].indexOf(value);
    }
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



