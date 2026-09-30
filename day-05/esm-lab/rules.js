import fs from 'node:fs/promises';

console.log('--- 6.5: ESM RULES & METADATA ---');

const filePath = new URL('./data.txt', import.meta.url);
const fileContent = await fs.readFile(filePath, 'utf-8');
console.log('Top-level await read data.txt:', fileContent.trim());

// 3. الميتاداتا الحديثة في Node.js 20.11+
console.log('import.meta.dirname:', import.meta.dirname);
console.log('import.meta.filename:', import.meta.filename);
