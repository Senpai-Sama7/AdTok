const NAV_SELECTOR = '.nav button';
const SHORTCUT_SELECTOR = '.tabs button';
const PANEL_SELECTOR = '.view';

function syncTabState(buttons, tabId, applyState) {
  buttons.forEach(button => {
    const isActive = button.dataset.tab === tabId;
    applyState(button, isActive);
  });
}

export function switchToTab(tabId) {
  if (!tabId) return;

  const navButtons = document.querySelectorAll(NAV_SELECTOR);
  const shortcutButtons = document.querySelectorAll(SHORTCUT_SELECTOR);

  syncTabState(navButtons, tabId, (button, isActive) => {
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-selected', isActive.toString());
    button.setAttribute('tabindex', isActive ? '0' : '-1');
  });

  syncTabState(shortcutButtons, tabId, (button, isActive) => {
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', isActive.toString());
  });

  const panels = document.querySelectorAll(PANEL_SELECTOR);
  panels.forEach(panel => {
    panel.classList.toggle('hidden', panel.id !== tabId);
  });
}

export function initializeTabs() {
  const tabButtons = document.querySelectorAll(`${NAV_SELECTOR}, ${SHORTCUT_SELECTOR}`);

  tabButtons.forEach(button => {
    if (!button.dataset.tab) return;

    button.addEventListener('click', event => {
      event.preventDefault();
      switchToTab(button.dataset.tab);
    });

    button.addEventListener('keydown', event => {
      let targetButton = null;
      const siblings = Array.from(button.closest('.nav, .tabs').querySelectorAll('button'));
      const currentIndex = siblings.indexOf(button);

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          targetButton = siblings[currentIndex + 1] || siblings[0];
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          targetButton = siblings[currentIndex - 1] || siblings[siblings.length - 1];
          break;
        case 'Home':
          event.preventDefault();
          targetButton = siblings[0];
          break;
        case 'End':
          event.preventDefault();
          targetButton = siblings[siblings.length - 1];
          break;
        case 'Enter':
        case ' ': // Space
          event.preventDefault();
          switchToTab(button.dataset.tab);
          return;
        default:
          return;
      }

      if (targetButton) {
        targetButton.focus();
        switchToTab(targetButton.dataset.tab);
      }
    });
  });
}
