(() => {
  // Shared navbar injection + scroll behavior.
  const navbarMarkup = `
    <nav class="rb-nav" aria-label="Navegación principal">
      <div class="rb-nav-row">
        <a class="rb-logo" href="index.html" aria-label="Inicio">
          <span class="brand-dh">DH</span><span class="brand-mexico">mexico</span>
        </a>
        <div class="rb-pill">
          <div class="rb-menu">
            <a class="rb-item" href="index.html#top">Inicio</a>
            <a class="rb-item" href="eventos.html">Eventos</a>
            <a class="rb-item" href="standings.html">Standings</a>
            <a class="rb-item" href="atletas.html">Atletas</a>
            <a class="rb-item" href="nosotros.html">Nosotros</a>
          </div>
        </div>
        <div class="rb-actions">
          <button class="rb-icon-btn" type="button" aria-label="Perfil">👤</button>
          <button class="rb-icon-btn" type="button" aria-label="Configuración">⚙️</button>
        </div>
      </div>
    </nav>
  `;

  document.body.insertAdjacentHTML('afterbegin', navbarMarkup);

  const nav = document.querySelector('.rb-nav');
  if (!nav) return;

  const setActiveLink = () => {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    const normalize = (value) => (value || '').split('#')[0];
    const normalizedCurrent = normalize(current);
    let activeTarget = normalizedCurrent;

    if (normalizedCurrent.startsWith('atleta-')) {
      activeTarget = 'atletas.html';
    } else if (normalizedCurrent.startsWith('standings-detalle')) {
      activeTarget = 'standings.html';
    } else if (normalizedCurrent.startsWith('evento-')) {
      activeTarget = 'eventos.html';
    }
    const links = Array.from(nav.querySelectorAll('.rb-item'));
    links.forEach((link) => {
      const href = normalize(link.getAttribute('href'));
      if (href === activeTarget) {
        link.classList.add('rb-item--active');
        link.setAttribute('aria-current', 'page');
      }
    });
  };

  const setNavHeight = () => {
    const navRect = nav.getBoundingClientRect();
    const navOffset = 20;
    const totalHeight = Math.ceil(navRect.height + navOffset);
    document.documentElement.style.setProperty('--nav-h', `${totalHeight}px`);
  };

  // Hide/show based on scroll direction with a small delta.
  const hideNav = () => {
    nav.classList.add('rb-nav--hidden', 'is-hidden');
    nav.classList.remove('is-sticky');
  };
  const showNav = () => {
    nav.classList.remove('rb-nav--hidden', 'is-hidden');
    if (window.scrollY > 0) {
      nav.classList.add('is-sticky');
    } else {
      nav.classList.remove('is-sticky');
    }
  };

  let lastScrollY = window.scrollY;
  let lastKnownScrollY = lastScrollY;
  let ticking = false;
  const threshold = 12;
  const hideAfter = 60;

  const updateScrollState = () => {
    const currentY = lastKnownScrollY;
    const delta = currentY - lastScrollY;

    if (currentY <= 0) {
      showNav();
      nav.classList.remove('is-sticky');
    } else if (delta > threshold && currentY > hideAfter) {
      hideNav();
    } else if (delta < -threshold) {
      showNav();
    }

    lastScrollY = currentY;
    ticking = false;
  };

  const onScroll = () => {
    lastKnownScrollY = window.scrollY || 0;
    if (!ticking) {
      window.requestAnimationFrame(updateScrollState);
      ticking = true;
    }
  };

  setActiveLink();
  setNavHeight();
  showNav();

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    window.requestAnimationFrame(setNavHeight);
  });
})();
