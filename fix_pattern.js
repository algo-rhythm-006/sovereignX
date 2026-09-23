const fs = require('fs');
let code = fs.readFileSync('c:/Users/Prithvi/Desktop/hack-spire/auth/Login.jsx', 'utf8');
code = code.replace(/_next\/image\?url=%2F_next%2Fstatic%2Fmedia%2Fform-pattern\.270a3962\.jpg/g, 'images/form-pattern.jpg');
fs.writeFileSync('c:/Users/Prithvi/Desktop/hack-spire/auth/Login.jsx', code);
