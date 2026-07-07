#!/bin/bash

# Git Setup Script for mastering_tiktok Repository
# Run this script to initialize and push to GitHub

echo "🚀 Setting up mastering_tiktok repository..."

# Initialize git repository
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "🎯 Initial commit: TikTok Marketing Psychology Dashboard

✨ Features:
- Psychology-driven marketing framework
- 5 viral script templates with behavioral triggers
- Advanced analytics (MMM/MTA) integration
- Digital product strategy with profit analysis
- WCAG 2.1 AA accessibility compliance
- GitHub Pages deployment ready

🎪 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

# Set main branch
git branch -M main

# Add remote origin
git remote add origin https://github.com/Senpai-Sama7/mastering_tiktok.git

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push -u origin main

echo "✅ Repository successfully pushed to GitHub!"
echo "🌐 Your dashboard will be available at:"
echo "   https://senpai-sama7.github.io/mastering_tiktok"
echo ""
echo "📋 Next steps:"
echo "1. Go to GitHub repository settings"
echo "2. Enable GitHub Pages (Settings → Pages → Source: GitHub Actions)"
echo "3. Wait for deployment (check Actions tab)"
echo "4. Visit your live dashboard!"

# Check status
git status