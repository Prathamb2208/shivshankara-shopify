# Aurelia Studios — Women's Fashion Shopify Online Store 2.0 Theme

An editorial, high-converting **Shopify Online Store 2.0 Theme** designed specifically for women's fashion, luxury tailoring, resort wear, and contemporary apparel brands.

---

## 🌟 Key Features

1. **Editorial Hero & Storytelling**:
   - Split and full-bleed hero banners with video support and dual call-to-actions.
   - Curated category department visual tiles (Dresses, Outerwear, Knitwear, Accessories).
2. **Interactive "Shop The Look" Feature**:
   - Lifestyle lookbook photography with interactive pulsating pins.
   - Clicking pins pops up product cards with instant "Add to Bag" capability.
3. **High-Converting Product Detail Page (PDP)**:
   - High-resolution editorial gallery with zoom.
   - Interactive visual color swatches & size chips.
   - **Size & Fit Guide Modal**: Responsive measurement chart with **Inches / Centimeters** toggling and international size conversions (US, UK, EU, AU).
   - Scarcity / low-stock indicator (*"Only 3 left in Size S — order soon"*).
   - Structured accordion details (Silhouette, Fabric & Artisanal Care, Free Express Delivery).
4. **Slide-Out Ajax Cart Drawer**:
   - Real-time **Free Shipping Progress Bar** (dynamically calculates remaining amount toward the $150 threshold).
   - In-drawer cross-sell / upsell recommendation (*"Complete Your Look"*).
   - Instant quantity adjustments (+ / -) and item removal without page refresh.
5. **Shopify Online Store 2.0 Architecture**:
   - 100% JSON templates (`index.json`, `product.json`, `collection.json`, `cart.json`).
   - Every section is modular and can be reordered, hidden, or customized directly in the Shopify Theme Editor.

---

## 🚀 How to Upload to Shopify Admin

You already have the pre-built, ready-to-upload archive: **`shopify-fashion-theme.zip`**.

1. Log into your **Shopify Admin** (`https://admin.shopify.com/store/YOUR-STORE-NAME`).
2. Go to **Online Store** &rarr; **Themes**.
3. Under the **Theme library** section, click **Add theme** &rarr; **Upload zip file**.
4. Choose the `shopify-fashion-theme.zip` file from this folder.
5. Click **Upload file**.
6. Once uploaded, click **Customize** to open the visual Theme Editor or **Publish** to make it your active storefront!

---

## 💻 How to Preview Locally Right Now

You can preview and interact with the complete storefront design immediately:

1. Open `preview/index.html` in your web browser (Chrome, Edge, Safari, Firefox).
2. Or run a simple local HTTP server:
   ```bash
   npx serve preview
   ```
3. Test all interactive features:
   - Click **+ Quick Add** on any product card.
   - Click the **Shopping Bag icon** to open the Slide-out Cart Drawer and test the Free Shipping Progress Bar.
   - Click **Size Chart** or **Size & Fit Guide** to test the measurement units toggle (Inches vs Centimeters).
   - Tap the numbered pins on the **Shop The Look** section.

---

## 📁 File Structure

```
shopify_ecom/
├── assets/
│   ├── base.css                     # Global reset & CSS design tokens
│   ├── theme.css                    # Fashion-specific styling & animations
│   ├── theme.js                     # Mobile menu, modals, header scroll effects
│   ├── cart-drawer.js               # Ajax Cart API & shipping progress calculation
│   └── product-swatches.js          # Dynamic variant switching & image updating
├── config/
│   ├── settings_schema.json         # Shopify Theme Customizer settings
│   └── settings_data.json           # Default color palette & typography preset
├── layout/
│   └── theme.liquid                 # Master Shopify layout
├── locales/
│   └── en.default.json              # English localized strings
├── preview/
│   └── index.html                   # Live standalone interactive storefront preview
├── sections/
│   ├── announcement-bar.liquid      # Top promotional ticker
│   ├── header.liquid                # Sticky navigation, logo & cart trigger
│   ├── hero-banner.liquid           # Split editorial banner with CTAs
│   ├── categories-grid.liquid       # Visual category tiles
│   ├── featured-collection.liquid   # Product grid with quick-add
│   ├── lookbook-shop-the-look.liquid# Interactive pins on lifestyle photos
│   ├── image-with-text.liquid       # Brand story & atelier craftsmanship
│   ├── main-product.liquid          # High-converting PDP with size guide
│   ├── main-collection.liquid       # Category grid with sorting and filters
│   ├── cart-drawer.liquid           # Slide-out cart with shipping calculator
│   ├── newsletter.liquid            # VIP email capture
│   └── footer.liquid                # Multi-column boutique footer
├── snippets/
│   ├── product-card.liquid          # Reusable card with hover swap & quick add
│   ├── price.liquid                 # Currency formatting & sale tags
│   ├── color-swatches.liquid        # Visual color dots
│   ├── size-guide-modal.liquid      # Measurement chart with Inches/CM toggle
│   └── icon-*.liquid                # Clean SVG icons
└── templates/
    ├── index.json                   # Homepage template
    ├── product.json                 # Product detail template
    ├── collection.json              # Collection template
    ├── cart.json                    # Cart template
    ├── 404.json                     # 404 template
    └── page.json                    # General page template
```
