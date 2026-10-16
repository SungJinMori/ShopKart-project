const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sections = [
  {
    category: 'Backend Architecture',
    description: 'Server entry point, configurations, database models, controllers, routes, and middlewares.',
    files: [
      { path: 'backend/index.js', title: 'Main Server Entry (Express & MongoDB Connection)' },
      { path: 'backend/config/razorpay.js', title: 'Razorpay Client Configuration' },
      { path: 'backend/models/customer.model.js', title: 'Customer Model (Auth, Wishlist & Cart Schema References)' },
      { path: 'backend/models/product.model.js', title: 'Product Model' },
      { path: 'backend/models/order.model.js', title: 'Order Model (Historical Snapshot, Address & Payment Info)' },
      { path: 'backend/controllers/customer.controller.js', title: 'Customer Controller (Register, Login, Profile, Password)' },
      { path: 'backend/controllers/product.controller.js', title: 'Product Controller (Catalog, Filter, Search)' },
      { path: 'backend/controllers/wishlist.controller.js', title: 'Wishlist Controller (Add, Get, Populate, Remove, Toggle)' },
      { path: 'backend/controllers/cart.controller.js', title: 'Cart Controller (Add, Get, Update Qty, Stock Validation, Remove)' },
      { path: 'backend/controllers/order.controller.js', title: 'Order Controller (Create Payment Order, Verify HMAC Signature, History & Status)' },
      { path: 'backend/routes/customer.routes.js', title: 'Customer Routes' },
      { path: 'backend/routes/product.routes.js', title: 'Product Routes' },
      { path: 'backend/routes/wishlist.routes.js', title: 'Wishlist Routes (Protected Endpoints)' },
      { path: 'backend/routes/cart.routes.js', title: 'Cart Routes (Protected Endpoints)' },
      { path: 'backend/routes/order.routes.js', title: 'Order Routes (Protected Endpoints)' },
      { path: 'backend/middlewares/auth.middleware.js', title: 'Authentication Middleware (JWT Verification)' },
      { path: 'backend/utils/generateToken.js', title: 'JWT Token Generator Utility' }
    ]
  },
  {
    category: 'Frontend - State Management & Services',
    description: 'Global Cart Context, Axios API client, main routing, and global styling.',
    files: [
      { path: 'frontend/src/main.jsx', title: 'React Entry Point' },
      { path: 'frontend/src/App.jsx', title: 'App Component (Routing & Context Setup)' },
      { path: 'frontend/src/context/CartContext.jsx', title: 'CartContext (Global Cart State, Sync & Derived Calculations)' },
      { path: 'frontend/src/services/api.js', title: 'API Client Service (Axios with withCredentials)' },
      { path: 'frontend/src/index.css', title: 'Tailwind CSS Stylesheet' }
    ]
  },
  {
    category: 'Frontend - Pages',
    description: 'User-facing views for authentication, browsing, wishlist, cart, checkout, and orders.',
    files: [
      { path: 'frontend/src/pages/Register.jsx', title: 'Register Page' },
      { path: 'frontend/src/pages/Login.jsx', title: 'Login Page' },
      { path: 'frontend/src/pages/Home.jsx', title: 'Home / Profile Page' },
      { path: 'frontend/src/pages/Products.jsx', title: 'Product Catalog Page (Search, Filter, Wishlist & Cart Actions)' },
      { path: 'frontend/src/pages/ProductDetails.jsx', title: 'Product Details Page (Full Specs, Add to Cart & Wishlist)' },
      { path: 'frontend/src/pages/Wishlist.jsx', title: 'Wishlist Page (Loading, Empty, Error & Dynamic Cards)' },
      { path: 'frontend/src/pages/Cart.jsx', title: 'Cart Page (Order Summary, Subtotal, Loading, Empty & Error States)' },
      { path: 'frontend/src/pages/Checkout.jsx', title: 'Checkout Page (Shipping Form Validation & Razorpay Modal)' },
      { path: 'frontend/src/pages/Orders.jsx', title: 'My Orders Page (Order History & Status Badges)' },
      { path: 'frontend/src/pages/OrderDetails.jsx', title: 'Order Confirmation & Details Page (Status Progression Bonus)' }
    ]
  },
  {
    category: 'Frontend - UI Components',
    description: 'Reusable UI elements for navigation, cards, controls, and filtering.',
    files: [
      { path: 'frontend/src/components/Navbar.jsx', title: 'Navigation Bar (With Live Wishlist & Cart Badge Counts & Orders)' },
      { path: 'frontend/src/components/ProductCard.jsx', title: 'Product Card Component (Heart Icon + Add to Cart)' },
      { path: 'frontend/src/components/WishlistCard.jsx', title: 'Wishlist Card Component (View Details + Remove)' },
      { path: 'frontend/src/components/CartItem.jsx', title: 'Cart Item Component ([-] Qty [+] Controls, Subtotal & Remove)' },
      { path: 'frontend/src/components/SearchBar.jsx', title: 'Search Bar & Category Filter Component' }
    ]
  }
];

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

