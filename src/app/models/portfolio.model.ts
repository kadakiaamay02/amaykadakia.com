export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
  details?: string;
  githubLink?: string;
}

export interface Skill {
  name: string;
  category?: string;
}

export interface Certification {
  organization: string;
  certifications: {
    title: string;
    link: string;
  }[];
}

export interface WorkExperience {
  company: string;
  role: string;
  period: string;
  description: string[];
}

export interface EducationModel {
  school: string;
  degree: string;
  period: string;
  description: string[];
}