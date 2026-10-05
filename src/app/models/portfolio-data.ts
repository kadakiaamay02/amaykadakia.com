import {
  Project,
  WorkExperience,
  EducationModel,
  Skill,
  Certification,
} from "../models/portfolio.model";

export const PORTFOLIO_PROJECTS: Project[] = [
  {
    id: "led-matrix-dashboard",
    title: "Smart LED Matrix Dashboard",
    category: "IoT & Embedded",
    description:
      "A Raspberry Pi–driven 128×64 LED display backed by a custom Flask API. It turns live aircraft, weather alerts, smart-home sensor events, notes and sports scores into an always-on ambient dashboard.",
    image: "",
    tags: [
      "Python",
      "Flask",
      "Raspberry Pi",
      "REST API",
      "SQLite",
      "IoT",
      "Pillow",
      "systemd",
    ],
    details: `A two-part system: a Flask backend gathers data from public APIs and smart-home sensors, and a Raspberry Pi renders it on a 128×64 RGB LED matrix through a scene-based display engine.

The panel rotates through live aircraft overhead (airline, route, aircraft type and a radar view), weather and severe-weather alerts that take over the whole screen when something serious is issued, smart-home sensor events and doors left open, upcoming due dates with colour-coded countdowns, live cricket scores, and a daily joke and "on this day" fact when things are quiet. At night it dims and shows only the clock. A thermal receipt printer turns saved notes into physical printouts.

Under the hood, a scene manager drives a non-blocking animation loop with priority interrupts instead of blocking sleeps. Background polling uses caching, adaptive intervals and rate-limit awareness so the display keeps working when an upstream service fails, and restart-safe caching avoids wasting limited API quotas. It runs as a systemd service, with a single-instance lock to protect the hardware, and the server and display live on separate devices.`,
  },
  {
    id: "crud-webapp",
    title: "CRUD Web-app",
    category: "A Python Flask Web-app",
    image: "/app/images/portfolio/amdocs--600.png",
    description: "Python Flask Web Application",
    details:
      "Designed and developed a functional CRUD web application using Python Flask, SQLite, and SqlAlchemy. Incorporated features like update, delete and search, to increase efficiency of the team by 20%.",
    tags: ["web-app", "python", "Flask", "SQLite"],
  },
  {
    id: "portfolio-website",
    title: "amaykadakia.com",
    category: "Responsive Web page",
    image: "/app/images/portfolio/square-512x512.png",
    description: "Personal Portfolio Website",
    details:
      "This was a personal project, where I created this webpage that displays my portfolio. A fully responsive website showcasing my work and skills.",
    tags: ["Responsive", "HTML", "CSS", "Angular", "TypeScript"],
    link: "https://github.com/kadakiaamay02/amaykadakia.com",
  },
  {
    id: "binbuddy",
    title: "BinBuddy",
    category: "Multi-Platform Web-app",
    image: "/app/images/portfolio/BinBuddyLogo.png",
    description: "Garbage Truck Tracking Application",
    details:
      "BinBuddy is a Multi-Platform application built using Angular, Ionic framework and Mapbox that tracks the current location of a garbage truck and lets a home owner/resident know how far the truck is and also reminding them about the next day's trash pick-ups.",
    tags: ["Angular", "Ionic", "Google Firebase", "Mapbox"],
    link: "https://blog.uta.edu/cseseniordesign/2022/06/22/bin-buddy/",
  },
  {
    id: "thermi",
    title: "Thermi",
    category: "iOS application",
    image: "/app/images/portfolio/thermi.png",
    description: "Energy-Saving Tips Application",
    details:
      "Provides users with energy-saving tips and suggestions based on the user's outside, inside, and desired temperatures. 3rd place winner at IBM Good Tech Scholars program.",
    tags: ["IBM", "iOS", "Swift"],
    link: "https://github.com/kadakiaamay02/IBM-Good-Tech-Scholars-Program",
  },
  {
    id: "mavs-abroad",
    title: "Mavs Abroad",
    category: "Progressive Web-app",
    image: "/app/images/portfolio/uta.png",
    description: "Study Abroad Itinerary App",
    details:
      "Developed a PWA that lets the students of UT Arlington's study abroad communications class travelling to Japan view the itinerary and play audios of basic Japanese translations in offline mode. This PWA was chosen to be used by the UTA's Study abroad team among 5 other teams that worked on this application.",
    tags: ["PWA", "Drupal", "JavaScript"],
    link: "https://github.com/shubshres/CSE-3311-Team-4",
  },
  {
    id: "financialwise",
    title: "FinancialWise",
    category: "Android application",
    image: "/app/images/portfolio/fw.png",
    description: "Personal Expense Management App",
    details:
      "Created a completely functional android application for personal expense management app to follow the 50/30/20 budgeting rule. Integrated the application with Firebase data systems.",
    tags: ["Android", "Firebase", "Java"],
    link: "https://github.com/kadakiaamay02/FinacialWise",
  },
];

