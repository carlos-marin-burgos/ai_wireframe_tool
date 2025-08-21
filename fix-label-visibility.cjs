const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "backend/generateWireframe/index.js");

// Read the file
let content = fs.readFileSync(filePath, "utf8");

// Replace all instances of the old opacity-based styling with better contrast
content = content.replace(
  /color: #605e5c; margin: 0; opacity: 0\.8;/g,
  "color: #323130; margin: 0; background: rgba(255,255,255,0.9); padding: 3px 6px; border-radius: 3px; display: inline-block;"
);

content = content.replace(
  /color: #8a8886; margin: ([^;]+); opacity: 0\.6;/g,
  "color: #484644; margin: $1; background: rgba(255,255,255,0.8); padding: 2px 5px; border-radius: 2px; display: inline-block;"
);

// Write the file back
fs.writeFileSync(filePath, content, "utf8");

console.log("✅ Fixed label visibility in generateWireframe/index.js");
console.log("Changes made:");
console.log("- Replaced light gray colors with darker, more visible colors");
console.log("- Added semi-transparent white backgrounds for better contrast");
console.log(
  "- Removed opacity and added padding/border-radius for better appearance"
);
