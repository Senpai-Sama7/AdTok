# GitHub Deployment Guide

## Quick Deploy (5 minutes)

### 1. Create GitHub Repository
```bash
# Go to GitHub.com and create a new repository named:
tiktok-marketing-dashboard
```

### 2. Upload Files
```bash
# Clone this folder or upload all files to your new repository
# Make sure to include all files and folders, especially:
# - index.html
# - src/ (Vite source: main.js, tabs.js, charts.js, styles/)
# - public/assets/ (images, videos, static assets)
# - .github/workflows/deploy.yml
# - vite.config.js
```

### 3. Enable GitHub Pages
1. Go to your repository Settings
2. Scroll to "Pages" section
3. Under "Source", select **"GitHub Actions"**
4. Save the changes

### 4. Automatic Deployment
- Every push to the `main` branch installs dependencies, runs `npm test`, builds with Vite, and then deploys automatically
- Check the "Actions" tab to see deployment status
- Your site will be live at: `https://your-username.github.io/tiktok-marketing-dashboard`

## Custom Domain (Optional)

### Add Your Domain
1. Edit the `CNAME` file:
```bash
echo "yourdomain.com" > CNAME
```

2. Configure DNS:
```
Type: CNAME
Name: @
Value: your-username.github.io
```

3. Wait for DNS propagation (up to 24 hours)

## Local Development

### Option 1: Vite Dev Server
```bash
cd tiktok-marketing-dashboard
npm install
npm run dev
# Open the URL printed by Vite (typically http://localhost:5173)
```

### Option 2: Preview Production Build
```bash
npm run build
npm run preview
# Open http://localhost:4173
```

## Troubleshooting

### Common Issues
1. **404 Error**: Check that `index.html` is in the root directory and Vite build artifacts exist in `dist/`
2. **CSS Not Loading**: Confirm `src/styles/main.css` is imported in `src/main.js`
3. **JS Not Working**: Ensure `<script type="module" src="/src/main.js">` is present in `index.html`
4. **Deployment Failed**: Check Actions tab for `npm test` or `npm run build` failures

### File Structure Verification
```
tiktok-marketing-dashboard/
├── index.html              ✅ Required
├── src/
│   ├── main.js             ✅ Vite entry
│   ├── tabs.js             ✅ Tab logic
│   ├── charts.js           ✅ Chart utilities
│   └── styles/main.css     ✅ Design system
├── public/
│   └── assets/
│       ├── images/         ✅ Static imagery
│       └── videos/         🎥 Optional media
├── .github/
│   └── workflows/
│       └── deploy.yml      ✅ Required for auto-deploy
├── docs/
│   └── test-report.md      📄 Documentation
├── README.md               📄 Documentation
├── LICENSE                 📄 Legal
├── package.json           📄 Project info
├── .gitignore             🔧 Git config
└── CNAME                  🌐 Custom domain (optional)
```

## Deployment Status Badges

Add to your README:
```markdown
![Deploy Status](https://github.com/your-username/tiktok-marketing-dashboard/actions/workflows/deploy.yml/badge.svg)
```

## Support

- **GitHub Issues**: Report bugs or request features
- **GitHub Discussions**: General questions and community
- **Documentation**: Check README.md and docs/ folder
