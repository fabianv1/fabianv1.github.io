# Spectrum Filter - Accessible Editor
## User Guide
### About
This is an accessible editor specifically designed for use with the [Spectrum Intelligent Filter](https://www.sourceaudio.net/spectrum_intelligent_filter.html) manufactured and sold by [SourceAudio](https://www.sourceaudio.com/). 
This editor is built to mirror the [Neuro Desktop Editor](https://www.sourceaudio.net/neuro-editors.html) also made by SourceAudio, but with built-in HTML accessibility capacity. 
It is usable by anyone but especially intended for those using screenreaders.
It was built as part of MIT's Principles and Practice of Assistive Technology class, Fall 2022, by Fabian Velasquez and Shuli Jones, with invaluable support from Rich Caloggero and Jesse Remignanti.

### Basic Use
To use this editor, you will need to run it in your browser. 
You will need to have the Spectrum Intelligent Filter and a cable to connect the Filter to your computer. 
You will also need whatever else you use with the Filter (for example, your guitar, an amp, and I/O cables).

Open the editor in your browser and plug the Filter into your computer. 
This is all that is needed: you should now be able to use the editor to change the settings on the Filter.
You can use the 'Test Connectivity' button on the editor to confirm that the editor is connected to the Filter. 
Either opening the editor or pressing this button will cause a popup requesting that you grant WebMIDI access to the Filter. You must click allow.
If no popup appears, the 'Filter not connected' text appears after the button, or no text appears after ten seconds, then the editor is not connected and will not work. To fix this, see the Troubleshooting section below.

### Dependencies
This editor runs using the WebMIDI API. You must run it in a browser that supports WebMIDI. 
As of writing (December 2022), Google Chrome fully supports WebMIDI. 
Some versions of Firefox offer initial support, in particular Firefox Nightly and Firefox Beta, but they are not yet fully developed. 
We recommend Google Chrome for the most consistent results.

Other than WebMIDI, the editor is written entirely in basic HTML and JavaScript, so you should not need to install any packages to use it. 
It uses some ARIA functionality as well as accesskeys.

## Developer Guide
### Overview of Code
The editor is made of five code files. Here is a quick overview of each one. More information about each is given below. This guide assumes that you understand basic HTML and JavaScript and are familiar with the Spectrum Intelligent Filter. No understanding of MIDI is needed beyond the fact that it is a message protocol.

- **index.html**: holds the basic HTML for the editor and includes the four JavaScript files that populate the rest of the page and control message sending and receiving.
- **data.js**: contains all the data on what settings are available in the Neuro Desktop and the names they are called by on the filter.
- **index.js**: populates the editor with the settings in data.js.
- **messages.js**: contains the data on what shape the messages to and from the Spectrum Filter take, and has the functions for sending and receiving the messages.
- **presets.js**: has the specialized messages for loading and burning presets with the Filter.

The editor can be hosted on any typical website. For easiest hosting, we recommend using [GitHub Pages](https://pages.github.com/) which can be linked directly to the editor's code repository. 
It can also be run locally with no difference in its capacity: simply open the index.html file in your browser.
This is our recommended method for development. 
The development cycle is then as easy as editing the files in your local folder and refreshing the index.html file in your browser. 
You may need to do a hard refresh of the page or clear your cache beforehand to ensure that changes propagate.

### HTML
The entire website lives on one HTML page, index.html, which you can think of as divided into four sections. 
1. The first section of the HTML is simple text explaining how to use the website.
2. The second section is a couple of quick indicators: the button to test connectivity, which calls a testing function in messages.js, and the text with the status of the filter's alt button, which is updated by a function in messages.js.  
3. The third section is the biggest one. It holds all of the settings for changing the filter's parameters. Unlike the other sections, this one is mostly empty in index.html. The settings are populated by the index.js file, which uses data from the data.js file.
4. The fourth section is for burning and loading presets. It calls the special preset functions in preset.js.

### Filter Parameters
#### Overview
In the original Neuro Desktop Editor, there are many groups of settings. Each group has a name, for example 'Master Controls' or 'Voice 1'. 
Within each group, there are a variety of controls. Each control is either a checkbox, a dropdown, or a knob. Each control has its own name (for example a checkbox could be 'Enable' or a dropdown could be 'Source'). 
Dropdowns additionally have the names of whatever options can be selected. All knobs go from 0 to 254. Within each group, each control is independent from all the others, meaning each one can be set without changing any of the others. (The one exception to this is the 'Octave 1' and 'Octave 2' groups.)

Inside the code used by the Filter and the Neuro Desktop Editor, each control has its own number, called a user control number (UCN). These UCNs are unique to each control and used for message sending and receiving (see more on this below). Each option in a dropdown also has its own number. The dropdown option number are only unique within the dropdown; they are usually just 0 to n-1 (with n being the number of options), but in some cases other numberings are used.

#### Data Storage
The data.js file uses three data structures to keep track of every group, its controls, and their UCNs. The file has no functions and is only used to store data.

1. The `data` map. Each object in this map is one group in the Neuro Desktop settings; for example, the `masterControls` object maps to the Master Controls settings group. Each object has three fields: knobs, dropdowns, and checkboxes. These of course map to the knobs, dropdowns, and checkboxes that are inside this object's group in the editor. More information about each is below. Note that the knob and dropdown objects are required to be included; almost all groups have both knobs and dropdowns, but when one doesn't, an empty object should be given. The checkbox object is optional, since lots of groups don't have any.
    - Knobs: this is a list of strings, where each string is the name of a knob. All knobs go from 0 to 254, so no further information is needed.
    - Dropdowns: this is an object, where each field inside the object is the name of a dropdown mapping to the list of options in the dropdown. By default, it's assumed that the message-sending number of a dropdown object is its index in this list.
    - Checkboxes: this is a list of strings, where each string is the name of a checkbox.
2. The `userControls` list. This is a list of strings, where each string in the list is one control in the editor. The text of the strings are determined by the `data` map: each string is first the name of the group the control is within, then a dash, and then the name of the knob/dropdown/checkbox. (For example, the 'type' dropdown of the 'distortion' settings group is `distortion-type`.) The ordering of the strings is determined by the UCNs of the controls: each string's index is its UCN. Note that there is a UCN for each index, but not all of these controls are actually used in the editor. They are still listed in `userControls` to maintain the indexing constraint.
3. The `differentlyOrderedDropdowns` object. As mentioned above, by default most dropdowns' option numbers simply range from 0 to n - 1. However, a few dropdowns have different numbering systems. These are stored in this map. Each field in the object is one dropdown, with its name corresponding to its string in `userControls`. The name maps to a list of option names, where each option's number is its index in the list. Because some numbers are not assigned (e.g. a dropdown with three options that have numbers 0, 11, and 12), this means that these lists may have some empty strings. 

The data in this file comes from two sources. The first is the Neuro Desktop Editor itself (where groups, names, etc. can be seen by inspection). The second is the 'Spectrum User Control 1.1' Excel file, which is stored at the top level of this repo. That file lists the UCNs and dropdown option numbers for every setting available in the editor.

#### Loading Data Into HTML
This data is read by functions in the three other JavaScript files (index.js, messages.js, and preset.js). More about message sending and presets is below. 
This section details how index.js uses data.js to populate the third section of the HTML page. 
This section has four elements: a dropdown to change which group of settings is being changed, and then one div for each of knobs, dropdowns, and checkboxes that that group has. 
The groups dropdown is always the same, but the knobs, dropdowns, and checkboxes divs will be automatically updated to show the controls for whichever group is currently selected in the groups dropdown.

Index.js has three sections:
1. The first section is the only one that actually executes code. It calls the creation functions in section 2 so that they will execute on page load, and it attaches the display functions in section 3 to event listeners so that they will execute at the appropriate times.
2. The second section is the creation functions. There is one creation function for dropdowns, one for knobs, and one for checkboxes. Each function takes in a `data` parameter, which is an array of strings (for an object, its field names will be used) and a `dom` parameter, which is the element in the DOM where the new HTML will be added. The function will create one dropdown/knob/checkbox for each of the strings in `data`, and attach them all to `dom`. By default, all of these are made invisible.
3. The third section is the display functions. As with section 2, there is one display function for dropdowns, one for knobs, and one for checkboxes. Each function takes in a `data` parameter, which is just `data` from data.js, and a `group` parameter, which is a string representing the currently-selected group. The function will go through the group names in `data` and for each group that's not currently selected, it will hide its dropdowns, knobs, or checkboxes (depending on the function). For the group that is selected, it will make them visible. These functions are set up by section 1 so that they are called whenever the group selector changes.
   

### Message Sending and Receiving

#### Write Messages

#### Read Messages

#### Ping Messages

#### Preset Messages

### Troubleshooting