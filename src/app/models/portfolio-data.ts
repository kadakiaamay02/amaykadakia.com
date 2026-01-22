import { Portfolio } from '../services/modal.service';

export const PORTFOLIO_PROJECTS: Portfolio[] = [
  {
    id: 'crud-webapp',
    title: 'CRUD Web-app',
    category: 'A Python Flask Web-app',
    image: '/app/images/portfolio/amdocs--600.png',
    description: 'Python Flask Web Application',
    details: 'Designed and developed a functional CRUD web application using Python Flask, SQLite, and SqlAlchemy. Incorporated features like update, delete and search, to increase efficiency of the team by 20%.',
    tags: ['web-app', 'python', 'Flask', 'SQLite']
  },
  {
    id: 'portfolio-website',
    title: 'amaykadakia.com',
    category: 'Responsive Web page',
    image: '/app/images/portfolio/square-512x512.png',
    description: 'Personal Portfolio Website',
    details: 'This was a personal project, where I created this webpage that displays my portfolio. A fully responsive website showcasing my work and skills.',
    tags: ['Responsive', 'HTML', 'CSS', 'JavaScript'],
    link: 'https://github.com/kadakiaamay02/amaykadakia.com'
  },
  {
    id: 'binbuddy',
    title: 'BinBuddy',
    category: 'Multi-Platform Web-app',
    image: '/app/images/portfolio/BinBuddyLogo.png',
    description: 'Garbage Truck Tracking Application',
    details: 'BinBuddy is a Multi-Platform application built using Angular, Ionic framework and Mapbox that tracks the current location of a garbage truck and lets a home owner/resident know how far the truck is and also reminding them about the next day\'s trash pick-ups.',
    tags: ['Angular', 'Ionic', 'Google Firebase', 'Mapbox'],
    link: 'https://blog.uta.edu/cseseniordesign/2022/06/22/bin-buddy/'
  },
  {
    id: 'thermi',
    title: 'Thermi',
    category: 'iOS application',
    image: '/app/images/portfolio/thermi.png',
    description: 'Energy-Saving Tips Application',
    details: 'Provides users with energy-saving tips and suggestions based on the user\'s outside, inside, and desired temperatures. 3rd place winner at IBM Good Tech Scholars program.',
    tags: ['IBM', 'iOS', 'Swift'],
    link: 'https://github.com/kadakiaamay02/IBM-Good-Tech-Scholars-Program'
  },
  {
    id: 'mavs-abroad',
    title: 'Mavs Abroad',
    category: 'Progressive Web-app',
    image: '/app/images/portfolio/uta.png',
    description: 'Study Abroad Itinerary App',
    details: 'Developed a PWA that lets the students of UT Arlington\'s study abroad communications class travelling to Japan view the itinerary and play audios of basic Japanese translations in offline mode. This PWA was chosen to be used by the UTA\'s Study abroad team among 5 other teams that worked on this application.',
    tags: ['PWA', 'Drupal', 'JavaScript'],
    link: 'https://github.com/shubshres/CSE-3311-Team-4'
  },
  {
    id: 'financialwise',
    title: 'FinancialWise',
    category: 'Android application',
    image: '/app/images/portfolio/fw.png',
    description: 'Personal Expense Management App',
    details: 'Created a completely functional android application for personal expense management app to follow the 50/30/20 budgeting rule. Integrated the application with Firebase data systems.',
    tags: ['Android', 'Firebase', 'Java'],
    link: 'https://github.com/kadakiaamay02/FinacialWise'
  }
];
