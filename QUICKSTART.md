# Quick Start Guide

## Your Portfolio is Now an Angular App! 🎉

Your static HTML portfolio website has been successfully converted to a modern Angular application with component-based architecture, services, and responsive design.

## ⚡ Get Started (3 Steps)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```
Open browser to `http://localhost:4200`

### 3. Make It Your Own
Edit `src/app/services/portfolio.service.ts` to update:
- Projects in `getPortfolioData()`
- Experience in `getExperienceData()`
- Education in `getEducationData()`
- Skills in `getSkillsData()`
- Certifications in `getCertificationsData()`

## 📁 Project Structure

```
src/
├── app/
│   ├── components/          # UI Components (header, intro, about, etc.)
│   ├── services/           # Business logic (portfolio, scroll, animation)
│   ├── models/            # TypeScript interfaces
│   ├── app.component.ts   # Root component
│   └── app.routes.ts      # Routing configuration
├── styles.scss            # Global styles
├── main.ts               # Entry point
└── index.html            # Main HTML file
```

## 🎨 Components

1. **HeaderComponent** - Navigation menu with mobile support
2. **IntroComponent** - Hero section with social links
3. **AboutComponent** - Bio, experience, education, skills, certifications
4. **WorksComponent** - Project portfolio with interactive modals
5. **ContactComponent** - Contact information
6. **FooterComponent** - Footer with scroll-to-top

## 🚀 Build for Production

```bash
npm run build
```

Output: `dist/amaykadakia-portfolio/`

Deploy the `dist/` folder to:
- Netlify
- Vercel
- GitHub Pages
- Any static host

## 🎯 Key Features

✅ Responsive design (mobile, tablet, desktop)
✅ Smooth animations with anime.js
✅ Component-based architecture
✅ TypeScript for type safety
✅ Services for data management
✅ SCSS with variables and nesting
✅ Standalone components (latest Angular)

## 📝 Update Information

### Add a New Project
```typescript
// In portfolio.service.ts
{
  id: 'unique-id',
  title: 'Project Title',
  category: 'Project Type',
  description: 'Full description',
  image: 'path/to/image.png',
  tags: ['tag1', 'tag2'],
  link: 'https://...',
  githubLink: 'https://github.com/...'
}
```

### Update Skills
```typescript
// In portfolio.service.ts
{ name: 'Your Skill' }
```

## 🎨 Customize Styles

Global colors in `src/styles.scss`:
```scss
--color-1: #eabe7c        // Primary accent
--color-2: #23967f        // Secondary accent
--color-white: #ffffff
--color-gray-10: #101112  // Background
```

## 🔍 File Changes from Original

### What's New
- ✅ TypeScript (type-safe code)
- ✅ Components (modular structure)
- ✅ Services (reusable logic)
- ✅ RxJS (reactive patterns)
- ✅ Routing (smooth navigation)

### What's the Same
- ✅ Same visual design
- ✅ Same content and data
- ✅ Same animations
- ✅ Same responsive behavior
- ✅ Same color scheme

## 📚 Available Commands

```bash
npm start              # Run dev server
npm run build         # Build for production
npm run watch         # Build in watch mode
npm test             # Run tests
npm run lint         # Lint code
```

## 🆘 Troubleshooting

**Port 4200 already in use?**
```bash
ng serve --port 4300
```

**Styles not showing?**
- Make sure `node_modules` was installed
- Check browser console for errors
- Try `npm install` again

**Images not loading?**
- Ensure images are in `src/assets/`
- Update paths in components if needed

## 📖 Documentation

- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Detailed setup instructions
- [ANGULAR_README.md](./ANGULAR_README.md) - Angular-specific documentation
- [package.json](./package.json) - Dependencies and scripts

## 🌐 Original Files

Your original HTML, CSS, and JS files are preserved:
- `index.html` (old version in root)
- `css/styles.css` (now in `src/styles.scss`)
- `js/main.js` (now in services and components)

## ✨ Next Steps

1. ✅ Run `npm install`
2. ✅ Run `npm start`
3. ✅ Test the app in browser
4. ✅ Update your data in portfolio.service.ts
5. ✅ Customize colors and fonts as needed
6. ✅ Build and deploy!

## 🎓 Learn More

- [Angular Documentation](https://angular.io)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [SCSS Guide](https://sass-lang.com/guide)
- [anime.js Docs](https://animejs.com/)

---

**Happy coding!** 🚀

For detailed information, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)
