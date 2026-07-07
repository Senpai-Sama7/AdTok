const brandPalette = ['#d4756b', '#4a9b8e', '#e8a87c', '#c27664', '#5fb3a3', '#f4c2a1'];

const chartTheme = Object.freeze({
  borderColor: 'rgba(44,24,16,.15)',
  gridColor: 'rgba(44,24,16,.08)',
  lineColor: '#d4756b',
  pointColor: '#d4756b',
  textColor: '#2c1810',
  mutedTextColor: 'rgba(44,24,16,.7)',
  font: '12px Inter,sans-serif',
  barColors: brandPalette,
  pieColors: brandPalette,
  ganttColors: ['#4a9b8e', '#d4756b', '#e8a87c', '#5fb3a3']
});

const DEFAULT_CANVAS_HEIGHT = 160;

function prepareCanvas(target, height = DEFAULT_CANVAS_HEIGHT) {
  const { canvas, context } = target;
  const width = canvas.clientWidth || canvas.parentElement?.clientWidth || 0;

  if (!width || !height) {
    return null;
  }

  const dpr = window.devicePixelRatio || 1;
  const pixelWidth = Math.max(1, Math.round(width * dpr));
  const pixelHeight = Math.max(1, Math.round(height * dpr));

  canvas.style.width = '100%';
  canvas.style.height = `${height}px`;

  if (canvas.width !== pixelWidth) {
    canvas.width = pixelWidth;
  }
  if (canvas.height !== pixelHeight) {
    canvas.height = pixelHeight;
  }

  context.setTransform(1, 0, 0, 1, 0, 0);
  context.scale(dpr, dpr);

  return { canvas, context, width, height };
}

function getCanvasContext(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.warn(`Canvas element '${canvasId}' not found`);
    return null;
  }

  const context = canvas.getContext('2d');
  if (!context) {
    console.warn(`Could not get 2D context for canvas '${canvasId}'`);
    return null;
  }

  return { canvas, context };
}

function drawLineChart(canvasId, dataPoints) {
  const target = getCanvasContext(canvasId);
  if (!target) return;

  if (!dataPoints.length) return;

  const prepared = prepareCanvas(target);
  if (!prepared) return;

  const { context, width: canvasWidth, height: canvasHeight } = prepared;
  const maxValue = Math.max(...dataPoints);
  const minValue = Math.min(...dataPoints);
  const stepX = dataPoints.length > 1 ? canvasWidth / (dataPoints.length - 1) : canvasWidth;
  const stepY = (canvasHeight - 16) / ((maxValue - minValue) || 1);

  context.clearRect(0, 0, canvasWidth, canvasHeight);
  context.strokeStyle = chartTheme.borderColor;
  context.strokeRect(0.5, 0.5, canvasWidth - 1, canvasHeight - 1);

  context.beginPath();
  dataPoints.forEach((value, index) => {
    const x = index * stepX;
    const y = canvasHeight - 8 - (value - minValue) * stepY;
    if (index === 0) {
      context.moveTo(x, y);
    } else {
      context.lineTo(x, y);
    }
  });
  context.strokeStyle = chartTheme.lineColor;
  context.lineWidth = 2;
  context.stroke();

  dataPoints.forEach((value, index) => {
    const x = index * stepX;
    const y = canvasHeight - 8 - (value - minValue) * stepY;
    context.beginPath();
    context.arc(x, y, 3, 0, Math.PI * 2);
    context.fillStyle = chartTheme.pointColor;
    context.fill();
  });
}

function drawBarChart(canvasId, labels, values) {
  const target = getCanvasContext(canvasId);
  if (!target) return;

  if (!values.length || !labels.length) return;

  const prepared = prepareCanvas(target);
  if (!prepared) return;

  const { context, width: canvasWidth, height: canvasHeight } = prepared;
  const barWidth = (canvasWidth / values.length) * 0.6;
  const maxValue = Math.max(...values, 1);

  context.clearRect(0, 0, canvasWidth, canvasHeight);
  context.strokeStyle = chartTheme.borderColor;
  context.strokeRect(0.5, 0.5, canvasWidth - 1, canvasHeight - 1);

  values.forEach((value, index) => {
    const x = index * (canvasWidth / values.length) + (canvasWidth / values.length - barWidth) / 2;
    const barHeight = (canvasHeight - 16) * (value / maxValue);

    const barColor = chartTheme.barColors[index % chartTheme.barColors.length];
    context.fillStyle = barColor;
    context.fillRect(x, canvasHeight - 8 - barHeight, barWidth, barHeight);

    context.fillStyle = chartTheme.textColor;
    context.font = chartTheme.font;
    context.textAlign = 'center';
    context.fillText(labels[index], x + barWidth / 2, canvasHeight - 4);
    context.fillText(`${Math.round(value * 100)}%`, x + barWidth / 2, canvasHeight - 12 - barHeight);
  });
}

