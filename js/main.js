/**
 * Pathways Forward Career Center — Interactive Features
 */

document.addEventListener('DOMContentLoaded', () => {
  initChecklist();
  initActiveNav();
});

function initChecklist() {
  const form = document.getElementById('career-checklist');
  if (!form) return;

  const checkboxes = form.querySelectorAll('input[type="checkbox"]');
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  const progressMessage = document.getElementById('progress-message');

  const storageKey = 'pathways-forward-checklist';

  // Restore saved state
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
        progressMessage.textContent = 'Excellent work! You have completed all action steps. Schedule a meeting with your school counselor to review your plan.';
        progressMessage.style.color = '#2d7a4f';
      } else if (percent >= 50) {
        progressMessage.textContent = 'You are making great progress. Keep going — each step brings you closer to clarity.';
        progressMessage.style.color = '#1a4d6e';
      } else if (checked > 0) {
        progressMessage.textContent = 'Good start! Return to this checklist regularly as you complete each item.';
        progressMessage.style.color = '#5a6c7d';
      } else {
        progressMessage.textContent = 'Check off items as you complete them. Your progress is saved automatically.';
        progressMessage.style.color = '#5a6c7d';
      }
    }
  }

  updateProgress();

  const resetBtn = document.getElementById('reset-checklist');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Reset all checklist items? This cannot be undone.')) {
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
