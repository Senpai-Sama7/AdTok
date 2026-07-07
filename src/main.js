import './styles/main.css';
import { initializeTabs, switchToTab } from './tabs.js';
import { initializeAllCharts, registerChartResize } from './charts.js';

document.addEventListener('DOMContentLoaded', () => {
  initializeTabs();
  switchToTab('home');
  initializeAllCharts();
  registerChartResize();
});

window.addEventListener('load', () => {
  initializeAllCharts();
});
