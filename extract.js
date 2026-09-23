const fs = require('fs');
const html = fs.readFileSync('c:/Users/Prithvi/Desktop/hack-spire/auth-example/open-source-all-in-one-project-management-platform/index.html', 'utf8');
const index = html.indexOf('Sign in to Huly');
if (index !== -1) {
    const start = Math.max(0, index - 2000);
    const end = Math.min(html.length, index + 3000);
    console.log(html.substring(start, end));
} else {
    console.log("Not found");
}
