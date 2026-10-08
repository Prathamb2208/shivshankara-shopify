const fs = require('fs');
const path = require('path');

const url = 'https://kjmjeoaipojzyrxshvzo.supabase.co/rest/v1';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqbWplb2FpcG9qenlyeHNodnpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5NDU2MjcsImV4cCI6MjA5NzUyMTYyN30.WAvDSC11y5J3EdH8rP1eFhdjV244DV4fKM1aWG2nd90';

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

function escapeCsv(val) {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

async function generateShopifyCsv() {
  console.log('Fetching products, variants, and categories from Supabase...');
  
  const [pRes, vRes, cRes] = await Promise.all([
    fetch(url + '/products?select=*&order=created_at.desc', { headers: { apikey: key, Authorization: 'Bearer ' + key } }),
    fetch(url + '/product_variants?select=*', { headers: { apikey: key, Authorization: 'Bearer ' + key } }),
    fetch(url + '/categories?select=*', { headers: { apikey: key, Authorization: 'Bearer ' + key } })
  ]);

  const products = await pRes.json();
  const variants = await vRes.json();
  const categories = await cRes.json();

  console.log(`Fetched ${products.length} products, ${variants.length} variants, ${categories.length} categories.`);

  const catMap = {};
  categories.forEach(c => { catMap[c.id] = c.name; });

  const variantsByProduct = {};
  variants.forEach(v => {
    if (!variantsByProduct[v.product_id]) {
      variantsByProduct[v.product_id] = [];
    }
    variantsByProduct[v.product_id].push(v);
  });

  const headers = [
    'Handle',
    'Title',
    'Body (HTML)',
    'Vendor',
    'Product Category',
    'Type',
    'Tags',
    'Published',
    'Option1 Name',
    'Option1 Value',
    'Option2 Name',
    'Option2 Value',
    'Option3 Name',
    'Option3 Value',
    'Variant SKU',
    'Variant Grams',
    'Variant Inventory Tracker',
    'Variant Inventory Qty',
    'Variant Inventory Policy',
    'Variant Fulfillment Service',
    'Variant Price',
    'Variant Compare At Price',
    'Variant Requires Shipping',
    'Variant Taxable',
    'Variant Barcode',
    'Image Src',
    'Image Position',
    'Image Alt Text',
    'Gift Card',
    'SEO Title',
    'SEO Description',
    'Status'
  ];

  const rows = [];
  rows.push(headers.map(escapeCsv).join(','));

  let totalImagesCount = 0;

  for (const prod of products) {
    const handle = slugify(prod.name + '-' + (prod.sku || ''));
    const categoryName = catMap[prod.category_id] || 'Ethnic Wear';
    const tags = [
      'Jaipur Hand Block Print',
      prod.material || '100% Cotton',
      prod.pattern || 'Block Print',
      prod.occasion || 'Everyday Chic',
      categoryName,
      prod.is_new ? 'New In' : '',
      'ShivShankara'
    ].filter(Boolean).join(', ');

    const bodyHtml = `
      <p>${prod.description || ''}</p>
      <ul>
        <li><strong>Fabric / Material:</strong> ${prod.material || '100% Pure Organic Cotton'}</li>
        <li><strong>Artisan Craft:</strong> ${prod.pattern || 'Jaipur Hand Block Print'}</li>
        <li><strong>Occasion:</strong> ${prod.occasion || 'Festive / Casual'}</li>
        <li><strong>Care Instructions:</strong> Gentle hand wash separately in cold water with mild liquid detergent. Line dry in shade.</li>
        <li><strong>Provenance:</strong> Handcrafted in Jaipur, Rajasthan, India</li>
      </ul>
    `.trim().replace(/\s+/g, ' ');

    const prodVariants = variantsByProduct[prod.id] || [];
    const images = Array.isArray(prod.image_urls) ? prod.image_urls : [];
    totalImagesCount += images.length;

    // A Shopify product has multiple rows: each variant on a row, and each image on a row
    const rowCount = Math.max(prodVariants.length, images.length, 1);

    for (let i = 0; i < rowCount; i++) {
      const v = prodVariants[i];
      const img = images[i];
      const isFirst = (i === 0);

      const row = [
        handle,                                                  // Handle
        isFirst ? prod.name : '',                                // Title
        isFirst ? bodyHtml : '',                                 // Body (HTML)
        isFirst ? 'ShivShankara Clothing' : '',                  // Vendor
        isFirst ? 'Apparel & Accessories > Clothing' : '',       // Product Category
        isFirst ? categoryName : '',                             // Type
        isFirst ? tags : '',                                     // Tags
        isFirst ? 'TRUE' : '',                                   // Published
        v ? 'Size' : (isFirst ? 'Title' : ''),                   // Option1 Name
        v ? v.size_token : (isFirst ? 'Default Title' : ''),     // Option1 Value
        '',                                                      // Option2 Name
        '',                                                      // Option2 Value
        '',                                                      // Option3 Name
        '',                                                      // Option3 Value
        v ? `${prod.sku || 'SKU'}-${v.size_token}` : (isFirst ? prod.sku : ''), // Variant SKU
        '400',                                                   // Variant Grams
        'shopify',                                               // Variant Inventory Tracker
        v ? (v.stock || 10) : (isFirst ? 10 : ''),               // Variant Inventory Qty
        'deny',                                                  // Variant Inventory Policy
        'manual',                                                // Variant Fulfillment Service
        v ? prod.sp : (isFirst ? prod.sp : ''),                  // Variant Price
        v ? (prod.msrp || '') : (isFirst ? (prod.msrp || '') : ''), // Variant Compare At Price
        'TRUE',                                                  // Variant Requires Shipping
        'TRUE',                                                  // Variant Taxable
        '',                                                      // Variant Barcode
        img || '',                                               // Image Src
        img ? (i + 1) : '',                                      // Image Position
        img ? `${prod.name} - View ${i + 1}` : '',               // Image Alt Text
        isFirst ? 'FALSE' : '',                                  // Gift Card
        isFirst ? `${prod.name} | ShivShankara Clothing` : '',   // SEO Title
        isFirst ? (prod.description || '') : '',                 // SEO Description
        isFirst ? 'active' : ''                                  // Status
      ];

      rows.push(row.map(escapeCsv).join(','));
    }
  }

  const csvContent = rows.join('\n');
  const targetPath = path.join(__dirname, 'shopify_products_import.csv');
  fs.writeFileSync(targetPath, csvContent, 'utf8');

  console.log(`\nSUCCESS! Created: ${targetPath}`);
  console.log(`Total Products: ${products.length}`);
  console.log(`Total Variants: ${variants.length}`);
  console.log(`Total Product Images: ${totalImagesCount}`);
  console.log(`CSV Row Count: ${rows.length - 1}`);
}

generateShopifyCsv().catch(console.error);
