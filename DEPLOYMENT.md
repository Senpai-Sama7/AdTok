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
# - assets/ (with styles.css and app.js)
# - .github/workflows/deploy.yml
```

### 3. Enable GitHub Pages
1. Go to your repository Settings
2. Scroll to "Pages" section
3. Under "Source", select **"GitHub Actions"**
4. Save the changes

### 4. Automatic Deployment
- Every push to the `main` branch will automatically deploy
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

### Option 1: Python Server
```bash
cd tiktok-marketing-dashboard
python -m http.server 8000
# Open http://localhost:8000
```

### Option 2: Node.js Server
```bash
npm install -g http-server
http-server
# Open http://localhost:8080
```

### Option 3: VS Code Live Server
1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

## Troubleshooting

### Common Issues
1. **404 Error**: Check that `index.html` is in the root directory
2. **CSS Not Loading**: Verify `assets/styles.css` path in index.html
3. **JS Not Working**: Check `assets/app.js` path and browser console
4. **Deployment Failed**: Check Actions tab for error details

### File Structure Verification
```
tiktok-marketing-dashboard/
├── index.html              ✅ Required
├── assets/
│   ├── styles.css          ✅ Required
│   └── app.js              ✅ Required
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