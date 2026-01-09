export interface GameQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface TriviaAPIResponse {
  results: Array<{
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
    category: string;
    difficulty: string;
  }>;
}