/**
 * AURELIA STUDIOS - Core Theme JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initSizeGuideModal();
  initStickyHeader();
});

// Mobile Navigation
function initMobileNav() {
  const toggleBtn = document.getElementById('MobileNavToggle');
  const drawer = document.getElementById('MobileNavDrawer');
  const closeBtn = document.getElementById('MobileNavClose');

  if (!toggleBtn || !drawer) return;

  const openNav = () => {
    drawer.classList.remove('opacity-0', 'pointer-events-none');
    drawer.querySelector('.mobile-nav-content').classList.remove('-translate-x-full');
    document.body.style.overflow = 'hidden';
  };

  const closeNav = () => {
    drawer.classList.add('opacity-0', 'pointer-events-none');
    drawer.querySelector('.mobile-nav-content').classList.add('-translate-x-full');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openNav);
  if (closeBtn) closeBtn.addEventListener('click', closeNav);

  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) closeNav();
  });
}

// Size Guide Modal & Unit Switcher
function initSizeGuideModal() {
  const modal = document.getElementById('SizeGuideModal');
  if (!modal) return;

  const openTriggers = document.querySelectorAll('[data-modal-open="SizeGuideModal"], [data-modal-open]');
  const closeTriggers = modal.querySelectorAll('[data-modal-close]');

  openTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  closeTriggers.forEach(btn => btn.addEventListener('click', closeModal));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  // Unit toggling (Inches vs CM)
  const unitButtons = modal.querySelectorAll('.unit-btn');
  const inchesTable = document.getElementById('size-table-inches');
  const cmTable = document.getElementById('size-table-cm');

  unitButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      unitButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const unit = btn.getAttribute('data-unit');
      if (unit === 'inches') {
        if (inchesTable) inchesTable.classList.remove('visually-hidden');
        if (cmTable) cmTable.classList.add('visually-hidden');
      } else {
        if (inchesTable) inchesTable.classList.add('visually-hidden');
        if (cmTable) cmTable.classList.remove('visually-hidden');
      }
    });
  });
}

// Sticky Header scroll elevation
function initStickyHeader() {
  const header = document.getElementById('SiteHeader');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('shadow-sm', 'bg-white/95');
    } else {
      header.classList.remove('shadow-sm', 'bg-white/95');
    }
  }, { passive: true });
}
