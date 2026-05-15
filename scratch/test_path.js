const fs = require('fs');
const path = require('path');

const frontendPath = path.join(__dirname, '../../../game_web_app1/src/app');
console.log('Testing path:', frontendPath);
console.log('Exists:', fs.existsSync(frontendPath));

if (fs.existsSync(frontendPath)) {
  const files = fs.readdirSync(frontendPath);
  console.log('Files:', files);
}
