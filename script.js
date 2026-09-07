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


  // Version 5: Leistungskarten öffnen jeweils eine eigene Bildergalerie
  const serviceLightbox = document.querySelector('.service-lightbox');
  const serviceTitle = serviceLightbox?.querySelector('#service-lightbox-title');
  const serviceImage = serviceLightbox?.querySelector('.service-lightbox-stage img');
  const serviceCounter = serviceLightbox?.querySelector('.service-lightbox-counter');
  const serviceClose = serviceLightbox?.querySelector('.service-lightbox-close');
  const servicePrev = serviceLightbox?.querySelector('.service-lightbox-prev');
  const serviceNext = serviceLightbox?.querySelector('.service-lightbox-next');
  let serviceImages = [];
  let serviceIndex = 0;
  let serviceLastFocused = null;
  let serviceTouchStartX = null;

  const renderServiceImage = () => {
    if (!serviceImage || !serviceImages.length) return;
    serviceImage.src = serviceImages[serviceIndex];
    serviceImage.alt = `${serviceTitle?.textContent || 'Leistung'} – Bild ${serviceIndex + 1}`;
    if (serviceCounter) serviceCounter.textContent = `${serviceIndex + 1} / ${serviceImages.length}`;
  };
  const showServiceStep = step => {
    if (!serviceImages.length) return;
    serviceIndex = (serviceIndex + step + serviceImages.length) % serviceImages.length;
    renderServiceImage();
  };
  const openServiceGallery = card => {
    if (!serviceLightbox || !serviceImage) return;
    serviceImages = (card.dataset.serviceImages || '').split('|').filter(Boolean);
    if (!serviceImages.length) return;
    serviceIndex = 0;
    serviceLastFocused = card;
    if (serviceTitle) serviceTitle.textContent = card.dataset.serviceTitle || card.querySelector('h3')?.textContent || 'Galerie';
    renderServiceImage();
    serviceLightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    serviceClose?.focus();
  };
  const closeServiceGallery = () => {
    if (!serviceLightbox) return;
    serviceLightbox.hidden = true;
    if (serviceImage) serviceImage.src = '';
    document.body.style.overflow = '';
    serviceLastFocused?.focus();
  };

  document.querySelectorAll('.service-gallery-card').forEach(card => {
    card.addEventListener('click', () => openServiceGallery(card));
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openServiceGallery(card);
      }
    });
  });
  servicePrev?.addEventListener('click', () => showServiceStep(-1));
  serviceNext?.addEventListener('click', () => showServiceStep(1));
  serviceClose?.addEventListener('click', closeServiceGallery);
  serviceLightbox?.addEventListener('click', event => { if (event.target === serviceLightbox) closeServiceGallery(); });
  serviceLightbox?.addEventListener('touchstart', event => { serviceTouchStartX = event.changedTouches[0]?.clientX ?? null; }, { passive:true });
  serviceLightbox?.addEventListener('touchend', event => {
    if (serviceTouchStartX == null) return;
    const dx = (event.changedTouches[0]?.clientX ?? serviceTouchStartX) - serviceTouchStartX;
    if (Math.abs(dx) > 45) showServiceStep(dx < 0 ? 1 : -1);
    serviceTouchStartX = null;
  }, { passive:true });
  document.addEventListener('keydown', event => {
    if (!serviceLightbox || serviceLightbox.hidden) return;
    if (event.key === 'Escape') closeServiceGallery();
    if (event.key === 'ArrowLeft') showServiceStep(-1);
    if (event.key === 'ArrowRight') showServiceStep(1);
  });

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
