/**
 * AURELIA STUDIOS - Dynamic Product Swatches & Variant Selection
 */

document.addEventListener('DOMContentLoaded', () => {
  initProductSwatches();
});

function initProductSwatches() {
  // Listen for swatch clicks across cards and PDP
  document.addEventListener('change', (e) => {
    if (!e.target.classList.contains('swatch-input')) return;

    const input = e.target;
    const colorName = input.value;
    const parentContainer = input.closest('.product-option-block, .product-card__content');

    // Update PDP Color Label if available
    const labelEl = document.getElementById('SelectedColorLabel');
    if (labelEl && input.closest('.main-product-section')) {
      labelEl.textContent = colorName;
    }

    // If on PDP, optionally update active gallery image if match exists
    const gallery = document.getElementById('ProductGallery');
    if (gallery && input.closest('.main-product-section')) {
      const match = gallery.querySelector(`img[alt*="${colorName.toLowerCase()}"]`);
      if (match) {
        match.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  });

  // Size pill selection on PDP
  document.addEventListener('change', (e) => {
    if (!e.target.classList.contains('size-input')) return;

    const sizeName = e.target.value;
    const sizeLabel = document.getElementById('SelectedSizeLabel');
    if (sizeLabel) {
      sizeLabel.textContent = sizeName;
    }
  });
}
