const fs = require('fs');
const path = require('path');

const url = 'https://kjmjeoaipojzyrxshvzo.supabase.co/rest/v1';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqbWplb2FpcG9qenlyeHNodnpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5NDU2MjcsImV4cCI6MjA5NzUyMTYyN30.WAvDSC11y5J3EdH8rP1eFhdjV244DV4fKM1aWG2nd90';

const outputDir = path.join(__dirname, 'extracted_product_images');

async function downloadFile(fileUrl, destPath) {
  const dir = path.dirname(destPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 0) {
    return { status: 'skipped', path: destPath };
  }

  const res = await fetch(fileUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${fileUrl}: ${res.statusText}`);
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buffer);
  return { status: 'downloaded', path: destPath, size: buffer.length };
}

async function bulkExtractImages() {
  console.log('Fetching all products and image lists from Supabase...');
  const res = await fetch(url + '/products?select=sku,name,image_urls', {
    headers: { apikey: key, Authorization: 'Bearer ' + key }
  });
  const products = await res.json();

  const downloadQueue = [];

  for (const p of products) {
    const sku = (p.sku || 'UNKNOWN').replace(/[^a-zA-Z0-9_\-]/g, '_');
    if (Array.isArray(p.image_urls)) {
      p.image_urls.forEach((imgUrl, idx) => {
        let fullUrl = imgUrl;
        if (!imgUrl.startsWith('http')) {
          fullUrl = 'https://shivshankara-storefront.vercel.app' + (imgUrl.startsWith('/') ? imgUrl : '/' + imgUrl);
        }

        // Determine filename
        let filename = path.basename(new URL(fullUrl).pathname);
        if (!filename.includes('.')) {
          filename = `${sku}_${idx + 1}.jpg`;
        }

        const destPath = path.join(outputDir, sku, filename);
        downloadQueue.push({ fullUrl, destPath, sku, filename });
      });
    }
  }

  console.log(`Found ${downloadQueue.length} images to download into ${outputDir}...`);

  let completed = 0;
  let downloadedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  // Concurrency limit of 10
  const concurrency = 10;
  async function worker() {
    while (downloadQueue.length > 0) {
      const task = downloadQueue.shift();
      try {
        const result = await downloadFile(task.fullUrl, task.destPath);
        if (result.status === 'downloaded') downloadedCount++;
        else skippedCount++;
      } catch (err) {
        console.error(`Error downloading ${task.fullUrl}: ${err.message}`);
        errorCount++;
      }
      completed++;
      if (completed % 25 === 0 || completed === 248) {
        console.log(`Progress: ${completed} / 248 images processed...`);
      }
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);

  console.log(`\n🎉 Bulk Extraction Complete!`);
  console.log(`- Total Downloaded: ${downloadedCount}`);
  console.log(`- Already Existed: ${skippedCount}`);
  console.log(`- Errors: ${errorCount}`);
  console.log(`- Saved Location: ${outputDir}`);
}

bulkExtractImages().catch(console.error);
