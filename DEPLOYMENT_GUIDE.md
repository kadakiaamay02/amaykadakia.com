# Angular Portfolio - Deployment Guide

## Quick Start

Your Angular portfolio is ready to deploy! Here's how to get it live in minutes.

---

## Option 1: Netlify (Recommended - Easiest)

### Method A: GitHub Integration (Recommended)
1. Push your project to GitHub:
   ```bash
   git add .
   git commit -m "Angular portfolio ready for deployment"
   git push origin main
   ```

2. Go to [netlify.com](https://netlify.com) and sign up
3. Click "New site from Git"
4. Select GitHub and authorize
5. Choose your repository
6. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/amaykadakia-portfolio`
7. Click "Deploy site"
8. Netlify will automatically deploy on every push to main

### Method B: Manual Upload
1. Build your project:
   ```bash
   npm run build
   ```

2. Go to [netlify.com](https://netlify.com)
3. Drag and drop the `dist/amaykadakia-portfolio/` folder onto Netlify
4. Your site is live!

### Custom Domain
After deployment:
1. Go to "Site settings" → "Domain management"
2. Click "Add custom domain"
3. Enter your domain (e.g., `amaykadakia.com`)
4. Update your domain's DNS to point to Netlify
5. Netlify provides the DNS records to add

---

## Option 2: Vercel

1. Push to GitHub (same as Netlify)
2. Go to [vercel.com](https://vercel.com) and sign up
3. Click "New Project"
4. Import your GitHub repository
5. Vercel auto-detects Angular and configures it
6. Click "Deploy"
7. Your site is live!

### Configure Domain
- Go to project settings
- Add domain under "Domains"
- Follow DNS configuration steps

---

## Option 3: GitHub Pages

### Setup
1. Update `angular.json`:
   ```json
   "outputPath": "dist/amaykadakia-portfolio",
   "baseHref": "/amaykadakia.com/"  // or "/" for user/org pages
   ```

2. Install the deployer:
   ```bash
   npm install -g angular-cli-ghpages
   ```

3. Build and deploy:
   ```bash
   npm run build
   ngh --dir=dist/amaykadakia-portfolio
   ```

4. Enable GitHub Pages:
   - Go to repository settings
   - Select "GitHub Pages"
   - Choose "gh-pages" branch as source

5. Your site is live at `https://yourusername.github.io/amaykadakia.com`

---

## Option 4: Traditional Web Hosting

### Using FTP/SFTP

1. Build your project:
   ```bash
   npm run build
   ```

2. Upload contents of `dist/amaykadakia-portfolio/` to your web server's public folder (usually `public_html/` or `www/`)

3. Ensure `.htaccess` exists for routing (create if needed):
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

4. Clear browser cache and visit your domain

### nginx Configuration
If using nginx:
```nginx
server {
    listen 80;
    server_name amaykadakia.com;
    
    root /var/www/amaykadakia-portfolio;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Optional: Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

---

## Post-Deployment Checklist

### Essential
- [ ] Site loads without errors
- [ ] All navigation links work
- [ ] Responsive design works on mobile
- [ ] Images load correctly
- [ ] Forms/contact info displays properly

### Recommended
- [ ] Set up SSL/TLS certificate (auto-provided by most platforms)
- [ ] Add Google Analytics
- [ ] Test performance with Lighthouse
- [ ] Test on multiple browsers
- [ ] Set up domain email (if applicable)

### Optional Enhancements
- [ ] Add 404 page
- [ ] Set up redirects for old URLs
- [ ] Add sitemap.xml for SEO
- [ ] Configure robots.txt
- [ ] Set up CDN for images

---

## Monitoring & Maintenance

### Regular Updates
```bash
# Check for dependency updates
npm outdated

# Update dependencies
npm update

# Update Angular
ng update @angular/core @angular/cli
```

### Performance Monitoring
- Enable Netlify Analytics or Vercel Analytics
- Monitor with Google Analytics
- Use Lighthouse for regular audits

### Backup Strategy
- Keep Git history clean and backed up
- Tag releases: `git tag -a v1.0.0 -m "Initial deployment"`
- Regular GitHub backups

---

## Environment Configuration

### For Multiple Environments

Create different build configurations:

```bash
# Production
npm run build -- --configuration production

# Staging (if needed)
ng build --configuration staging
```

Update `angular.json` environments:
```json
"configurations": {
  "production": {
    "optimization": true,
    "outputHashing": "all",
    "sourceMap": false
  },
  "staging": {
    "optimization": true,
    "sourceMap": true
  }
}
```

---

## Troubleshooting

### White Screen / 404 Errors
- Ensure `baseHref` is correct in `angular.json`
- Check that `.htaccess` or nginx config is correct
- Clear browser cache (Ctrl+Shift+Delete)

### Images Not Loading
- Verify image paths in components
- Check asset folder configuration in `angular.json`
- Ensure images are in `src/assets/` directory

### Navigation Not Working
- Make sure routing is configured
- Check browser console for JavaScript errors
- Verify all routes in `src/app/app.routes.ts`

### Performance Issues
- Run `npm run build` with `--stats-json` to analyze bundle
- Use `webpack-bundle-analyzer` to visualize bundle
- Consider lazy loading for large modules

---

## SSL/TLS Certificate

Most deployment platforms handle this automatically:
- **Netlify**: Free Let's Encrypt SSL
- **Vercel**: Free automatic SSL
- **GitHub Pages**: Free automatic SSL
- **Traditional hosting**: Usually available free through cPanel/Plesk or Certbot

---

## Domain Configuration Examples

### Example: Adding amaykadakia.com

#### With Netlify
1. Buy domain (GoDaddy, Namecheap, etc.)
2. In Netlify settings, add custom domain
3. Update domain DNS to Netlify nameservers
4. Certificate auto-provisioned (usually within 24 hours)

#### With Traditional Hosting
1. Buy domain
2. Point domain DNS to hosting provider's nameservers
3. Upload files to server
4. Configure SSL certificate (Let's Encrypt recommended)

---

## Advanced: CI/CD Pipeline

### Automatic Deployment on Push

#### GitHub Actions Example
Create `.github/workflows/deploy.yml`:
```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm ci
      - run: npm run build
      
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v1
        with:
          publish-dir: './dist/amaykadakia-portfolio'
          deploy-message: 'Deploy from GitHub Actions'
```

---

## Support & Resources

- [Angular Deployment Guide](https://angular.io/guide/deployment)
- [Netlify Documentation](https://docs.netlify.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Pages Guide](https://pages.github.com/)

---

**Ready to deploy? Follow Option 1 (Netlify) for the fastest setup!**

Questions? Check the main documentation files or Angular official docs.
