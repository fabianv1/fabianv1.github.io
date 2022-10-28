const data = {
    masterControls: {
      options: ['noOptions'],
      values: ["input1Gain", "input2Gain", "masterDepth", "modSource", "bass",
                "treble", "mix", "loRetain", "outputVolume", "outputBalance"],
    },
    envelope1: {
      options: ['fastAttack', 'fastestAttack', 'wideRange1', 'wideRange2', 'snappy',
                'swell', 'ADSR1', 'ADSR2', 'ADSR3', 'ADSR4', 'ADSR5', 'ADSR6'],
      values: ['speed', 'sensitivity', 'gate'],
    },
    envelope2: {
      options: ['fastAttack', 'fastestAttack', 'wideRange1', 'wideRange2', 'snappy',
                'swell', 'ADSR1', 'ADSR2', 'ADSR3', 'ADSR4', 'ADSR5', 'ADSR6'],
      values: ['speed', 'sensitivity', 'gate'],
    },
  };
  
  
  const groups = document.querySelector("#groups");
  const parameters = document.querySelector("#parameters");
  
  // TODO: have parameter setting persist on group change
  groups.addEventListener("change", () => display(data[groups.value].options, parameters));
  groups.addEventListener("change", () => displayValues(data, groups.value));
  
  display(data, groups);
  display(data[groups.value].options, parameters);
  (Object.keys(data)).map(group => values(group, data[group].values, document.getElementById("values")));
  displayValues(data, groups.value);
  
  function values (group, data, dom) {
    for (let name of data) {
      const div = document.createElement("div");
      div.setAttribute('id', `${group}-${name}-value`);
      div.setAttribute('style', 'display: none;');
      div.setAttribute('aria-hidden', 'true');
      
      const label = document.createElement("label");
      label.setAttribute("id", `${group}-${name}`);
      label.innerText = name + ":"
      div.appendChild(label);

      const input = document.createElement("input");
      input.setAttribute("type", "number");
      input.setAttribute("aria-labelledby", `${group}-${name}`);
      input.setAttribute("class", "number");
      input.setAttribute("min", 0);
      input.setAttribute("max", 254);
      div.appendChild(input);

      dom.appendChild(div);
    }
  }

  function display (data, dom) {
    dom.innerHTML = "";
    if (not(data instanceof Array)) data = Object.keys(data);
    for (let name of data) {
      const option = document.createElement("option");
      option.textContent = name;
      option.setAttribute("value", name);
      dom.add(option);
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
  
  function not (x) {return !x;}

  function sendMessage() {
    console.log('hi')

    // CODE FROM WEBMIDI API STUFF
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({ sysex: true })
        .then((access) => {
          const inputs = access.inputs
          const outputs = access.outputs

          console.log(inputs)
          console.log(outputs)

          let ourInput = inputs.values().next().value;
          let ourOutput = outputs.values().next().value;

          ourInput.open();
          ourOutput.open();
          ourInput.onmidimessage = (msg) => { console.log('in: ' + msg); }
          ourOutput.onmidimessage = (msg) => { console.log('out: ' + msg); }

          /*
          [
            SysEx Start (1 byte: 0xF0),
            Source Audio MIDI SysEx ID (3 bytes: 0x00, 0x01, 0x6c),
            Command Type (2 bytes: 0x00, 0x70 is Write User Control),
            User Control Number (2 bytes: 0x00, 0x02 is Master Depth),
            Data Value (4 bytes: 16-bits max input but most knobs are 8-bit with max value of 254 [more info below]),
            SysEx End (1 byte: 0xf7)
          ]
          * Note that because MIDI message contents can’t exceed 127 (0x7F),
            8-bit values must be split into two 7-bit values. Since data can be 16 bits, it must have its higher 8 bits 
            split into 2 bytes and lower 8 bits split into two bytes, hence the 4 bytes
          */
          sentMsg = [0xf0, 0x00, 0x01, 0x6c, 0x00, 0x70, 0x00, 0x58, 0x00, 0x00, 0x00, 0x0d, 0xf7]
          ourOutput.send(sentMsg)
          console.log('sending...')
          console.log(ourOutput)
          console.log('sent m: ' + sentMsg)
        })
  }
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
  // - Harmoney Key is            0x90 -> 0x01, 0x10
  // - External Control Max 2 is  0xa0 -> 0x01, 0x20
  // - Engaged/Bypass Toggle is   0xb0 -> 0x01, 0x30
  // - Decrement Preset is        0xb5 -> 0x01, 0x35

  // For Envelope 1 Type (0x58):
  /*
  {
    0x00 : 'ADSR 1 Adjust Attack/Decay',
    0x01 : 'Fast Attack, Adjust Decay',
    0x02 : 'Wide Range 1, Adjust Attack/Decay',
    0x03 : 'Swell',
    0x04 : 'Wide Range 2, Faster Decay',
    0x05 : 'Snappy',
    0x06 : 'ADSR 2 Fast Attack, Adjust Decay',
    0x07 : 'ADSR 3 Adjusst Attack/Decay',
    0x08 : 'ADSR 4',
    0x09 : 'ADSR 5',
    0x0a : 'ADSR 6 Slow Attack, Fast Decay',
    0x0d : 'Fastest Attack, Adjust/Decay',
    0x0e : 'Wide Range 1, Adjust Attack/Decay'
  }
  */ 