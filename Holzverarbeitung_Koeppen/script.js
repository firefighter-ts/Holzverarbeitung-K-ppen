(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (menuButton && nav) {
    const closeMenu = () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Menü öffnen');
      document.body.classList.remove('menu-open');
    };
    menuButton.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
      document.body.classList.toggle('menu-open', open);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');
  if (!reducedMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  const topButton = document.querySelector('.back-to-top');
  if (topButton) {
    const updateTopButton = () => topButton.classList.toggle('show', window.scrollY > 650);
    window.addEventListener('scroll', updateTopButton, { passive: true });
    updateTopButton();
    topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }));
  }

  const lightbox = document.querySelector('.lightbox');
  const lightboxImage = lightbox?.querySelector('img');
  const closeButton = lightbox?.querySelector('.lightbox-close');
  const galleryButtons = document.querySelectorAll('[data-gallery] .gallery-item');
  let lastFocused = null;
  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.hidden = true;
    lightboxImage.src = '';
    document.body.style.overflow = '';
    lastFocused?.focus();
  };
  galleryButtons.forEach(button => button.addEventListener('click', () => {
    if (!lightbox || !lightboxImage) return;
    lastFocused = button;
    lightboxImage.src = button.dataset.full;
    lightboxImage.alt = button.querySelector('img')?.alt || 'Galeriebild';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    closeButton?.focus();
  }));
  closeButton?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && lightbox && !lightbox.hidden) closeLightbox(); });

  // Holzarten: Beispielansicht öffnen
  const woodModal = document.querySelector('.wood-modal');
  const woodModalImage = woodModal?.querySelector('.wood-modal-image');
  const woodModalTitle = woodModal?.querySelector('#wood-modal-title');
  const woodSource = woodModal?.querySelector('.wood-source');
  const woodClose = woodModal?.querySelector('.wood-modal-close');
  let woodLastFocused = null;
  const closeWoodModal = () => {
    if (!woodModal) return;
    woodModal.hidden = true;
    document.body.style.overflow = '';
    woodLastFocused?.focus();
  };
  document.querySelectorAll('[data-wood]').forEach(button => button.addEventListener('click', () => {
    if (!woodModal || !woodModalImage || !woodModalTitle) return;
    woodLastFocused = button;
    woodModalTitle.textContent = button.dataset.wood;
    woodModalImage.src = button.dataset.image;
    woodModalImage.alt = `Beispielansicht für ${button.dataset.wood}`;
    if (woodSource) woodSource.href = button.dataset.source || '#';
    woodModal.hidden = false;
    document.body.style.overflow = 'hidden';
    woodClose?.focus();
  }));
  woodClose?.addEventListener('click', closeWoodModal);
  woodModal?.addEventListener('click', event => { if (event.target === woodModal) closeWoodModal(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && woodModal && !woodModal.hidden) closeWoodModal(); });

})();

// Cookie-/Datenschutzhinweis: speichert nur die Bestätigung lokal im Browser.
(() => {
  const key = 'koeppen-cookie-consent-v1';
  let accepted = false;
  try { accepted = localStorage.getItem(key) === 'accepted'; } catch (_) {}
  if (accepted) return;
  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Cookie-Hinweis');
  banner.innerHTML = '<div class="cookie-inner"><p class="cookie-copy"><strong>Cookie-Hinweis</strong>Diese Website verwendet keine Analyse- oder Marketing-Cookies. Wir speichern nur deine Bestätigung dieses Hinweises lokal im Browser. Mehr dazu in der <a href="datenschutz.html">Datenschutzerklärung</a>.</p><div class="cookie-actions"><button class="button" type="button" data-cookie-accept>Akzeptieren</button></div></div>';
  document.body.appendChild(banner);
  banner.querySelector('[data-cookie-accept]').addEventListener('click', () => {
    try { localStorage.setItem(key, 'accepted'); } catch (_) {}
    banner.remove();
  });
})();
