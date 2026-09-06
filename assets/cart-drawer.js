/**
 * AURELIA STUDIOS - Slide-Out Cart Drawer & Ajax Cart API
 */

class CartDrawerManager {
  constructor() {
    this.drawer = document.getElementById('CartDrawer');
    this.cartCountElements = document.querySelectorAll('#CartCount');
    this.cartItemsContainer = document.getElementById('CartDrawerItems');
    this.subtotalElement = document.getElementById('CartDrawerSubtotal');
    this.shippingRemainingElement = document.getElementById('ShippingRemaining');
    this.shippingProgressBar = document.getElementById('ShippingProgressBar');
    this.shippingMessageElement = document.getElementById('ShippingBarMessage');
    this.freeShippingThreshold = (window.themeSettings && window.themeSettings.freeShippingThreshold) || 15000; // in cents ($150.00)

    this.init();
  }

  init() {
    if (!this.drawer) return;

    // Triggers to open drawer
    const openTriggers = document.querySelectorAll('#CartDrawerTrigger, [data-cart-drawer-open]');
    openTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    });

    // Close button
    const closeBtn = document.getElementById('CartDrawerClose');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    // Click outside to close
    this.drawer.addEventListener('click', (e) => {
      if (e.target === this.drawer) this.close();
    });

    // ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) this.close();
    });

    // Listen for Ajax Add to Cart from Product Forms
    this.bindProductForms();

    // Listen for Quick Add buttons
    this.bindQuickAdd();

    // Line item quantity buttons inside drawer
    this.bindDrawerActions();
  }

  isOpen() {
    return this.drawer.classList.contains('is-open');
  }

  open() {
    this.drawer.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.drawer.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  bindProductForms() {
    const productForms = document.querySelectorAll('form[action*="/cart/add"]');
    productForms.forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const origText = submitBtn ? submitBtn.innerText : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerText = 'Adding...';
        }

        try {
          const formData = new FormData(form);
          const response = await fetch('/cart/add.js', {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
          });

          if (response.ok) {
            await this.refreshCart();
            this.open();
          } else {
            const err = await response.json();
            alert(err.description || 'Could not add to bag.');
          }
        } catch (error) {
          console.warn('Shopify Cart Add:', error);
          // Fallback in case testing outside live Shopify
          this.open();
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = origText;
          }
        }
      });
    });
  }

  bindQuickAdd() {
    document.addEventListener('click', async (e) => {
      const quickAddBtn = e.target.closest('.btn-quick-add, .size-pill');
      if (!quickAddBtn || !quickAddBtn.dataset.variantId) return;

      e.preventDefault();
      const variantId = quickAddBtn.dataset.variantId;
      const originalText = quickAddBtn.innerText;
      quickAddBtn.innerText = '...';

      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ id: variantId, quantity: 1 })
        });

        if (response.ok) {
          await this.refreshCart();
          this.open();
        }
      } catch (err) {
        console.warn('Quick Add:', err);
        this.open();
      } finally {
        quickAddBtn.innerText = originalText;
      }
    });
  }

  bindDrawerActions() {
    if (!this.cartItemsContainer) return;

    this.cartItemsContainer.addEventListener('click', async (e) => {
      // Plus / Minus
      const qtyBtn = e.target.closest('.btn-qty-plus, .btn-qty-minus');
      if (qtyBtn) {
        const key = qtyBtn.dataset.key;
        const newQty = parseInt(qtyBtn.dataset.qty, 10);
        await this.updateItemQuantity(key, newQty);
        return;
      }

      // Remove
      const removeBtn = e.target.closest('.btn-cart-remove');
      if (removeBtn) {
        const key = removeBtn.dataset.key;
        await this.updateItemQuantity(key, 0);
      }
    });
  }

  async updateItemQuantity(key, quantity) {
    try {
      const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ id: key, quantity: quantity })
      });

      if (response.ok) {
        await this.refreshCart();
      }
    } catch (err) {
      console.warn('Update quantity error:', err);
    }
  }

  async refreshCart() {
    try {
      const response = await fetch('/cart.js');
      const cart = await response.json();
      this.updateUI(cart);
    } catch (err) {
      console.warn('Refresh cart:', err);
    }
  }

  updateUI(cart) {
    // Update Badge Counts
    this.cartCountElements.forEach(el => {
      el.textContent = cart.item_count;
    });

    const drawerCount = document.getElementById('CartDrawerItemCount');
    if (drawerCount) drawerCount.textContent = `(${cart.item_count} items)`;

    // Update Subtotal
    if (this.subtotalElement) {
      this.subtotalElement.textContent = `$${(cart.total_price / 100).toFixed(2)}`;
    }

    // Update Shipping Progress
    this.updateShippingProgress(cart.total_price);
  }

  updateShippingProgress(totalPriceCents) {
    if (!this.shippingProgressBar || !this.shippingMessageElement) return;

    const remaining = this.freeShippingThreshold - totalPriceCents;
    const percentage = Math.min(100, Math.max(0, (totalPriceCents / this.freeShippingThreshold) * 100));

    this.shippingProgressBar.style.width = `${percentage}%`;

    if (remaining <= 0) {
      this.shippingMessageElement.innerHTML = `&check; You've unlocked <strong class="text-green-700">Complimentary Worldwide Shipping</strong>!`;
      this.shippingProgressBar.style.backgroundColor = '#166534';
    } else {
      const formattedRemaining = `$${(remaining / 100).toFixed(2)}`;
      this.shippingMessageElement.innerHTML = `Add <span class="font-bold text-[var(--color-accent)]">${formattedRemaining}</span> more for <strong>Free Worldwide Shipping</strong>`;
      this.shippingProgressBar.style.backgroundColor = 'var(--color-btn-bg, #171513)';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.cartDrawerManager = new CartDrawerManager();
});
