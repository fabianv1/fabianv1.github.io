/***
 * Functions that burn and load presets on the filter pedal itself
 ***/

/**
 * Burns the current settings of the filter pedal to a preset at the given index.
 * @param presetIndex a value from 0-127
 */
function burnPreset(presetIndex) {
  console.log(`setting preset at index ${presetIndex}`);

  if (navigator.requestMIDIAccess) {navigator.requestMIDIAccess({ sysex: true })
    .then((access) => {
      const output = access.outputs.values().next().value;

      output.open();

      // Bytes are annotated below, corresponding to the syntax given by SourceAudio. 
      // Bytes that need to be set are marked *, the rest should not be changed
      //     Start  ------ID------   --Command-- ---presetIndex*-- --If Name-- -End-
      msg = [0xf0, 0x00, 0x01, 0x6c, 0x00, 0x6e, 0x00, presetIndex, 0x00, 0x00, 0xf7];

      output.send(msg);
    })
  }
}

/**
 * Loads the filter pedal settings of the preset at the given index.
 * @param presetIndex a value from 0-127
 */
function loadPreset(presetIndex) {
  console.log(`loading preset hi from index ${presetIndex}}`);

  if (navigator.requestMIDIAccess) {navigator.requestMIDIAccess({ sysex: true })
    .then((access) => {
      const output = access.outputs.values().next().value;

      output.open();

      // Bytes are annotated below, corresponding to the syntax given above. 
      // Bytes that need to be set are marked *, the rest should not be changed
      //     Start  ------ID------   --Command-- ---presetIndex--- -End-
      msg = [0xf0, 0x00, 0x01, 0x6c, 0x00, 0x77, 0x00, presetIndex, 0xf7];

      output.send(msg);
    })
  }
}

const presetDom = document.getElementById('presets');

// title heading of preset section
const presetTitle = document.createElement('h2');
presetTitle.innerText = 'Presets';
presetDom.appendChild(presetTitle)

// the div containing the presetIndex input
const presetIndexDiv = document.createElement("div");
presetIndexDiv.setAttribute('id', 'presetIndex-value');
presetIndexDiv.setAttribute('style', 'display: block;');
presetIndexDiv.setAttribute('aria-hidden', 'false');

// label surrounding the presetIndex input
const presetIndexlabel = document.createElement("label");
presetIndexlabel.innerText = "presetIndex:"

// number input pertaining to a preset index
const presetIndexInput = document.createElement("input");
presetIndexInput.setAttribute("id", 'presetIndex');
presetIndexInput.setAttribute("type", "number");
presetIndexInput.setAttribute("class", "number");
presetIndexInput.setAttribute("min", 0);
presetIndexInput.setAttribute("max", 127);
presetIndexInput.setAttribute("value", 6);
presetIndexInput.setAttribute("accesskey", "p");

// adding to the dom
presetIndexlabel.appendChild(presetIndexInput);
presetIndexDiv.appendChild(presetIndexlabel);
presetDom.appendChild(presetIndexDiv);

// button to prompt a burning of a new preset
const burnButton = document.createElement("button");
burnButton.setAttribute('onclick', 'burnPreset(presetIndexInput.value)');
burnButton.innerText = 'Burn current settings at preset at index given above';
document.getElementById('presets').appendChild(burnButton);

// button to prompt the loading of a preset
const loadButton = document.createElement("button");
loadButton.setAttribute('onclick', 'loadPreset(presetIndexInput.value)');
loadButton.innerText = 'Load preset at index given above';
document.getElementById('presets').appendChild(loadButton)