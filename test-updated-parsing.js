// Test the updated Figma URL parsing
function parseFileUrl(url) {
  // Support both /file/ and /design/ patterns, with or without www
  const match = url.match(
    /(?:www\.)?figma\.com\/(?:file|design)\/([a-zA-Z0-9]+)/
  );
  return match ? match[1] : null;
}

const testUrls = [
  "https://www.figma.com/file/ABC123/Test-File",
  "https://www.figma.com/design/DEF456/Another-File",
  "https://figma.com/file/GHI789/File-Without-WWW",
  "https://figma.com/design/JKL012/Design-Without-WWW",
  "https://www.figma.com/file/MNO345/File-With-Params?node-id=1%3A2",
  "https://not-a-figma-url.com/test",
];

console.log("🧪 Testing updated Figma URL parsing:");
testUrls.forEach((url) => {
  const fileKey = parseFileUrl(url);
  console.log(`${url} → ${fileKey || "NOT FIGMA URL"}`);
});
