const fs = require('fs');
const html = fs.readFileSync('c:/Users/Prithvi/Desktop/hack-spire/auth-example/open-source-all-in-one-project-management-platform/index.html', 'utf8');

const startTag = '<section class="relative flex h-screen';
let startIdx = html.indexOf(startTag);

if (startIdx !== -1) {
    const endTag = '</section>';
    const endIdx = html.indexOf(endTag, startIdx) + endTag.length;
    
    fs.writeFileSync('c:/Users/Prithvi/Desktop/hack-spire/exact_form.html', html.substring(startIdx, endIdx), 'utf8');
    console.log('Success');
} else {
    console.log('Not found');
}
