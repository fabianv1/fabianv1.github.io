/*** 
 * Raw data storage 
 ***/

// Each object in data is one group of controls in the editor. Each group
// may have dropdowns, knobs, and/or checkboxes.
const data = {
  masterControls: {
    dropdowns: {},
    knobs: ["input1Gain", "input2Gain", "masterDepth", "modSource", "bass",
              "treble", "mix", "loRetain", "outputLevel", "outputBalance"],
  },
  distortion: {
    dropdowns: {
      type: ['mild', 'moderate', 'heavyBassy', 'sampleReducer', 'octaveFuzz', 'gatedFuzz',
            'foldoverLight', 'foldoverHeavy', 'doubleFoldover', 'doubleOctaveFuzz', 'tripleFold',
            'singleClip', 'maxFoldover'],
    },
    knobs: ['drive', 'cleanMix', 'output'],
    checkboxes: ['enable'],
  },
  // processor2Distortion: { // Seems to be locked - distortion 1 only
  //   dropdowns: {
  //     type: ['mild', 'moderate', 'heavyBassy', 'sampleReducer', 'octaveFuzz', 'gatedFuzz',
  //           'foldoverLight', 'foldoverHeavy', 'doubleFoldover', 'doubleOctaveFuzz', 'tripleFold',
  //           'singleClip', 'maxFoldover'],
  //   },
  //   knobs: ['drive', 'cleanMix', 'output'],
  //   checkboxes: ['enable'],
  // },
  voice1: {
    dropdowns: {
      source: ['Mono Input 1', 'Mono Input 2', 'Stereo Input Mix'],
      destination: ['distortionFilter', 'filterOnly', 'directOutput'],
      
    },
    knobs: ['level', 'processor'],
      checkboxes: ['enable']
  },
  voice2: {
    dropdowns: {
      source: ['Mono Input 1', 'Mono Input 2', 'Stereo Input Mix'],
      destination: ['distortionFilter', 'filterOnly', 'directOutput'],
      
    },
    knobs: ['level', 'processor'],
    checkboxes: ['enable']
  },
  octave1: {
    dropdowns: {
      source: ['1 Octave Down', '2 Octaves Down', '1 Octave Up'],
      destination: ['distortionFilter', 'filterOnly', 'directOutput'],
      
    },
    knobs: ['level', 'processor'],
    checkboxes: ['enable']
  },
  octave2: {
    dropdowns: {
      octave: ['down2', 'down1'],
      destination: ['distortionFilter', 'filterOnly', 'directOutput'],
      
    },
    knobs: ['level', 'processor', 'detune'],
      checkboxes: ['enable']
  },
  filter1: {
   dropdowns: {
      type: ['3ParallelLowPass', '6PoleLowPass', '2PoleLowPass', 'NotchLowPassPeak', 'NotchNotchLowPass',
            'PeakNotchLowPass', 'LowPassPeakPeak', '2ParallelLowPass', '4PoleLowPass', 'LowPassPeak',
            '4PoleLowPassPeak', 'Peak4PoleLowPass', 'Bandpass1', 'Peak', 'TriplePeak1', 'TriplePeak2',
            'TriplePeak3', 'TriplePeak4', 'PeakNotchPeak', 'NotchPeakNotch', '2StagePhaser', '3StagePhaser',
            '1StagePhaser', 'HighPass', 'HighPassPeak', 'ClassicWah', 'Bandpass2', 'DoublePeak', '6PoleAllPass'],
      modSource: ['envLfo1', 'envLfo2'],
      pitchTracking: ['pitchTrackOff', 'oneThird', 'twoThirds', 'one']
    },
    knobs: ['depth', 'frequency', 'q'],
    checkboxes: ['enable', 'invert'],
  },
  filter2: {
    dropdowns: {
      type: ['3ParallelLowPass', '6PoleLowPass', '2PoleLowPass', 'NotchLowPassPeak', 'NotchNotchLowPass',
            'PeakNotchLowPass', 'LowPassPeakPeak', '2ParallelLowPass', '4PoleLowPass', 'LowPassPeak',
            '4PoleLowPassPeak', 'Peak4PoleLowPass', 'Bandpass1', 'Peak', 'TriplePeak1', 'TriplePeak2',
            'TriplePeak3', 'TriplePeak4', 'PeakNotchPeak', 'NotchPeakNotch', '2StagePhaser', '3StagePhaser',
            '1StagePhaser', 'HighPass', 'HighPassPeak', 'ClassicWah', 'Bandpass2', 'DoublePeak', '6PoleAllPass'],
      modSource: ['envLfo1', 'envLfo2'],
      pitchTracking: ['pitchTrackOff', 'oneThird', 'twoThirds', 'one']
    },
    knobs: ['depth', 'frequency', 'q'],
    checkboxes: ['enable', 'invert'],
  },
  mix1: { // TODO: not working right now, maybe a sourceaudio bug, maybe our numbers are off
    dropdowns: {
      destination: ['output1Only', 'output1Output2', 'output2Only'],
    },
    knobs: [],
    checkboxes: ['enable'],
  },
  mix2: {
    dropdowns: {
      destination: ['output1Only', 'output1Output2', 'output2Only'],
    },
    knobs: [],
    checkboxes: ['enable'],
  },
  envelope1: {
    dropdowns: {
      type: [
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
        'Fastest Attack, Adjust/Decay'
      ],
      input: ['1', '2'], // TODO these seemed to be reversed but then swapping them did not help, maybe a sourceaudio bug?
    },
    knobs: ['speed', 'sensitivity', 'gate'],
  },
  envelope2: {
    dropdowns: {
      type: [
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
        'Fastest Attack, Adjust/Decay'
      ],
      input: ['1', '2'],
    },
    knobs: ['speed', 'sensitivity', 'gate'],
  },
  lfo: {
    dropdowns: {
      shape: ['sine', 'pluck', 'square', 'risingSaw', 'fallingSaw', 'triangle', 'sampleHold',
    '4Step', '4StepSh', 'sineSh', 'sineRiseSkew', 'sineFallSkew', 'triangleRiseSkew', 'triangleFallSkew'],
      multiply: ['1', '2', '3', '4', '5', '6', '7', '8', '16', '32', '64'],
    },
    knobs: ['speed', 'envelopeSpeed', 'envelopeDepth', 'lfo2Phase'],
    checkboxes: ['restartEnv1']
  },
};

