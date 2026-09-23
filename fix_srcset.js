const fs = require('fs');
let code = fs.readFileSync('c:/Users/Prithvi/Desktop/hack-spire/auth/Login.jsx', 'utf8');
code = code.replace(/srcSet=['"].*?['"]/g, '');
fs.writeFileSync('c:/Users/Prithvi/Desktop/hack-spire/auth/Login.jsx', code);
