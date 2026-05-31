export interface Message {
  role: 'user' | 'model';
  content: string;
}

export interface Project {
  name: string;
  techStack: string[];
  bullets: string[];
}

export interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
  };
  summary: string;
  skills: string[];
  projects: Project[];
}
