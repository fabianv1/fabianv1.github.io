/*** 
 * Raw data storage 
 ***/

// Each object in data is one group of controls in the editor. The 'options' array
// is the dropdown options and the 'values' array is the knob options.
const data = {
  masterControls: {
    options: {},
    values: ["input1Gain", "input2Gain", "masterDepth", "modSource", "bass",
              "treble", "mix", "loRetain", "outputVolume", "outputBalance"],
  },
  // TODO missing voice and octave because they have two dropdowns and right now we're only equipped for 1
  // also not sure if rich will use them, we can ask him
  processor1Distortion: {
    options: {
      type: ['mild'],
    }, // TODO get the other options
    values: ['drive', 'cleanMix', 'output'],
  },
  processor2Distortion: {
    options: {
      type: ['mild'],
    }, // TODO get the other options
    values: ['drive', 'cleanMix', 'output'],
  },
  // TODO get filtering working right
  processor1Filtering: {
    options: {
      idk1: ['2poleLowPass'],
      idk2: ['env/LFO1'],
      idk3: ['pitchTrackOff']
    },
    values: ['depth', 'frequency', 'q'],
  },
  mix1: {
    options: {
      destination: ['output1Only'],
    }, // TODO get the other options
    values: [],
  },
  mix2: {
    options: {
      destination: ['output1Only'],
    }, // TODO get the other options
    values: [],
  },
  // TODO missing LFO 1 & 2 because they have a lot of settings I don't understand
  envelope1: {
    options: {
      type: [
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
    },
    values: ['speed', 'sensitivity', 'gate'],
  },
  envelope2: {
    options: {
      type: [
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
    },
    values: ['speed', 'sensitivity', 'gate'],
  },
};

// User Control Numbers for each knob or dropdown.
// The index of an item in the list is its user control number; items are named 
// as `groupname-valuename` or , if it sets multiple values `groupname-values`. 
// Some UCNs do not map to a knob or dropdown; these are still present here to 
// maintain correct indexing but have an empty comment (//) listed next to them.
// TODO: UCNs which do map to a knob/dropdown in the original editor, but not in
// ours as of yet, have a to-do comment listed next to them.
const userControls = [
  'masterControls-input1Gain',
  'masterControls-input2Gain',
  'masterControls-masterDepth',
  'masterControls-modSource',
  'masterControls-bass',
  'masterControls-treble',
  'masterControls-mix',
  'masterControls-loRetain',
  'masterControls-outputVolume',
  'masterControls-outputLevel',
  'voice1-level', // TODO
  'voice1-processor', // TODO
  'voice1-detune', // ??? not sure what all these voices are
  'voice1-tremolo', //
  'voice1-octave', //
  'voice1-semitone', //
  'voice1-mode', //
  'voice1-source', //
  'voice1-source', // TODO
  'voice1-envelope', //
  'voice1-destination', // TODO
  'voice1-tremoloSource', //
  'voice1-modulate', //
  'voice1-enable', // TODO
  'voice2-level', // TODO
  'voice2-processor', // TODO
  'voice2-detune', //
  'voice2-tremolo', //
  'voice2-octave', //
  'voice2-semitone', //
  'voice2-mode', //
  'voice2-source', //
  'voice2-source', // TODO
  'voice2-envelope', //
  'voice2-destination', // TODO
  'voice2-tremoloSource', //
  'voice2-modulate', //
  'voice2-enable', // TODO
  'voice3-level', // TODO
  'voice3-processor', // TODO
  'voice3-detune', // ??? not sure what all these voices are
  'voice3-tremolo', //
  'voice3-octave', //
  'voice3-semitone', //
  'voice3-mode', //
  'voice3-source', //
  'voice3-source', // TODO
  'voice3-envelope', //
  'voice3-destination', // TODO
  'voice3-tremoloSource', //
  'voice3-modulate', //
  'voice3-enable', // TODO
  'voice4-level', // TODO
  'voice4-processor', // TODO
  'voice4-detune', // ??? not sure what all these voices are
  'voice4-tremolo', //
  'voice4-octave', //
  'voice4-semitone', //
  'voice4-mode', //
  'voice4-source', //
  'voice4-source', // TODO
  'voice4-envelope', //
  'voice4-destination', // TODO
  'voice4-tremoloSource', //
  'voice4-modulate', //
  'voice4-enable', // TODO
  'distortion-drive',
  'distortion-cleanMix',
  'distortion-output',
  'distortion-values', // TODO rename values to type
  'distortion-enable', // TODO
  'filter1-depth',
  'filter1-frequency',
  'filter1-q',
  'filter1-values',
  'filter1-modSource', //
  'filter1-invert', // TODO
  'filter1-enable', // TODO
  'filter1-pitchTracking', // TODO
  'mix1-destination',
  'filter2-depth',
  'filter2-frequency',
  'filter2-q',
  'filter2-values',
  'filter2-modSource', //
  'filter2-invert', // TODO
  'filter2-enable', // TODO
  'filter2-pitchTracking', // TODO
  'mix2-destination',
  'envelope1-sensitivity',
  'envelope1-speed',
  'envelope1-gate',
  'envelope1-values', //should actually be 0x58
  'envelope2-sensitivity',
  'envelope2-speed',
  'envelope2-gate',
  'envelope2-values',
  // TODO after this comes the LFO stuff that I don't fully understand
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
