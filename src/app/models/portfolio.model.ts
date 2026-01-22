export interface Portfolio {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
  githubLink?: string;
}

export interface TimelineEntry {
  title: string;
  subtitle: string;
  timeframe: string;
  description: string[];
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