// User Control Numbers for each knob or dropdown.
// The index of an item in the list is its user control number; items are named 
// as `groupname-valuename` or , if it sets multiple values `groupname-values`. 
// Some UCNs do not map to a knob or dropdown; these are still present here to 
// maintain correct indexing but have an empty comment (//) listed next to them.
const userControls = [
  // Master controls group
  'masterControls-input1Gain',
  'masterControls-input2Gain',
  'masterControls-masterDepth',
  'masterControls-modSource',
  'masterControls-bass',
  'masterControls-treble',
  'masterControls-mix',
  'masterControls-loRetain',
  'masterControls-outputLevel',
  'masterControls-outputBalance',
  // Voice groups (many of the voice 1 and voice 2 functions don't seem to exist in the editor)
  'voice1-level',
  'voice1-processor',
  'voice1-detune', //
  'voice1-tremolo', //
  'voice1-octave', //
  'voice1-semitone', //
  'voice1-mode', //
  'voice1-source',
  'voice1-envelope', //
  'voice1-destination',
  'voice1-tremoloSource', //
  'voice1-modulate', //
  'voice1-enable',
  'voice2-level',
  'voice2-processor',
  'voice2-detune', //
  'voice2-tremolo', //
  'voice2-octave', //
  'voice2-semitone', //
  'voice2-mode', //
  'voice2-source',
  'voice2-envelope', //
  'voice2-destination',
  'voice2-tremoloSource', //
  'voice2-modulate', //
  'voice2-enable',
  // Voice 3 and voice 4 are mapped to octave1 and octave2 but most of the functionality doesn't appear
  'octave1-level',
  'octave1-processor',
  'octave1-detune',
  'octave1-tremolo',
  'octave1-octave',
  'octave1-semitone',
  'octave1-mode',
  'octave1-source',
  'octave1-envelope',
  'octave1-destination',
  'octave1-tremoloSource',
  'octave1-modulate',
  'octave1-enable',
  'octave2-level',
  'octave2-processor',
  'octave2-detune',
  'octave2-tremolo',
  'octave2-octave',
  'octave2-semitone',
  'octave2-mode',
  'octave2-source',
  'octave2-envelope',
  'octave2-destination',
  'octave2-tremoloSource',
  'octave2-modulate',
  'octave2-enable',
  // Distortion group
  'distortion-drive',
  'distortion-cleanMix',
  'distortion-output',
  'distortion-type',
  'distortion-enable',
  // Filter groups (also part of mix groups)
  'filter1-depth',
  'filter1-frequency',
  'filter1-q',
  'filter1-type',
  'filter1-modSource',
  'filter1-invert',
  'filter1-enable',
  'filter1-pitchTracking',
  'mix1-destination',
  'filter2-depth',
  'filter2-frequency',
  'filter2-q',
  'filter2-type',
  'filter2-modSource',
  'filter2-invert',
  'filter2-enable',
  'filter2-pitchTracking',
  'mix2-destination',
  // Envelope groups
  'envelope1-sensitivity',
  'envelope1-speed',
  'envelope1-gate',
  'envelope1-type',
  'envelope1-input',
  'envelope2-sensitivity',
  'envelope2-speed',
  'envelope2-gate',
  'envelope2-type',
  'envelope2-input',
  // TODO Stuff I don't understand
  'sine1FmDepth',
  'sine2FmDepth',
  'sine1FmSource',
  'sine1FmSource',
  'monoPitchShifter1Filter',
  'monoPitchShifter2Filter',
  // LFO group
  'lfo-speed',
  'lfo-envelopeSpeed',
  'lfo-envelopeDepth',
  'lfo-lfo2Phase',
  'lfo-multiply',
  'lfo-shape',
  'lfo-restartEnv1',
  'lfo-tap', // TODO don't understand
  // TODO stuff I don't understand
  'sequencer1Steps', // TODO list numbers seem to get off around here
  'sequencer1value1',
  'sequencer1value2',
  'sequencer1value3',
  'sequencer1value4',
  'sequencer1value5',
  'sequencer1value6',
  'sequencer1value7',
  'sequencer1value8',
  'sequencer1value9',
  'sequencer1value10',
  'sequencer1value11',
  'sequencer1value12',
  'sequencer1value13',
  'sequencer1value14',
  'sequencer1value15',
  'sequencer1value16',
  'sequencer2Steps',
  'sequencer2value1',
  'sequencer2value2',
  'sequencer2value3',
  'sequencer2value4',
  'sequencer2value5',
  'sequencer2value6',
  'sequencer2value7',
  'sequencer2value8',
  'sequencer2value9',
  'sequencer2value10',
  'sequencer2value11',
  'sequencer2value12',
  'sequencer2value13',
  'sequencer2value14',
  'sequencer2value15',
  'sequencer2value16',
  'harmonyTuning',
  'harmonyKey',
  'harmonyMode',
  'harmonyInterval1',
  'harmonyInterval2',
  'pitchDetectorInput',
  'pitchDetectorLowNote',
  'pitchDetectorHighNote',
  'control1KnobAssign',
  'control2KnobAssign',
  'externalControl1Destination',
  'externalControl1Source',
  'externalControl1Min',
  'externalControl1Max',
  'externalControl2Destination',
  'externalControl2Source',
  'externalControl2Min',
  'externalControl2Max',
  'externalControl3Destination',
  'externalControl3Source',
  'externalControl3Min',
  'externalControl3Max',
  'externalControlEnable',
  'lfoSyncToMidiClock',
  'pitchDetectorEnable',
  'mix1-enable',
  'mix2-enable',
  'inputRoutingOption',
  'remoteTapTempo',
  'remoteExpressionPedal',
  'engagedBypass',
  'presetRecallOff',
  'presetRecallOn',
  'engagedBypassToggle',
  'incrementPreset',
  'decrementPreset',
]

