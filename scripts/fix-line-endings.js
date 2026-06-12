const fs = require('fs');
const content = fs.readFileSync('scripts/entrypoint.sh', 'utf8');
fs.writeFileSync('scripts/entrypoint.sh', content.replace(/\r\n/g, '\n'), { encoding: 'utf8', flag: 'w' });
console.log('Fixed line endings');
