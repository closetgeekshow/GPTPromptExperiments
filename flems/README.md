# Flems Format
This is a thing I made with to make it easier to create html demos with the assitance of AI tools like ChatGPT. 

## Components
* [Flems File Format Specification](</flems/convert to flems format.md>) - give this text to an LLM when they give you some code HTML/CSS/JS spread across multiple files to get them to give you it in one easily copy-pasted code block that maintains seperation of files, save it as a `.flems` file
* [flems-sfc.js](/flems/flems-sfc.js) - interprets a `.flems` file for use with the [self-hosted version of the Flems web playground/sandbox](https://github.com/porsager/flems)
* [index.html](/flems/index.html) - HTML page hosting the flems script, 

## File Structure
* `/src/index.html` - the html page, use the querystring `?sfc={filename}` including the extension is optional
* `/src/flems-sfc.js` - the library
* `/src/sfc/*.flems` - put all your .flems files inside an `sfc` sub-folder  

## Example Flems files
These are some things I've made with this tool and LLMs
* [Hello World](/flems/src/sfc/hello-world.flems) - this is the default flems demo
* [Excalidraw](/flems/src/sfc/excalidraw.flems) - Excalidraw 
* [Magic the Gathering Card Viewer](/flems/src/sfc/mtg-card-viewer.flems) - MTG Card Viewer
