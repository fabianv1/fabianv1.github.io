// Data generation - relies on objects in data.js to generate the dropdown for each group
// and each group's associated dropdowns, value knobs, and checkboxes

/**
 * Initial creation steps for the settings
 **/

const groups = document.querySelector("#groups");

createDropdowns(data, groups);
(Object.keys(data)).map(group => Object.keys(data[group].dropdowns).forEach(
  list => createDropdowns(data[group].dropdowns[list], document.getElementById('dropdowns'), `${group}-${list}`)));
(Object.keys(data)).map(group => 
  createKnobs(group, data[group].knobs, document.getElementById("knobs")));
(Object.keys(data)).map(group => 
  createCheckboxes(group, data[group].checkboxes, document.getElementById("checkboxes")));

changeGroupDisplay(data, groups.value); // Display for initial group
// Event listener to change which group's settings are being displayed
groups.addEventListener("change", () => changeGroupDisplay(data, groups.value));

/**
 * Creation functions
 **/

function createDropdowns (data, dom, name = null) {
  // Non-null `name` means we are creating multiple groups of options, so add them in
  // separate select containers and make them invisible for now

  if (!(data instanceof Array)) data = Object.keys(data);
  let container;
  if (name != null) {
    container = document.createElement('select');
    
    container.setAttribute('onchange', `sendDelayedWriteMessage('${name}', this.value, 500)`);
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
    const label = document.createElement('label');
    label.setAttribute('id', name);
    label.innerText = name.split('-')[1] + ': ';
    label.setAttribute('style', 'display: none;');
    label.setAttribute('aria-hidden', 'true');
    label.appendChild(container);
    dom.appendChild(label);
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
    input.setAttribute("onchange", `sendDelayedWriteMessage('${group}-${name}', this.value, 500)`);

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
    input.setAttribute("onchange", `sendWriteMessage('${group}-${name}', this.checked)`);

    label.appendChild(input);
    div.appendChild(label);

    dom.appendChild(div);
  }
}

/**
 * Display/update functions
 **/

function changeGroupDisplay(data, group) {
  displayDropdowns(data, group);
  displayKnobs(data, group);
  displayCheckboxes(data, group);
}

function displayDropdowns(data, group) {
  for (let groupName of Object.keys(data)) {
    if (groupName === group) {  // Set select visible
      for (let optionsName of Object.keys(data[groupName].dropdowns)) {
        const div = document.getElementById(`${groupName}-${optionsName}`);
        div.setAttribute('style', 'display: inline;');
        div.setAttribute('aria-hidden', 'false');
      }
    } else {  // Set hidden
      for (let optionsName of Object.keys(data[groupName].dropdowns)) {
        const div = document.getElementById(`${groupName}-${optionsName}`);
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