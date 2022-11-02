/*** 
 * Raw data storage 
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
