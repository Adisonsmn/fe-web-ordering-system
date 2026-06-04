const fs = require('fs');
const path = require('path');

const dir = 'f:/Kuliah/MateriKuliah/Semester_4/PBO/Tubes/WebOrderingv2/aroma-senja-frontend/src/dashboard/features/menu-management';

const files = [
  'MenuManagementPage.tsx',
  'components/MenuStatsBar.tsx',
  'components/MenuGrid.tsx',
  'components/MenuCard.tsx'
];

files.forEach(f => {
  const filePath = path.join(dir, f);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Replacements
  content = content.replace(/bg-\[#ff5722\]/g, 'bg-deep-orange');
  content = content.replace(/text-\[#ff5722\]/g, 'text-deep-orange');
  
  content = content.replace(/border-\[#e4beb4\]/g, 'border-deep-orange/20');
  content = content.replace(/border-\[#e4beb4\]/g, 'border-deep-orange/20'); // just in case
  
  content = content.replace(/text-\[#5b4039\]/g, 'text-slate-dark');
  content = content.replace(/bg-\[#5b4039\]/g, 'bg-slate-dark');
  
  content = content.replace(/text-\[#1a1c1c\]/g, 'text-slate-dark');
  
  content = content.replace(/text-\[#76abae\]/g, 'text-teal-muted');
  content = content.replace(/bg-\[#76abae\]/g, 'bg-teal-muted');
  
  content = content.replace(/text-\[#ba1a1a\]/g, 'text-red-600');
  content = content.replace(/bg-\[#ba1a1a\]/g, 'bg-red-600');
  
  content = content.replace(/hover:bg-\[#e64a19\]/g, 'hover:bg-deep-orange/90');

  fs.writeFileSync(filePath, content, 'utf-8');
});

console.log('Replaced colors successfully.');
