/***
 * Functions that burn and load presets on the filter pedal itself
 ***/

/**
 * Burns the current settings of the filter pedal to a preset at the given index.
 * @param presetIndex a value from 0-127
 */
function burnPreset(presetIndex) {
  document.getElementById('current-preset').innerHTML = presetIndex;
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
      document.getElementById('burn-message').innerText = 'Preset burned.';
    })
  }
  loadPreset(presetIndex, burn=true) // needed so the pedal switches to the recently burned preset
}

/**
 * Loads the filter pedal settings of the preset at the given index.
 * @param presetIndex a value from 0-127
 */
function loadPreset(presetIndex, burn=false) {
  console.log(`loading preset from index ${presetIndex}`);

  if (navigator.requestMIDIAccess) {navigator.requestMIDIAccess({ sysex: true })
    .then((access) => {
      const output = access.outputs.values().next().value;

      output.open();

      // Bytes are annotated below, corresponding to the syntax given above. 
      // Bytes that need to be set are marked *, the rest should not be changed
      //     Start  ------ID------   --Command-- ---presetIndex--- -End-
      msg = [0xf0, 0x00, 0x01, 0x6c, 0x00, 0x77, 0x00, presetIndex, 0xf7];

      output.send(msg);
      if (!burn) document.getElementById('load-message').innerText = 'Preset loaded.'; // don't update the message when its a burn load
    })
  }
}

function resetPresetMessages() {
  document.getElementById('burn-message').innerText = '';
  document.getElementById('load-message').innerText = '';
}