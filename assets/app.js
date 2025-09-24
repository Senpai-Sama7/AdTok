// Enhanced tab switching with accessibility support
function switchToTab(tabId) {
  if (!tabId) return;

  // Update sidebar tab states and ARIA attributes
  const navButtons = document.querySelectorAll('.nav button');
  navButtons.forEach(button => {
    const isActive = button.dataset.tab === tabId;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-selected', isActive.toString());
    button.setAttribute('tabindex', isActive ? '0' : '-1');
  });

  // Update header shortcut buttons
  const shortcutButtons = document.querySelectorAll('.tabs button');
  shortcutButtons.forEach(button => {
    const isActive = button.dataset.tab === tabId;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', isActive.toString());
  });

  // Update panel visibility
  const allPanels = document.querySelectorAll('.view');
  allPanels.forEach(panel => {
    panel.classList.toggle('hidden', panel.id !== tabId);
  });
}

// Initialize tab system with keyboard navigation
function initializeTabs() {
  const tabButtons = document.querySelectorAll('.nav button, .tabs button');

  tabButtons.forEach(button => {
    // Click handler
    button.addEventListener('click', (e) => {
      e.preventDefault();
      switchToTab(button.dataset.tab);
    });

    // Keyboard navigation
    button.addEventListener('keydown', (e) => {
      let targetButton = null;
      const currentButtons = Array.from(button.closest('.nav, .tabs').querySelectorAll('button'));
      const currentIndex = currentButtons.indexOf(button);

      switch(e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          targetButton = currentButtons[currentIndex + 1] || currentButtons[0];
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          targetButton = currentButtons[currentIndex - 1] || currentButtons[currentButtons.length - 1];
          break;
        case 'Home':
          e.preventDefault();
          targetButton = currentButtons[0];
          break;
        case 'End':
          e.preventDefault();
          targetButton = currentButtons[currentButtons.length - 1];
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          switchToTab(button.dataset.tab);
          return;
      }

      if (targetButton) {
        targetButton.focus();
        switchToTab(targetButton.dataset.tab);
      }
    });
  });
}

// Enhanced chart functions with error handling
function drawLineChart(canvasId, dataPoints) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.warn(`Canvas element '${canvasId}' not found`);
    return;
  }

  const context = canvas.getContext('2d');
  if (!context) {
    console.warn(`Could not get 2D context for canvas '${canvasId}'`);
    return;
  }

  const canvasWidth = canvas.width = canvas.clientWidth;
  const canvasHeight = canvas.height = 160;
  const maxValue = Math.max(...dataPoints);
  const minValue = Math.min(...dataPoints);
  const stepX = canvasWidth / (dataPoints.length - 1);
  const stepY = (canvasHeight - 16) / ((maxValue - minValue) || 1);

  // Clear and draw border
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  context.strokeStyle = 'rgba(255,255,255,.25)';
  context.strokeRect(0.5, 0.5, canvasWidth - 1, canvasHeight - 1);

  // Draw line
  context.beginPath();
  dataPoints.forEach((value, index) => {
    const x = index * stepX;
    const y = canvasHeight - 8 - (value - minValue) * stepY;
    index === 0 ? context.moveTo(x, y) : context.lineTo(x, y);
  });
  context.strokeStyle = '#E9EEF7';
  context.lineWidth = 2;
  context.stroke();

  // Draw points
  dataPoints.forEach((value, index) => {
    const x = index * stepX;
    const y = canvasHeight - 8 - (value - minValue) * stepY;
    context.beginPath();
    context.arc(x, y, 3, 0, Math.PI * 2);
    context.fillStyle = '#E9EEF7';
    context.fill();
  });
}

