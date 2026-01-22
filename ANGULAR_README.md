# Amay Kadakia's Portfolio - Angular Version

This is an Angular-based portfolio website showcasing professional experience, education, skills, and projects.

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── header/          # Navigation header
│   │   ├── intro/           # Landing section
│   │   ├── about/           # About, experience, education, skills
│   │   ├── works/           # Project portfolio with modals
│   │   ├── contact/         # Contact information
│   │   └── footer/          # Footer
│   ├── services/
│   │   ├── portfolio.service.ts    # Portfolio data management
│   │   ├── scroll.service.ts       # Smooth scrolling
│   │   └── animation.service.ts    # Animations using anime.js
│   ├── models/
│   │   └── portfolio.model.ts      # TypeScript interfaces
│   ├── app.component.ts            # Root component
│   └── app.routes.ts               # Routing configuration
├── index.html                      # Main HTML
├── main.ts                        # Entry point
└── styles.scss                    # Global styles
```

## Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Smooth Animations**: Uses anime.js for smooth transitions and page load animations
- **Scroll-based Navigation**: Click to navigate to different sections
- **Project Portfolio**: Display projects in an interactive modal gallery
- **Timeline Views**: Experience and education timelines
- **Skills Showcase**: Display technical skills and certifications
- **Dark Theme**: Modern dark theme with accent colors

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Navigate to `http://localhost:4200/`

The application will automatically reload if you change any of the source files.

## Building for Production

Run the build command to compile the project:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Technologies Used

- **Angular 17+**: Modern web framework
- **TypeScript**: Type-safe JavaScript
- **SCSS**: Advanced styling
- **anime.js**: Animation library
- **RxJS**: Reactive programming
- **Standalone Components**: Latest Angular architecture

## Component Breakdown

### Header Component
- Responsive navigation menu
- Mobile menu toggle
- Smooth navigation to sections

### Intro Component
- Landing section with title and introduction
- Social media links
- Scroll indicator

### About Component
- Professional overview
- Experience timeline
- Education timeline
- Skills grid
- Certifications list

### Works Component
- Project portfolio gallery
- Interactive project modals
- GitHub stats integration
- LeetCode stats display

### Contact Component
- Contact information
- Email and phone links
- Social media links

### Footer Component
- Copyright information
- Scroll to top button

## Services

### PortfolioService
Manages all portfolio data including projects, experience, education, skills, and certifications.

### ScrollService
Handles smooth scrolling to page sections and scroll-to-top functionality.

### AnimationService
Manages animations using anime.js for page load and scroll-based element animations.

## Customization

### Adding New Projects
Edit the `getPortfolioData()` method in `src/app/services/portfolio.service.ts`

### Updating Experience/Education
Edit the `getExperienceData()` and `getEducationData()` methods in the portfolio service

### Modifying Colors and Styles
Update the CSS custom properties in `src/styles.scss` or component-specific SCSS files

## License

© 2024 Amay Kadakia. All rights reserved.

## Contact

- Email: amaykadakia@gmail.com
- LinkedIn: [Amay Kadakia](https://www.linkedin.com/in/amaykadakia/)
- GitHub: [kadakiaamay02](https://github.com/kadakiaamay02)