// Dropdowns each have their own number-to-value mapping. Many default to being
// simply in-order; ones which have a distinct order are separately recorded here.
const differentlyOrderedDropdowns = { 
  'envelope1-type': [
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
    'ADSR 6 Slow Attack, Fast Decay', '', '',
    'Fastest Attack, Adjust/Decay'
  ],
  'envelope2-type': [
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
    'ADSR 6 Slow Attack, Fast Decay', '', '',
    'Fastest Attack, Adjust/Decay'
  ],
  'voice1-source': [
    'Stereo Input Mix',
    '', '', '', '', '', '', '', '', '', '',
    'Mono Input 1',
    'Mono Input 2'
  ],
  'voice2-source': [
    'Stereo Input Mix',
    '', '', '', '', '', '', '', '', '', '',
    'Mono Input 1',
    'Mono Input 2'
  ]
}

// User Control Numbers:
// - Voice 1 Mode is            0x10
// - Voice 2 Destination is     0x20
// - Voice 3 Enable is          0x30
// - Distortion - Output is     0x40
// - Filter 2 Mod Source is     0x50
// - Sine 2 FM Depth is         0x60 // correctly is number 0x60 = 96 in list rn
// - Sequencer 1 Value 3 is     0x70 // incorrectly is 110 in list rn, two smaller than it should be
// - Sequencer 2 Value 2 is     0x80 -> 0x01, 0x00
// - Harmony Key is             0x90 -> 0x01, 0x10
// - External Control Max 2 is  0xa0 -> 0x01, 0x20
// - Engaged/Bypass Toggle is   0xb0 -> 0x01, 0x30
// - Decrement Preset is        0xb5 -> 0x01, 0x35
