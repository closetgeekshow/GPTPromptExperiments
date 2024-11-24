"use strict";
function getFlemsFilename() {
  const urlParams = new URLSearchParams(window.location.search);
  let flemsParam = urlParams.get("flems") || "sfc"; // Use 'default' if no flems parameter

  // Decode the URL parameter
  let decodedParam = decodeURIComponent(flemsParam);

  // Add .flems extension if not already present
  if (!decodedParam.endsWith(".flems")) {
    decodedParam += ".flems";
  }

  return decodedParam;
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

function parseJavaScript(jsContent) {
  if (jsContent.includes('type="module"')) {
    console.warn("Module scripts should be placed in the ~HEAD~ section.");
    return null;
  }
  return jsContent;
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

      if (parsed.head) {
        document.head.insertAdjacentHTML('beforeend', parsed.head);
      }

      const flems = Flems(document.querySelector('#app'), {
        files: files,
        links: parsed.links || [],
      });
    })
    .catch((error) => console.error("Error loading content:", error));
});
