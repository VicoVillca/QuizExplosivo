import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GameQuestion } from '../models/code-block.model';
import { QUESTION_ANIMAL } from '../constants/question-animal.constant';
import { QUESTION_ARTE } from '../constants/question-arte.constant';
import { QUESTION_CIENCIA } from '../constants/question-ciencia.constant';
import { QUESTION_CINE } from '../constants/question-cine.constant';
import { QUESTION_CULTURA } from '../constants/question-cultura.constant';
import { QUESTION_CURIOCIDAD } from '../constants/question-curiocidad.constant';
import { QUESTION_DEPORTE } from '../constants/question-deporte.constant';
import { QUESTION_GEOGRAFIA } from '../constants/question-geografia.constant';
import { QUESTION_HISTORIA } from '../constants/question-historia.constant';
import { QUESTION_LITERATURA } from '../constants/question-literatura.constant';
import { QUESTION_MUSICA } from '../constants/question-musica.constant';
import { QUESTION_NATURALEZA } from '../constants/question-naturaleza.constant';
import { QUESTION_SOCIEDAD } from '../constants/question-sociedad.constant';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  private categories: any[] = [
    QUESTION_ANIMAL,
    QUESTION_ARTE,
    QUESTION_CIENCIA,
    QUESTION_CINE,
    QUESTION_CULTURA,
    QUESTION_CURIOCIDAD,
    QUESTION_DEPORTE,
    QUESTION_GEOGRAFIA,
    QUESTION_HISTORIA,
    QUESTION_LITERATURA,
    QUESTION_MUSICA,
    QUESTION_NATURALEZA,
    QUESTION_SOCIEDAD
  ];

  private usedQuestionIds: Set<number> = new Set();

  constructor() {}

  getQuestion(): Observable<GameQuestion> {
    return of(this.getRandomSpanishQuestion());
  }

  getArrayQuestionAleatory() {
    
  }

  private getRandomSpanishQuestion(): GameQuestion {
    const randomCategoryIndex = Math.floor(Math.random() * this.categories.length);
    const spanishQuestions = this.categories[randomCategoryIndex];

    const availableQuestions = spanishQuestions.filter(
      (q:any) => !this.usedQuestionIds.has(q.id)
    );
    
    let question: GameQuestion;
    
    if (availableQuestions.length === 0) {
      this.usedQuestionIds.clear();
      question = spanishQuestions[
        Math.floor(Math.random() * spanishQuestions.length)
      ];
    } else {
      question = availableQuestions[
        Math.floor(Math.random() * availableQuestions.length)
      ];
    }
    
    this.usedQuestionIds.add(question.id);
    let respuestaOriginal = question.options[question.correctAnswerIndex];
    
    question.options = this.shuffleArray([...question.options]);
    question.correctAnswerIndex = question.options.indexOf(respuestaOriginal!);
    
    return question;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  resetUsedQuestions(): void {
    this.usedQuestionIds.clear();
  }

  addQuestion(newQuestion: GameQuestion): void {
    const allQuestions = this.categories.flat();
    allQuestions.push({
      ...newQuestion,
      id: Date.now()
    });
  }
}