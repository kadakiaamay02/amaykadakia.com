import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Portfolio, TimelineEntry, Skill, Certification } from '../models/portfolio.model';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private portfolioData = new BehaviorSubject<Portfolio[]>(this.getPortfolioData());
  private experienceData = new BehaviorSubject<TimelineEntry[]>(this.getExperienceData());
  private educationData = new BehaviorSubject<TimelineEntry[]>(this.getEducationData());
  private skillsData = new BehaviorSubject<Skill[]>(this.getSkillsData());
  private certificationsData = new BehaviorSubject<Certification[]>(this.getCertificationsData());

  portfolio$ = this.portfolioData.asObservable();
  experience$ = this.experienceData.asObservable();
  education$ = this.educationData.asObservable();
  skills$ = this.skillsData.asObservable();
  certifications$ = this.certificationsData.asObservable();

  constructor() {}

  private getPortfolioData(): Portfolio[] {
    return [
      {
        id: 'crud-webapp',
        title: 'CRUD Web-app',
        category: 'A Python Flask Web-app',
        description: 'Designed and developed a functional CRUD web application using Python Flask, SQLite, and SqlAlchemy. Incorporated features like update, delete and search to increase efficiency of the team by 20%.',
        image: 'images/portfolio/amdocs--600.png',
        tags: ['web-app', 'python'],
        link: '#'
      },
      {
        id: 'portfolio-website',
        title: 'Amay Kadakia portfolio website',
        category: 'Responsive Web page',
        description: 'This was a personal project, where I created this webpage that displays my portfolio.',
        image: 'square-512x512.png',
        tags: ['Responsive webpage'],
        githubLink: 'https://github.com/kadakiaamay02/amaykadakia.com'
      },
      {
        id: 'binbuddy',
        title: 'BinBuddy',
        category: 'Multi-Platform Web-app',
        description: 'BinBuddy is a Multi-Platform application built using Angular, Ionic framework and Mapbox that tracks the current location of a garbage truck and lets a home owner/resident know how far the truck is and also reminding them about the next day\'s trash pick-ups.',
        image: 'images/portfolio/BinBuddyLogo.png',
        tags: ['Angular', 'Ionic', 'Google FireBase', 'Mapbox'],
        link: 'https://blog.uta.edu/cseseniordesign/2022/06/22/bin-buddy/'
      },
      {
        id: 'thermi',
        title: 'Thermi',
        category: 'IOS application',
        description: 'Provides users with energy-saving tips and suggestions based on the user\'s outside, inside, and desired temperatures. 3rd place winner at IBM Good Tech Scholars program',
        image: 'images/portfolio/thermi.png',
        tags: ['IBM', 'IOS application'],
        githubLink: 'https://github.com/kadakiaamay02/IBM-Good-Tech-Scholars-Program'
      },
      {
        id: 'mavs-abroad',
        title: 'Mavs Abroad',
        category: 'Progresive Web-app',
        description: 'Developed a PWA that lets the students of UT Arlington\'s study abroad communications class travelling to Japan view the itinerary and play audios of basic Japanese translations in offline mode. This PWA was chosen to be used by the UTA\'s Study abroad team among 5 other teams that worked on this application.',
        image: 'images/portfolio/uta.png',
        tags: ['PWA', 'Drupal'],
        githubLink: 'https://github.com/shubshres/CSE-3311-Team-4'
      },
      {
        id: 'financialwise',
        title: 'FinancialWise',
        category: 'Android application',
        description: 'Created a completely functional android application for personal expense management app to follow the 50/30/20 budgeting rule. Integrated the application with Firebase data systems.',
        image: 'images/portfolio/fw.png',
        tags: ['Andriod Application', 'Product Design'],
        githubLink: 'https://github.com/kadakiaamay02/FinacialWise'
      }
    ];
  }

  private getExperienceData(): TimelineEntry[] {
    return [
      {
        title: 'Fidelity Investments',
        subtitle: 'Senior Frontend developer',
        timeframe: 'October 2025 - Present',
        description: [
          'Responsible for maintaining an enterprise-wide Angular monorepo used across multiple business units, ensuring code quality, consistency, and seamless integration of new features and updates.'
        ]
      },
      {
        title: 'Fidelity Investments',
        subtitle: 'Full-stack Engineer',
        timeframe: 'July 2024 - October 2025',
        description: [
          'Architected and designed a scalable, modular Angular application to streamline the participant verification process, incorporating best practices for front-end development, component-driven architecture, and performance optimization.',
          'Integrated GraphQL with Apollo to enable efficient and flexible data retrieval, reducing API response times and improving overall application responsiveness.',
          'Facilitated and supported production deployments, ensuring smooth rollouts and providing post-installation support to address any issues or optimizations.'
        ]
      },
      {
        title: 'Fidelity Investments',
        subtitle: 'Associate Software Engineer',
        timeframe: 'January 2023 - June 2024',
        description: [
          'Contributed to an Agile team developing an Angular application integrated with a Java API, aimed at enhancing Fidelity\'s customer service capabilities for improved customer satisfaction.',
          'Implemented E2E tests and unit tests using Playwright and Jasmine Karma to ensure application functionality.',
          'Actively participated in cross-functional collaboration, gathering and advocating user feedback to drive continuous improvement and align technical solutions with business product goals.'
        ]
      },
      {
        title: 'Amdocs, Inc. - AT&T',
        subtitle: 'Software Engineer Intern',
        timeframe: 'June 2022 - August 2022',
        description: [
          'Designed and developed a functional CRUD web application using Python Flask, SQLite, and SqlAlchemy. Incorporated features like update, delete and search to increase efficiency of the team by 20%.'
        ]
      },
      {
        title: 'UT Arlington Scholarships office',
        subtitle: 'Student Assistant',
        timeframe: 'August 2021 - September 2022',
        description: []
      },
      {
        title: 'IBM Good Tech Scholars program',
        subtitle: 'Participant - 3rd Place winner',
        timeframe: 'May 2021 - June 2021',
        description: ['Project: Thermi']
      }
    ];
  }

  private getEducationData(): TimelineEntry[] {
    return [
      {
        title: 'Georgia Institute of Technology',
        subtitle: 'Master of Science in Computer Science',
        timeframe: 'January 2024 - Present',
        description: ['Specialization: Computing Systems']
      },
      {
        title: 'University of Texas, Arlington',
        subtitle: 'Bachelor of Science in Computer Science',
        timeframe: 'August 2021 - December 2022',
        description: [
          'Operating systems, Linear Algebra, Computer Networks, Introduction to Software Engineering, Object-oriented Software Engineering, Databases, Professional Practices, Programming Languages, Software Project Management, Software Design Patterns, Information Security, Artificial Intelligence, Software Testing and Maintenance, Graphics'
        ]
      },
      {
        title: 'Ohlone College',
        subtitle: '',
        timeframe: 'August 2018 - August 2020',
        description: [
          'Introduction to Programing in C++, Introduction to Programing in Java, Object-oriented programming in C++, Programing with Data structures, Discrete structures, Unix/Linux, Assembly language programing'
        ]
      }
    ];
  }

  private getSkillsData(): Skill[] {
    return [
      { name: 'Angular' },
      { name: 'Playwright' },
      { name: 'Jenkins' },
      { name: 'Java' },
      { name: 'HTML' },
      { name: 'CSS' },
      { name: 'AWS' },
      { name: 'MySQL Workbench' },
      { name: 'Figma' },
      { name: 'SQLite' },
      { name: 'SqlAlchemy' },
      { name: 'React' },
      { name: 'Python' },
      { name: 'Flask' },
      { name: 'Ionic' },
      { name: 'Android studio' },
      { name: 'Drupal' },
      { name: 'linux' },
      { name: 'Azure' },
      { name: 'C++' },
      { name: 'C' }
    ];
  }

  private getCertificationsData(): Certification[] {
    return [
      {
        organization: 'HackerRank',
        certifications: [
          { title: 'Angular (Intermediate)', link: 'https://www.hackerrank.com/certificates/iframe/173a01159fc7' },
          { title: 'Angular (Basic)', link: 'https://www.hackerrank.com/certificates/iframe/a113a598493b' },
          { title: 'Python (Basic)', link: 'https://www.hackerrank.com/certificates/iframe/8ddc26928670' },
          { title: 'SQL (Basic)', link: 'https://www.hackerrank.com/certificates/iframe/622f360efcc2' },
          { title: 'SQL (Intermediate)', link: 'https://www.hackerrank.com/certificates/iframe/95eea452a2c1' }
        ]
      },
      {
        organization: 'IBM',
        certifications: [
          { title: 'Cloud Essentials', link: 'https://www.credly.com/badges/ea499b1a-a793-4199-9f64-f265492a4c87' },
          { title: 'Enterprise Design Thinking Practitioner', link: 'https://www.credly.com/badges/39810390-5c43-41cf-89bf-03a3b105ede9' },
          { title: 'Working in a Digital World: Professional Skills', link: 'https://www.credly.com/badges/3dea4d27-2822-4011-a055-375f2a933e10' }
        ]
      }
    ];
  }
}