function drawBarChart(canvasId, labels, values) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.warn(`Canvas element '${canvasId}' not found`);
    return;
  }

  const context = canvas.getContext('2d');
  if (!context) return;

  const canvasWidth = canvas.width = canvas.clientWidth;
  const canvasHeight = canvas.height = 160;
  const barWidth = canvasWidth / values.length * 0.6;
  const maxValue = Math.max(...values, 1);

  context.clearRect(0, 0, canvasWidth, canvasHeight);
  context.strokeStyle = 'rgba(255,255,255,.25)';
  context.strokeRect(0.5, 0.5, canvasWidth - 1, canvasHeight - 1);

  values.forEach((value, index) => {
    const x = index * (canvasWidth / values.length) + (canvasWidth / values.length - barWidth) / 2;
    const barHeight = (canvasHeight - 16) * (value / maxValue);

    // Draw bar
    context.fillStyle = '#E9EEF7';
    context.fillRect(x, canvasHeight - 8 - barHeight, barWidth, barHeight);

    // Draw labels
    context.fillStyle = 'rgba(233,238,247,.8)';
    context.font = '12px Inter,sans-serif';
    context.textAlign = 'center';
    context.fillText(labels[index], x + barWidth / 2, canvasHeight - 4);
    context.fillText(Math.round(value * 100) + '%', x + barWidth / 2, canvasHeight - 12 - barHeight);
  });
}

function drawPieChart(canvasId, segments) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const context = canvas.getContext('2d');
  if (!context) return;

  const canvasWidth = canvas.width = canvas.clientWidth;
  const canvasHeight = canvas.height = 160;
  const radius = Math.min(canvasWidth, canvasHeight) / 3;
  const centerX = canvasWidth / 3;
  const centerY = canvasHeight / 2;
  const totalValue = segments.reduce((sum, segment) => sum + segment.v, 0);
  let currentAngle = -Math.PI / 2;

  context.clearRect(0, 0, canvasWidth, canvasHeight);

  // Draw pie segments
  segments.forEach(segment => {
    const sliceAngle = 2 * Math.PI * (segment.v / totalValue);
    const endAngle = currentAngle + sliceAngle;

    context.beginPath();
    context.moveTo(centerX, centerY);
    context.arc(centerX, centerY, radius, currentAngle, endAngle);
    context.closePath();
    context.fillStyle = '#E9EEF7';
    context.globalAlpha = 0.9;
    context.fill();
    context.globalAlpha = 1;

    currentAngle = endAngle;
  });

  // Draw legend
  context.fillStyle = 'rgba(233,238,247,.8)';
  context.font = '12px Inter,sans-serif';
  segments.forEach((segment, index) => {
    context.fillText(`${segment.k} ${segment.v}%`, canvasWidth * 0.6, 26 + 16 * index);
  });
}

function drawGanttChart(canvasId, tasks) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const context = canvas.getContext('2d');
  if (!context) return;

  const canvasWidth = canvas.width = canvas.clientWidth;
  const canvasHeight = canvas.height = 160;
  const maxDays = 28;
  const rowHeight = 22;

  context.clearRect(0, 0, canvasWidth, canvasHeight);

  tasks.forEach((task, index) => {
    const y = 10 + index * rowHeight;
    const startX = 20 + (canvasWidth - 40) * (task.start / maxDays);
    const barWidth = (canvasWidth - 40) * (task.len / maxDays);

    // Draw task bar
    context.fillStyle = '#E9EEF7';
    context.fillRect(startX, y, barWidth, 12);

    // Draw task name
    context.fillStyle = 'rgba(233,238,247,.85)';
    context.font = '12px Inter,sans-serif';
    context.fillText(task.name, 20, y + 10);
  });
}

function initializeAllCharts() {
  try {
    drawLineChart('line', [21, 23, 24, 22, 26, 28, 29, 27, 30, 33, 31, 34, 36, 38]);
    drawBarChart('bars', ['<30s', '60-90s'], [0.45, 0.24]);
    drawPieChart('pie', [
      {k: 'For You', v: 62},
      {k: 'Search', v: 24},
      {k: 'Profile', v: 8},
      {k: 'Other', v: 6}
    ]);

    const projectTasks = [
      {name: 'Define pillars', start: 0, len: 4},
      {name: 'Batch 15 videos', start: 0, len: 7},
      {name: 'Go LIVE x2', start: 7, len: 7},
      {name: 'Spark Ads test', start: 14, len: 7},
      {name: 'Series / 1-min focus', start: 14, len: 7},
      {name: 'Creator Marketplace', start: 21, len: 7}
    ];

    drawGanttChart('gantt', projectTasks);
  } catch (error) {
    console.error('Error initializing charts:', error);
  }
}

// Initialize application
window.addEventListener('load', () => {
  initializeAllCharts();
  initializeTabs();
  switchToTab('home');
});

// Optimized resize handler with debouncing
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    requestAnimationFrame(initializeAllCharts);
  }, 150);
});
