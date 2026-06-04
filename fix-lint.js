const fs = require('fs');

const replaceInFile = (file, from, to) => {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(from, to);
  fs.writeFileSync(file, content, 'utf-8');
};

const replaceAllInFile = (file, from, to) => {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replaceAll(from, to);
  fs.writeFileSync(file, content, 'utf-8');
};

// 1. MenuCard.tsx
const menuCard = 'f:/Kuliah/MateriKuliah/Semester_4/PBO/Tubes/WebOrderingv2/aroma-senja-frontend/src/dashboard/features/menu-management/components/MenuCard.tsx';
replaceInFile(menuCard, '      <div\n        onClick={() => {', '      <button\n        type="button"\n        onClick={() => {');
replaceInFile(menuCard, '      role="button"\n      tabIndex={0}\n      className={cn(', '      className={cn(');
replaceInFile(menuCard, '      </p>\n    </div>', '      </p>\n    </button>');

let menuCardContent = fs.readFileSync(menuCard, 'utf-8');
menuCardContent = menuCardContent.replace(
  '<div\n            className="relative shrink-0"\n            onClick={(e) => e.stopPropagation()}\n            onKeyDown={(e) => e.stopPropagation()}\n            role="presentation"\n          >',
  '<div\n            className="relative shrink-0"\n          >'
);
fs.writeFileSync(menuCard, menuCardContent, 'utf-8');

// 2. LiveOrderScroll.tsx
const liveOrder = 'f:/Kuliah/MateriKuliah/Semester_4/PBO/Tubes/WebOrderingv2/aroma-senja-frontend/src/dashboard/features/overview/components/LiveOrderScroll.tsx';
replaceInFile(liveOrder, 'key={idx}', 'key={`skel-live-${idx}`}');

// 3. MejaGrid.tsx
const mejaGrid = 'f:/Kuliah/MateriKuliah/Semester_4/PBO/Tubes/WebOrderingv2/aroma-senja-frontend/src/dashboard/features/overview/components/MejaGrid.tsx';
replaceInFile(mejaGrid, 'key={i}', 'key={`skel-grid-${i}`}');

// 4. RevenueChart.tsx
const revChart = 'f:/Kuliah/MateriKuliah/Semester_4/PBO/Tubes/WebOrderingv2/aroma-senja-frontend/src/dashboard/features/overview/components/RevenueChart.tsx';
replaceInFile(revChart, '({ active, payload, label }: any)', '({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string })');

// 5. TopMenuList.tsx
const topMenu = 'f:/Kuliah/MateriKuliah/Semester_4/PBO/Tubes/WebOrderingv2/aroma-senja-frontend/src/dashboard/features/overview/components/TopMenuList.tsx';
replaceInFile(topMenu, 'key={i}', 'key={`skel-top-${i}`}');

// 6. PesananManagementPage.tsx
const pesananPage = 'f:/Kuliah/MateriKuliah/Semester_4/PBO/Tubes/WebOrderingv2/aroma-senja-frontend/src/dashboard/features/pesanan-management/PesananManagementPage.tsx';
replaceAllInFile(pesananPage, '<button\n              onClick=', '<button\n              type="button"\n              onClick=');

// 7. EstimasiModal.tsx
const estModal = 'f:/Kuliah/MateriKuliah/Semester_4/PBO/Tubes/WebOrderingv2/aroma-senja-frontend/src/dashboard/features/pesanan-management/components/EstimasiModal.tsx';
replaceAllInFile(estModal, '<button\n                key={time}', '<button\n                type="button"\n                key={time}');

console.log('Fixed lint issues.');
