export interface Candidate {
  userId: string;
  name: string;
  skills: string[];
  experience: number;
  avgScore?: string;
  resumePath: string;
  statistics: {
    avgScore?: string;
    roundScores: RoundScore[];
  };
  interviewResults: InterviewResult[];
  createdAt?: string;
}

export interface RoundScore {
  round: number;
  avgScore: string;
  questionsAnswered: number;
}

export interface InterviewResult {
  round: number;
  question: string;
  answer: string;
  score: string;
  feedback: string;
}