let html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>ShopKart Complete Codebase Documentation</title>
<style>
  @page {
    size: A4;
    margin: 18mm 14mm 18mm 14mm;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: #1e293b;
    line-height: 1.5;
    background: #ffffff;
    margin: 0;
    padding: 0;
    font-size: 11pt;
  }
  .page-break {
    page-break-after: always;
    break-after: page;
  }
  .cover {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 85vh;
    text-align: center;
    padding: 40px 20px;
  }
  .cover h1 {
    font-size: 32pt;
    color: #4f46e5;
    margin-bottom: 10px;
    letter-spacing: -0.5px;
  }
  .cover h2 {
    font-size: 18pt;
    color: #475569;
    font-weight: 500;
    margin-top: 0;
    margin-bottom: 30px;
  }
  .badge-grid {
    display: inline-flex;
    gap: 10px;
    margin-bottom: 40px;
  }
  .badge {
    background: #e0e7ff;
    color: #3730a3;
    padding: 6px 14px;
    border-radius: 9999px;
    font-weight: 600;
    font-size: 9pt;
  }
  .meta-box {
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    background: #f8fafc;
    padding: 24px 36px;
    text-align: left;
    max-width: 480px;
    width: 100%;
    margin-top: 20px;
  }
  .meta-box p {
    margin: 8px 0;
    font-size: 10.5pt;
    color: #334155;
  }
  .meta-box strong {
    color: #0f172a;
    display: inline-block;
    width: 130px;
  }
  .toc {
    padding: 20px 0;
  }
  .toc h2 {
    font-size: 20pt;
    color: #1e293b;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 8px;
    margin-bottom: 20px;
  }
  .toc-category {
    margin-bottom: 24px;
  }
  .toc-category h3 {
    font-size: 13pt;
    color: #4f46e5;
    margin-bottom: 8px;
  }
  .toc-list {
    list-style: none;
    padding-left: 0;
    margin: 0;
  }
  .toc-list li {
    padding: 4px 0;
    border-bottom: 1px dotted #cbd5e1;
    display: flex;
    justify-content: space-between;
    font-size: 10pt;
  }
  .toc-list a {
    text-decoration: none;
    color: #334155;
  }
  .category-header {
    background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);
    color: white;
    padding: 28px 24px;
    border-radius: 10px;
    margin-bottom: 25px;
  }
  .category-header h2 {
    margin: 0 0 8px 0;
    font-size: 20pt;
    letter-spacing: -0.5px;
  }
  .category-header p {
    margin: 0;
    opacity: 0.9;
    font-size: 11pt;
  }
  .file-container {
    margin-bottom: 30px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  .file-header {
    background: #f1f5f9;
    padding: 10px 16px;
    border-top-left-radius: 7px;
    border-top-right-radius: 7px;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .file-title {
    font-size: 11pt;
    font-weight: 700;
    color: #1e293b;
  }
  .file-path {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 9pt;
    color: #4f46e5;
    background: #e0e7ff;
    padding: 2px 8px;
    border-radius: 4px;
  }
  pre {
    margin: 0;
    padding: 14px 16px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 8.5pt;
    line-height: 1.45;
    color: #0f172a;
    background: #fafafa;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-all;
  }
</style>
</head>
<body>

<div class="cover">
  <h1>🛒 ShopKart Full-Stack Project</h1>
  <h2>Labs 01 – 04 Complete Codebase & Architecture</h2>
  <div class="badge-grid">
    <span class="badge">React 18</span>
    <span class="badge">Vite</span>
    <span class="badge">TailwindCSS</span>
    <span class="badge">Node.js + Express</span>
    <span class="badge">MongoDB + Mongoose</span>
    <span class="badge">JWT Auth</span>
  </div>
  <div class="meta-box">
    <p><strong>Application:</strong> ShopKart E-Commerce</p>
    <p><strong>Primary Modules:</strong> Auth, Catalog, Wishlist (Labs 1–4)</p>
    <p><strong>Architecture:</strong> REST API + Single Page Application</p>
    <p><strong>Database:</strong> MongoDB with Object Reference & Populate</p>
    <p><strong>Generated on:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
  </div>
</div>

<div class="page-break"></div>

<div class="toc">
  <h2>Table of Contents</h2>
`;

sections.forEach((sec, sIdx) => {
  html += `  <div class="toc-category">\n`;
  html += `    <h3>${sIdx + 1}. ${escapeHtml(sec.category)}</h3>\n`;
  html += `    <ul class="toc-list">\n`;
  sec.files.forEach(f => {
    html += `      <li><span>${escapeHtml(f.title)}</span> <code>${escapeHtml(f.path)}</code></li>\n`;
  });
  html += `    </ul>\n  </div>\n`;
});

html += `</div>\n<div class="page-break"></div>\n`;

sections.forEach((sec, sIdx) => {
  html += `
<div class="category-header">
  <h2>Category ${sIdx + 1}: ${escapeHtml(sec.category)}</h2>
  <p>${escapeHtml(sec.description)}</p>
</div>
`;

  sec.files.forEach(f => {
    const fullPath = path.join(process.cwd(), f.path);
    if (fs.existsSync(fullPath)) {
      const code = fs.readFileSync(fullPath, 'utf8');
      html += `
<div class="file-container">
  <div class="file-header">
    <span class="file-title">${escapeHtml(f.title)}</span>
    <span class="file-path">${escapeHtml(f.path)}</span>
  </div>
  <pre>${escapeHtml(code)}</pre>
</div>
`;
    }
  });

  html += `<div class="page-break"></div>\n`;
});

html += `
</body>
</html>
`;

const htmlPath = path.join(process.cwd(), 'ShopKart_Codebase.html');
const pdfPath = path.join(process.cwd(), 'ShopKart_Complete_Codebase.pdf');

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('HTML documentation written to:', htmlPath);

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
if (fs.existsSync(edgePath)) {
  console.log('Converting HTML to PDF using headless Edge...');
  try {
    execSync(`"${edgePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${pdfPath}" "${htmlPath}"`, { stdio: 'inherit' });
    console.log('PDF successfully generated:', pdfPath);
  } catch (err) {
    console.error('Edge PDF generation failed:', err.message);
  }
} else {
  console.log('Edge executable not found at specified path.');
}

