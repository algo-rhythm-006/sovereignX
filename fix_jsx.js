const fs = require('fs');
let code = fs.readFileSync('c:/Users/Prithvi/Desktop/hack-spire/auth/Login.jsx', 'utf8');
code = code.replace(/fdprocessedid=".*?"/g, '');
code = code.replace(/stroke-linecap/g, 'strokeLinecap');
code = code.replace(/stroke-linejoin/g, 'strokeLinejoin');
fs.writeFileSync('c:/Users/Prithvi/Desktop/hack-spire/auth/Login.jsx', code);
