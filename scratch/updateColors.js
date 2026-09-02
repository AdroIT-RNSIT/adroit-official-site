const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../frontend/src');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? 
            walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir(srcDir, function(filePath) {
    if (filePath.endsWith('.jsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        
        // Backgrounds
        content = content.replace(/bg-\[\#0d1117\]/g, 'bg-slate-50');
        
        // Text
        // Replace text-white ONLY if it's not inside a button or specific element.
        // Actually, just replacing text-white with text-slate-900 might be okay for most body text.
        // A safer way is to replace `text-white` with `text-slate-900`, but let's just do it globally for now and we can fix buttons later.
        content = content.replace(/text-white/g, 'text-slate-900');
        content = content.replace(/text-gray-400/g, 'text-slate-600');
        content = content.replace(/text-gray-300/g, 'text-slate-700');
        content = content.replace(/text-gray-500/g, 'text-slate-500');
        
        // Borders and glass effects
        content = content.replace(/bg-white\/(5|10|20)/g, 'bg-slate-900/$1');
        content = content.replace(/bg-white\/\[0\.03\]/g, 'bg-slate-900/[0.03]');
        content = content.replace(/border-white\/(5|10|20)/g, 'border-slate-900/$1');
        content = content.replace(/bg-black\/(20|40|60)/g, 'bg-white/$1');
        
        // Specific gradients
        content = content.replace(/from-blue-500\/20/g, 'from-blue-500/10');
        content = content.replace(/to-cyan-900\/20/g, 'to-cyan-500/10');

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated ${filePath}`);
        }
    }
});
console.log("Done.");
