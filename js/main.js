/**
 * Pathways Forward Career Center
 */

document.addEventListener('DOMContentLoaded', () => {
  initChecklist();
  initActiveNav();
  initMobileNav();
  initResourceSearch();
});

function initChecklist() {
  const form = document.getElementById('career-checklist');
  if (!form) return;

  const checkboxes = form.querySelectorAll('input[type="checkbox"]');
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  const progressMessage = document.getElementById('progress-message');
  const storageKey = 'pathways-forward-checklist';

  const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
  checkboxes.forEach((cb, i) => {
    if (saved[i]) cb.checked = true;
    cb.addEventListener('change', updateProgress);
  });

  function updateProgress() {
    const total = checkboxes.length;
    const checked = [...checkboxes].filter(cb => cb.checked).length;
    const percent = Math.round((checked / total) * 100);

    if (progressFill) progressFill.style.width = percent + '%';
    if (progressText) progressText.textContent = `${checked} of ${total} completed (${percent}%)`;

    const state = {};
    checkboxes.forEach((cb, i) => { state[i] = cb.checked; });
    localStorage.setItem(storageKey, JSON.stringify(state));

    if (progressMessage) {
      if (percent === 100) {
        progressMessage.textContent = 'All steps complete. Meet with your counselor to review your plan.';
        progressMessage.style.color = '#1f7a4d';
      } else if (percent >= 50) {
        progressMessage.textContent = 'Good progress. Keep going.';
        progressMessage.style.color = '#1a5578';
      } else if (checked > 0) {
        progressMessage.textContent = 'Good start. Check back as you complete items.';
        progressMessage.style.color = '#5c6f7f';
      } else {
        progressMessage.textContent = 'Your progress saves automatically.';
        progressMessage.style.color = '#5c6f7f';
      }
    }
  }

  updateProgress();

  const resetBtn = document.getElementById('reset-checklist');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Reset all checklist items?')) {
        checkboxes.forEach(cb => { cb.checked = false; });
        localStorage.removeItem(storageKey);
        updateProgress();
      }
    });
  }
}

function initActiveNav() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('is-open');
    toggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-label', 'Open menu');
    });
  });
}

function initResourceSearch() {
  const input = document.getElementById('resource-search');
  if (!input) return;

  const cards = document.querySelectorAll('.provider-card');
  const sections = document.querySelectorAll('.guide-section');
  const noResults = document.getElementById('no-results');

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    let visibleCount = 0;

    sections.forEach(section => {
      const sectionCards = section.querySelectorAll('.provider-card');
      let sectionVisible = 0;

      sectionCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const match = !query || text.includes(query);
        card.classList.toggle('is-hidden', !match);
        if (match) sectionVisible++;
      });

      section.classList.toggle('is-hidden', sectionVisible === 0);
      visibleCount += sectionVisible;
    });

    if (noResults) noResults.hidden = visibleCount > 0 || !query;
  });
}
