export interface InterviewQuestion {
  question: string;
  skill: string;
}

export interface InterviewEvaluation {
  score: number;
  critique: string;
  perfectAnswer: string;
}

export interface InterviewState {
  status: 'idle' | 'loading_question' | 'answering' | 'evaluating' | 'feedback';
  question: string | null;
  evaluation: InterviewEvaluation | null;
  error: string | null;
}