function drawPieChart(canvasId, segments) {
  const target = getCanvasContext(canvasId);
  if (!target) return;

  if (!segments.length) return;

  const prepared = prepareCanvas(target);
  if (!prepared) return;

  const { context, width: canvasWidth, height: canvasHeight } = prepared;
  const radius = Math.min(canvasWidth, canvasHeight) / 3;
  const centerX = canvasWidth / 3;
  const centerY = canvasHeight / 2;
  const totalValue = segments.reduce((sum, segment) => sum + segment.v, 0);
  let currentAngle = -Math.PI / 2;

  context.clearRect(0, 0, canvasWidth, canvasHeight);

  segments.forEach((segment, index) => {
    const sliceAngle = totalValue ? 2 * Math.PI * (segment.v / totalValue) : 0;
    const endAngle = currentAngle + sliceAngle;

    context.beginPath();
    context.moveTo(centerX, centerY);
    context.arc(centerX, centerY, radius, currentAngle, endAngle);
    context.closePath();
    const fillColor = chartTheme.pieColors[index % chartTheme.pieColors.length];
    context.fillStyle = fillColor;
    context.globalAlpha = 0.9;
    context.fill();
    context.globalAlpha = 1;

    currentAngle = endAngle;
  });

  const legendX = canvasWidth * 0.6;
  context.font = chartTheme.font;
  segments.forEach((segment, index) => {
    const legendY = 26 + 16 * index;
    const fillColor = chartTheme.pieColors[index % chartTheme.pieColors.length];
    context.fillStyle = fillColor;
    context.fillRect(legendX - 12, legendY - 9, 8, 8);
    context.fillStyle = chartTheme.textColor;
    context.fillText(`${segment.k} ${segment.v}%`, legendX, legendY);
  });
}

function drawGanttChart(canvasId, tasks) {
  const target = getCanvasContext(canvasId);
  if (!target) return;

  if (!tasks.length) return;

  const prepared = prepareCanvas(target);
  if (!prepared) return;

  const { context, width: canvasWidth, height: canvasHeight } = prepared;
  const maxDays = 28;
  const rowHeight = 22;

  context.clearRect(0, 0, canvasWidth, canvasHeight);

  tasks.forEach((task, index) => {
    const y = 10 + index * rowHeight;
    const startX = 20 + (canvasWidth - 40) * (task.start / maxDays);
    const barWidth = (canvasWidth - 40) * (task.len / maxDays);

    const ganttColor = chartTheme.ganttColors[index % chartTheme.ganttColors.length];
    context.fillStyle = ganttColor;
    context.fillRect(startX, y, barWidth, 12);

    context.fillStyle = chartTheme.textColor;
    context.font = chartTheme.font;
    context.fillText(task.name, 20, y + 10);
  });
}

export function initializeAllCharts() {
  try {
    drawLineChart('line', [21, 23, 24, 22, 26, 28, 29, 27, 30, 33, 31, 34, 36, 38]);
    drawBarChart('bars', ['<30s', '60-90s'], [0.45, 0.24]);
    drawPieChart('pie', [
      { k: 'For You', v: 62 },
      { k: 'Search', v: 24 },
      { k: 'Profile', v: 8 },
      { k: 'Other', v: 6 }
    ]);

    const projectTasks = [
      { name: 'Define pillars', start: 0, len: 4 },
      { name: 'Batch 15 videos', start: 0, len: 7 },
      { name: 'Go LIVE x2', start: 7, len: 7 },
      { name: 'Spark Ads test', start: 14, len: 7 },
      { name: 'Series / 1-min focus', start: 14, len: 7 },
      { name: 'Creator Marketplace', start: 21, len: 7 }
    ];

    drawGanttChart('gantt', projectTasks);
  } catch (error) {
    console.error('Error initializing charts:', error);
  }
}

let resizeTimeout;

export function registerChartResize() {
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      requestAnimationFrame(initializeAllCharts);
    }, 150);
  });
}
