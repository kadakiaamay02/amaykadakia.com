# Angular Portfolio Conversion - Setup Guide

## Overview

Your portfolio website has been successfully converted from vanilla HTML/CSS/JavaScript to a modern Angular application. This document provides guidance on setting up, running, and deploying the application.

## What's Been Converted

### Original Structure
```
index.html
css/
  - styles.css
  - vendor.css
js/
  - main.js
  - plugins.js
images/
```

### New Angular Structure
```
src/
├── app/
│   ├── components/
│   │   ├── header/
│   │   ├── intro/
│   │   ├── about/
│   │   ├── works/
│   │   ├── contact/
│   │   └── footer/
│   ├── services/
│   │   ├── portfolio.service.ts
│   │   ├── scroll.service.ts
│   │   └── animation.service.ts
│   ├── models/
│   ├── app.component.*
│   └── app.routes.ts
├── environments/
├── index.html
├── main.ts
├── styles.scss
└── test.ts
```

## Key Features

✅ **Component-Based Architecture**: Each section is its own standalone component
✅ **Responsive Design**: Mobile-first approach maintained
✅ **Animations**: anime.js integrated for smooth transitions
✅ **Services**: Centralized data management with portfolio service
✅ **Type Safety**: Full TypeScript support
✅ **SCSS**: Advanced styling with variables and mixins
✅ **Routing**: Angular Router for smooth navigation
✅ **Standalone Components**: Latest Angular architecture

## Installation & Setup

### Prerequisites
- Node.js v18+
- npm v9+ (or yarn)
- Angular CLI (optional, but recommended): `npm install -g @angular/cli@17`

### Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```
   The app will be available at `http://localhost:4200`

3. **Build for Production**
   ```bash
   npm run build
   ```
   Output will be in `dist/amaykadakia-portfolio/`

## Project Architecture

### Components

#### HeaderComponent
- Responsive navigation
- Mobile menu toggle
- Smooth section navigation

#### IntroComponent
- Hero section with title
- Social media links
- Scroll indicator

#### AboutComponent
- Professional bio
- Experience timeline (6 entries)
- Education timeline (3 entries)
- Skills grid (21 skills)
- Certifications (HackerRank & IBM)

#### WorksComponent
- Project portfolio gallery
- Interactive modals for project details
- GitHub stats integration
- LeetCode stats display

#### ContactComponent
- Contact information
- Email and phone links
- Social media links

#### FooterComponent
- Copyright notice
- Scroll to top button

### Services

#### PortfolioService
- Manages all portfolio data
- Exposes RxJS Observables for components
- Contains methods for different data sections

#### ScrollService
- Handles smooth scrolling to sections
- Manages scroll to top
- Integrates with Router

#### AnimationService
- Manages anime.js animations
- Page load animations
- Scroll-based element animations

## Data Management

All portfolio data is stored in the `PortfolioService`. To update information:

### Update Projects
```typescript
// In portfolio.service.ts, getPortfolioData() method
private getPortfolioData(): Portfolio[] {
  return [
    {
      id: 'project-id',
      title: 'Project Title',
      category: 'Category',
      description: 'Description',
      image: 'path/to/image',
      tags: ['tag1', 'tag2'],
      link?: 'https://...',
      githubLink?: 'https://github.com/...'
    }
  ];
}
```

### Update Experience
```typescript
// In portfolio.service.ts, getExperienceData() method
private getExperienceData(): TimelineEntry[] {
  return [
    {
      title: 'Company Name',
      subtitle: 'Job Title',
      timeframe: 'Start - End',
      description: ['Description point 1', 'Description point 2']
    }
  ];
}
```

### Update Skills
```typescript
// In portfolio.service.ts, getSkillsData() method
private getSkillsData(): Skill[] {
  return [
    { name: 'Skill Name' }
  ];
}
```

## Styling

### Global Styles
- `src/styles.scss`: Contains all global CSS and imported CSS from original files

### Component Styles
Each component has its own SCSS file:
- `src/app/components/*/component-name.component.scss`

### CSS Variables
Key color variables:
```scss
--color-1: #eabe7c (Primary accent)
--color-2: #23967f (Secondary accent)
--color-gray-10: #101112 (Background)
--color-white: #ffffff
--color-text: #a1a1a2
```

## Animations

### Page Load Animation
Automatically triggered in `AppComponent.ngOnInit()`:
- Preloader fades out
- Header slides in
- Intro title animates

### Scroll-Based Animations
Elements with `[data-animate-el]` attribute animate into view when scrolled to.

## Deployment

### Build Output
```bash
npm run build
```

### Deploy to Production
The `dist/amaykadakia-portfolio/` folder can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- Any static hosting service

### Environment Variables
Update in `src/environments/environment.prod.ts` for production settings.

## Troubleshooting

### Port Already in Use
```bash
ng serve --port 4300
```

### Styles Not Loading
Ensure global styles are loaded in `angular.json`:
```json
"styles": ["src/styles.scss"]
```

### Images Not Loading
Ensure image paths are relative to `src/assets/` or update paths in components.

### Animations Not Working
- Ensure anime.js is installed: `npm install anime`
- Check browser console for errors
- Verify animation service is initialized in AppComponent

## Next Steps

1. **Install Dependencies**: `npm install`
2. **Start Development**: `npm start`
3. **Update Your Data**: Edit `src/app/services/portfolio.service.ts`
4. **Customize Styles**: Edit component SCSS files
5. **Test**: Navigate through all sections
6. **Build & Deploy**: `npm run build` and deploy `dist/` folder

## File Checklist

Core Angular Files:
- ✅ `package.json` - Dependencies
- ✅ `angular.json` - Build configuration
- ✅ `tsconfig.json` - TypeScript configuration
- ✅ `src/main.ts` - Bootstrap file
- ✅ `src/index.html` - Entry HTML

App Files:
- ✅ `src/app/app.component.ts` - Root component
- ✅ `src/app/app.routes.ts` - Routing
- ✅ `src/app/components/` - All 6 components
- ✅ `src/app/services/` - 3 services
- ✅ `src/app/models/` - TypeScript models

Styling:
- ✅ `src/styles.scss` - Global styles
- ✅ Component SCSS files - Component styles

## Additional Resources

- [Angular Official Docs](https://angular.io/docs)
- [Angular CLI](https://angular.io/cli)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [SCSS Documentation](https://sass-lang.com/documentation)
- [anime.js Documentation](https://animejs.com/)

## Support

For issues or questions about the conversion, refer to the original HTML/CSS structure in `index.html`, `css/styles.css` for reference.

---

**Conversion Date**: January 21, 2026
**Angular Version**: 17.0.0+
**Node Version**: 18.0.0+
