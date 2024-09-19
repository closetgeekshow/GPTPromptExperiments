adapt this simple html/js/css app i made into flems format, break apart and restructure content where sensible but avoid major functional alterations. 

PASTECODEHERE

.flems format: # Flems Demo File Format Specification

This specification outlines the structure and usage of the `.flems` file format, designed for quickly creating Flems demos from a single file. The file is divided into sections that define HTML, CSS, JavaScript, and external resources (links).

## File Structure

The `.flems` file consists of multiple sections, each denoted by a section header enclosed in square brackets `~SECTION_NAME~`. The content following each header is the associated code or data for that section.

### Sections

1. **~BODY~**  
   Defines the HTML content that will be inserted into the `<body>` tag of the document.  
   *The BODY section only supports HTML content.*  

2. **~CSS~**  
   Defines the CSS rules to be applied to the document.  
   *The CSS section contains valid CSS syntax.*

3. **~JS~**  
   Defines the JavaScript to be executed in the document.  
   *The JS section contains valid JavaScript syntax.*

4. **~LINKS~**  
   Defines external resources (JavaScript or CSS) to be included.  
   *The LINKS section consists of entries, each specifying the name, type, and URL of an external resource.*

### Query String Parameters

The `.flems` filename can be specified through the query string in the URL. The system will look for a `flems` parameter in the URL to dynamically load the corresponding `.flems` file.

- **Parameter**: `flems`
- **Description**: This query parameter specifies the `.flems` filename to be loaded and parsed. If not provided, it defaults to `'sfc.flems'`.
- **Example**:  
  URL: `https://example.com/demo.html?flems=mydemo`  
  The above URL would attempt to load the `mydemo.flems` file.

### Example File

```plaintext
~BODY~
<div id="app">
  boop
</div>

~CSS~
body {
  font-family: Arial, sans-serif;
}
#app {
  display: flex;
  justify-content: space-between;
  height: 100vh;
  padding: 10px;
}

~JS~
// Using document.write
document.write('Hello World');

~LINKS~
name: 'eruda'
type: 'script'
url: 'https://unpkg.com/eruda'

name: 'jQuery'
type: 'script'
url: 'https://unpkg.com/jquery'
```

## Parsing Rules

- **General**: Each section starts with a section header in square brackets `~SECTION_NAME~`, followed by the content of that section.
- **Section Headers**: The section names are case-insensitive. Empty sections are ignored.
- **LINKS Section**: 
  - Links are defined as key-value pairs separated by a colon `:`.
  - Valid keys: `name`, `type`, `url`.
  - Multiple links are separated by double newlines.
  - `type` must be either `script` or `css`. If no type is provided, `script` is assumed.
  - `name` defaults to the filename from the URL if not provided.

## Future Improvements

- **~BODY~ Section**: Plan to introduce support for defining the HTML tag, template elements, and attributes inside this section.
- **~JS~ Section**: Future versions will support TypeScript (`~TS~`) and LiveScript (`~LS~`) alongside JavaScript.

## Example Use Case

A file like the one above would generate a Flems demo with:
- HTML content inserted into the `<body>`.
- CSS rules applied to the document.
- JavaScript executed in the `<script>` tag.
- External resources (e.g., jQuery, Eruda) loaded via script tags.

## Implementation Reference

The following JavaScript algorithm demonstrates how to parse and utilize this file format:

```javascript
"use strict";
function getFlemsFilename() {
  const urlParams = new URLSearchParams(window.location.search);
  let flemsParam = urlParams.get("flems");
  
  if (!flemsParam) {
    return "sfc/sfc.flems"; // Default to 'sfc.flems' if not specified
  }

  // Decode the URL parameter
  let decodedParam = decodeURIComponent(flemsParam);

  // Check if the decoded parameter is a URL
  try {
    new URL(decodedParam);
    // If it's a valid URL, return it as is
    return decodedParam;
  } catch (error) {
    // If it's not a valid URL, treat it as a filename
    // Add .flems extension if not present
    if (!decodedParam.endsWith(".flems")) {
      decodedParam += ".flems";
    }
    return decodedParam;
  }
}

function fetchAndParseContent(url) {
  return fetch(url)
    .then((response) => response.text())
    .then((content) => {
      const sections = content.split(/~(\w+)~/);
      const parsed = {};

      for (let i = 1; i < sections.length; i += 2) {
        const sectionName = sections[i].toLowerCase();
        const sectionContent = sections[i + 1].trim();
        
        if (sectionName === "links") {
          parsed[sectionName] = parseLinks(sectionContent);
        } else {
          parsed[sectionName] = sectionContent;
        }
      }
      return parsed;
    });
}

function parseLinks(linksContent) {
  const linkEntries = linksContent.split("\n\n");
  return linkEntries
    .map((entry) => {
      const lines = entry.split("\n");
      const link = {};
      lines.forEach((line) => {
        const [key, ...valueParts] = line.split(":").map((part) => part.trim());
        const value = valueParts.join(":").trim(); // Rejoin in case the URL contains colons
        if (key && value) {
          link[key] = value.replace(/^['"]|['"]$/g, ""); // Remove quotes if present
        }
      });

      // Ensure 'url' exists before processing further
      if (!link.url) {
        console.warn("Missing required URL. Skipping this link:", link);
        return null;
      }

      // Default name to URL filename if empty
      if (!link.name) {
        const urlParts = link.url.split("/");
        link.name = urlParts[urlParts.length - 1];
      }

      // Default type to 'js' if empty
      if (!link.type) {
        link.type = "script";
      }

      // Validate type
      if (link.type !== "script" && link.type !== "style") {
        console.warn(
          `Invalid type for ${link.name}: ${link.type}. Skipping this link.`
        );
        return null;
      }

      return link;
    })
    .filter((link) => link !== null); // Remove any invalid links
}

document.addEventListener("DOMContentLoaded", () => {
  const filename = getFlemsFilename();

  fetchAndParseContent(filename)
    .then((parsed) => {
      const files = [];

      if (parsed.body) {
        files.push({
          name: "index.html",
          content: parsed.body,
        });
      }

      if (parsed.css) {
        files.push({
          name: "style.css",
          content: parsed.css,
        });
      }

      if (parsed.js) {
        files.push({
          name: "app.js",
          content: parsed.js,
        });
      }

      const flems = Flems(document.body, {
        files: files,
        links: parsed.links || [],
      });
    })
    .catch((error) => console.error("Error loading content:", error));
});
```
