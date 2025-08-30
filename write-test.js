const fs = require('fs');

// Test if Node.js can write to a file
fs.writeFileSync('test-output.txt', 'Node.js is working and can write files!');
console.log('File written successfully');
