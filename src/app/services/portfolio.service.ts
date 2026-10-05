import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Project, EducationModel, Skill, Certification, WorkExperience } from '../models/portfolio.model';
import { PORTFOLIO_PROJECTS, EXPERIENCE_DATA, EDUCATION_DATA, SKILLS_DATA, CERTIFICATIONS_DATA } from '../models/portfolio-data';
@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private portfolioData = new BehaviorSubject<Project[]>(this.getPortfolioData());
  private experienceData = new BehaviorSubject<WorkExperience[]>(this.getExperienceData());
  private educationData = new BehaviorSubject<EducationModel[]>(this.getEducationData());
  private skillsData = new BehaviorSubject<Skill[]>(this.getSkillsData());
  private certificationsData = new BehaviorSubject<Certification[]>(this.getCertificationsData());

  portfolio$ = this.portfolioData.asObservable();
  experience$ = this.experienceData.asObservable();
  education$ = this.educationData.asObservable();
  skills$ = this.skillsData.asObservable();
  certifications$ = this.certificationsData.asObservable();

  constructor() {}

  private getPortfolioData(): Project[] {
    return PORTFOLIO_PROJECTS;
  }

  private getExperienceData(): WorkExperience[] {
    return EXPERIENCE_DATA;
  }

  private getEducationData(): EducationModel[] {
    return EDUCATION_DATA;
    
  };

  private getSkillsData(): Skill[] {
    return SKILLS_DATA;
  }

  private getCertificationsData(): Certification[] {
    return CERTIFICATIONS_DATA;
  }
}
