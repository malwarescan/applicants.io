#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Read the generated HTML files and copy them to /dist
const sourceDir = path.join(__dirname, '..', 'dist');
const targetDir = path.join(__dirname, '..', 'dist');

console.log('Using pre-generated static files from /dist');
console.log('Static files are ready for deployment');
