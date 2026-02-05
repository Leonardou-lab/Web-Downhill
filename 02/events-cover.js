(() => {
  const cover = document.getElementById('eventsCover');
  if (!cover) return;

  const panels = Array.from(cover.querySelectorAll('.cover-panel'));
  if (!panels.length) return;

  const applyPanelBg = (panel) => {
    const bg = panel.getAttribute('data-bg');
    const bgEl = panel.querySelector('.cover-bg');
    if (bgEl && bg) {
      bgEl.style.backgroundImage = `url("${bg}")`;
    }
  };

  panels.forEach(applyPanelBg);

  const total = panels.length;
  let activeIndex = 0;
  let isAnimating = false;
  let wheelAcc = 0;

  const applyState = () => {
    panels.forEach((panel, index) => {
      panel.classList.remove('is-active', 'is-prev');
      panel.style.zIndex = '1';
      panel.style.opacity = '';
    });

    const active = panels[activeIndex];
    const prevIndex = (activeIndex - 1 + total) % total;
    const prev = panels[prevIndex];

    active.classList.add('is-active');
    active.style.zIndex = '3';

    prev.classList.add('is-prev');
    prev.style.zIndex = '2';
  };

  const goNext = () => {
    if (isAnimating) return;
    isAnimating = true;
    activeIndex = (activeIndex + 1) % total;
    applyState();
    window.setTimeout(() => {
      isAnimating = false;
    }, 540);
  };

  const goPrev = () => {
    if (isAnimating) return;
    isAnimating = true;
    activeIndex = (activeIndex - 1 + total) % total;
    applyState();
    window.setTimeout(() => {
      isAnimating = false;
    }, 540);
  };

  const onWheel = (event) => {
    event.preventDefault();
    if (isAnimating) return;
    wheelAcc += event.deltaY;
    if (wheelAcc > 120) {
      wheelAcc = 0;
      goNext();
    } else if (wheelAcc < -120) {
      wheelAcc = 0;
      goPrev();
    }
  };

  applyState();

  window.addEventListener('wheel', onWheel, { passive: false });
})();
