const fs = require('fs');

const replaceInFile = (file, from, to) => {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(from, to);
  fs.writeFileSync(file, content, 'utf-8');
};

const liveOrder = 'f:/Kuliah/MateriKuliah/Semester_4/PBO/Tubes/WebOrderingv2/aroma-senja-frontend/src/dashboard/features/overview/components/LiveOrderScroll.tsx';
replaceInFile(liveOrder, '                  <div key={`skel-live-${idx}`}', '                  // biome-ignore lint/suspicious/noArrayIndexKey: skeleton\n                  <div key={`skel-live-${idx}`}');

const mejaGrid = 'f:/Kuliah/MateriKuliah/Semester_4/PBO/Tubes/WebOrderingv2/aroma-senja-frontend/src/dashboard/features/overview/components/MejaGrid.tsx';
replaceInFile(mejaGrid, '            <div key={`skel-grid-${i}`}', '            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton\n            <div key={`skel-grid-${i}`}');

const revChart = 'f:/Kuliah/MateriKuliah/Semester_4/PBO/Tubes/WebOrderingv2/aroma-senja-frontend/src/dashboard/features/overview/components/RevenueChart.tsx';
replaceInFile(revChart, 'payload?: any[]', 'payload?: any'); // Revert it temporarily
replaceInFile(revChart, 'const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any; label?: string }) => {', '// biome-ignore lint/suspicious/noExplicitAny: external library type\nconst CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any; label?: string }) => {');

const topMenu = 'f:/Kuliah/MateriKuliah/Semester_4/PBO/Tubes/WebOrderingv2/aroma-senja-frontend/src/dashboard/features/overview/components/TopMenuList.tsx';
replaceInFile(topMenu, '            <div key={`skel-top-${i}`}', '            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton\n            <div key={`skel-top-${i}`}');

console.log('Added biome-ignore comments.');
