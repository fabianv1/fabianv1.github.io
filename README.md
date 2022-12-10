# Spectrum Filter - Accessible Editor
## User Guide
### About
This is an accessible editor specifically designed for use with the [Spectrum Intelligent Filter](https://www.sourceaudio.net/spectrum_intelligent_filter.html) manufactured and sold by [SourceAudio](https://www.sourceaudio.com/). 
This editor is built to mirror the [Neuro Desktop Editor](https://www.sourceaudio.net/neuro-editors.html) also made by SourceAudio, but with built-in HTML accessibility capacity. 
It is usable by anyone but especially intended for those using screenreaders.
It was built as part of MIT's Principles and Practice of Assistive Technology class, Fall 2022, by Fabian Velasquez and Shuli Jones, with significant support from Rich Caloggero and Jesse Remignanti.

### Basic Use
To use this editor, you will need to run it in your browser. 
You will need to have the Spectrum Intelligent Filter and a cable to connect the Filter to your computer. 
You will also need whatever else you use with the Filter (for example, your guitar, an amp, and I/O cables).

Open the editor and plug the Filter into your computer. 
At this point, no further work should be needed and you should be able to use the editor to change the settings on the Filter.
You can use the 'Test Connectivity' button on the editor to confirm that the editor is connected to the Filter.
If 'Filter not connected' text appears after the button, or no message appears after ten seconds, the editor is not connected and will not work. To fix this, see the Troubleshooting section below.

### Dependencies
This editor runs using the WebMIDI API. You must run it in a browser that supports WebMIDI. 
As of writing (December 2022), Google Chrome fully supports WebMIDI. 
Some versions of Firefox offer initial support, in particular Firefox Nightly and Firefox Beta, but they are not yet fully developed. 
We recommend Google Chrome for the most consistent results.

Other than WebMIDI, the editor is written entirely in basic HTML and JavaScript, so you should not need to install any packages to use it. 
It uses some ARIA functionality as well as accesskeys.

## Developer Guide
### Overview of Code
The editor has five code files. Here is a quick overview of each one. More information about each is given below.
- index.html: holds the basic HTML for the editor and includes the four JavaScript files that populate the rest of the page and control message sending and receiving.
- data.js: contains all the data on what settings are available in the Neuro Desktop and the names they are called by on the filter.
- index.js: populates the editor with the settings in data.js.
- messages.js: contains the data on what shape the messages to and from the Spectrum Filter take, and has the functions for sending and receiving the messages.
- presets.js: has the specialized messages for loading and burning presets with the Filter.

The editor can be hosted on any typical website. For easiest hosting, we recommend using [GitHub Pages](https://pages.github.com/) which can be linked directly to the editor's code repository. It can also be run locally with no difference in its capacity: simply open the index.html file in your browser. This is our recommended method for development. The development cycle is then as easy as editing the files in your local folder and refreshing the index.html file in your browser. You may need to do a hard refresh of the page or clear your cache beforehand to ensure that changes propagate.

### HTML

### MIDI Data

### Message Sending and Receiving

#### Write Messages

#### Read Messages

#### Ping Messages

#### Preset Messages

### Troubleshooting