export interface Feedback {
  overallScore: number;
  ATS: { score: number; tips: any[] };
  toneAndStyle: { score: number; tips: any[] };
  content: { score: number; tips: any[] };
  structure: { score: number; tips: any[] };
  skills: { score: number; tips: any[] };
}
