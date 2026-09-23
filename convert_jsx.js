const fs = require('fs');

const html = fs.readFileSync('c:/Users/Prithvi/Desktop/hack-spire/exact_form.html', 'utf8');

// Basic HTML to JSX conversion
let jsx = html
  .replace(/class=/g, 'className=')
  .replace(/<!--(.*?)-->/g, '{/* $1 */}')
  .replace(/for=/g, 'htmlFor=')
  .replace(/novalidate/g, 'noValidate')
  .replace(/autoplay/g, 'autoPlay')
  .replace(/playsinline/g, 'playsInline')
  .replace(/style="([^"]*)"/g, (match, styleString) => {
    // Basic style to object conversion (very naive)
    const styleObj = {};
    styleString.split(';').forEach(rule => {
      const parts = rule.split(':');
      if (parts.length === 2) {
        let key = parts[0].trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
        styleObj[key] = parts[1].trim();
      }
    });
    return `style={${JSON.stringify(styleObj)}}`;
  });

// fix some unclosed tags like <input>, <img...>, <source...>
jsx = jsx.replace(/<input([^>]*?[^\/])>/g, '<input$1 />');
jsx = jsx.replace(/<img([^>]*?[^\/])>/g, '<img$1 />');
jsx = jsx.replace(/<source([^>]*?[^\/])>/g, '<source$1 />');

const output = `
import React from 'react';
import AuthLayout from './AuthLayout';
import './styles.css'; // The exact Huly styles

export default function Login() {
  return (
    <AuthLayout>
      ${jsx}
    </AuthLayout>
  );
}
`;

fs.writeFileSync('c:/Users/Prithvi/Desktop/hack-spire/auth/Login.jsx', output, 'utf8');
console.log('JSX generated');