export const EXPERIENCE_DATA: WorkExperience[] = [
  {
    company: "Fidelity Investments",
    role: "Senior Frontend Developer",
    period: "October 2025 - Present",
    description: [
      "Responsible for maintaining an enterprise-wide Angular monorepo used across multiple business units, ensuring code quality, consistency, and seamless integration of new features and updates.",
    ],
  },
  {
    company: "Fidelity Investments",
    role: "Full-stack Engineer",
    period: "July 2024 - October 2025",
    description: [
      "Architected and designed a scalable, modular Angular application to streamline the participant verification process, incorporating best practices for front-end development, component-driven architecture, and performance optimization.",
      "Integrated GraphQL with Apollo to enable efficient and flexible data retrieval, reducing API response times and improving overall application responsiveness.",
      "Facilitated and supported production deployments, ensuring smooth rollouts and providing post-installation support to address any issues or optimizations.",
    ],
  },
  {
    company: "Fidelity Investments",
    role: "Associate Software Engineer",
    period: "January 2023 - June 2024",
    description: [
      "Contributed to an Agile team developing an Angular application integrated with a Java API, aimed at enhancing Fidelity's customer service capabilities for improved customer satisfaction.",
      "Implemented E2E tests and unit tests using Playwright and Jasmine Karma to ensure application functionality.",
      "Actively participated in cross-functional collaboration, gathering and advocating user feedback to drive continuous improvement and align technical solutions with business product goals.",
    ],
  },
  {
    company: "Amdocs, Inc. - AT&T",
    role: "Software Engineer Intern",
    period: "June 2022 - August 2022",
    description: [
      "Designed and developed a functional CRUD web application using Python Flask, SQLite, and SQLAlchemy. Incorporated features like update, delete and search to increase efficiency of the team by 20%.",
    ],
  },
  {
    company: "IBM Good Tech Scholars Program",
    role: "Participant - 3rd Place Winner",
    period: "May 2021 - June 2021",
    description: ["Project: Thermi"],
  },
];

export const EDUCATION_DATA: EducationModel[] = [
  {
    school: "Georgia Institute of Technology",
    degree: "Master of Science in Computer Science",
    period: "January 2024 - Present",
    description: ["Specialization: Computing Systems"],
  },
  {
    school: "University of Texas at Arlington",
    degree: "Bachelor of Science in Computer Science",
    period: "August 2021 - December 2022",
    description: [
      "Operating Systems, Linear Algebra, Computer Networks, Introduction to Software Engineering, Object-Oriented Software Engineering, Databases, Professional Practices, Programming Languages, Software Project Management, Software Design Patterns, Information Security, Artificial Intelligence, Software Testing and Maintenance, Graphics",
    ],
  },
  {
    school: "Ohlone College",
    degree: "",
    period: "August 2018 - August 2020",
    description: [
      "Introduction to Programming in C++, Introduction to Programming in Java, Object-Oriented Programming in C++, Programming with Data Structures, Discrete Structures, Unix/Linux, Assembly Language Programming",
    ],
  },
];

export const SKILLS_DATA: Skill[] = [
  { name: "Angular", category: "Frontend" },
  { name: "Nx", category: "Frontend" },
  { name: "TypeScript", category: "Frontend" },
  { name: "JavaScript", category: "Frontend" },
  { name: "React", category: "Frontend" },
  { name: "HTML", category: "Frontend" },
  { name: "CSS", category: "Frontend" },
  { name: "Ionic", category: "Frontend" },

  { name: "Java", category: "Backend" },
  { name: "Python", category: "Backend" },
  { name: "Flask", category: "Backend" },
  { name: "C++", category: "Backend" },
  { name: "C", category: "Backend" },

  { name: "MySQL Workbench", category: "Data" },
  { name: "SQLite", category: "Data" },
  { name: "SQLAlchemy", category: "Data" },

  { name: "AWS", category: "Cloud & DevOps" },
  { name: "Azure", category: "Cloud & DevOps" },
  { name: "Jenkins", category: "Cloud & DevOps" },
  { name: "Linux", category: "Cloud & DevOps" },

  { name: "Playwright", category: "Testing & tools" },
  { name: "Figma", category: "Testing & tools" },
  { name: "Android Studio", category: "Testing & tools" },
  { name: "Drupal", category: "Testing & tools" },
];

export const CERTIFICATIONS_DATA: Certification[] = [
  {
    organization: "HackerRank",
    certifications: [
      { title: "Angular (Intermediate)", link: "https://www.hackerrank.com/certificates/iframe/173a01159fc7" },
      { title: "Angular (Basic)", link: "https://www.hackerrank.com/certificates/iframe/a113a598493b" },
      { title: "Python (Basic)", link: "https://www.hackerrank.com/certificates/iframe/8ddc26928670" },
      { title: "SQL (Intermediate)", link: "https://www.hackerrank.com/certificates/iframe/95eea452a2c1" },
      { title: "SQL (Basic)", link: "https://www.hackerrank.com/certificates/iframe/622f360efcc2" },
    ],
  },
  {
    organization: "IBM",
    certifications: [
      { title: "Cloud Essentials", link: "https://www.credly.com/badges/ea499b1a-a793-4199-9f64-f265492a4c87" },
      { title: "Enterprise Design Thinking Practitioner", link: "https://www.credly.com/badges/39810390-5c43-41cf-89bf-03a3b105ede9" },
      { title: "Working in a Digital World: Professional Skills", link: "https://www.credly.com/badges/3dea4d27-2822-4011-a055-375f2a933e10" },
    ],
  },
];