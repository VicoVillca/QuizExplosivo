import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { Subscription, interval } from "rxjs";

import { GameStateService } from "../../../core/services/game-state.service";
import { QuestionsService } from "../../../core/services/questions.service";
import { GameQuestion } from "../../../core/models/code-block.model";
import { labels } from "../../../core/constants/labels.constants";
import { messages } from "../../../core/constants/messages.constants";

interface BombSpeedConfig {
  threshold: number;
  speed: number;
  interval: number;
  volume: number;
}

@Component({
  selector: "app-game-board",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    ProgressSpinnerModule,
  ],
  templateUrl: "./game-board.component.html",
  styleUrls: ["./game-board.component.scss"],
})
export class GameBoardComponent implements OnInit, OnDestroy {
  labels = labels;
  messages = messages;

  currentQuestion: GameQuestion | null = null;
  selectedAnswerIndex: number | null = null;
  answered: boolean = false;
  isCorrect: boolean = false;

  private initialBombTime: number = 180;
  bombTime: number = 180;
  bombRemaining: number = 180;
  bombSubscription: Subscription | null = null;
  isFirstQuestion: boolean = true;

  private bombSpeedMatrix: BombSpeedConfig[] = [
    // Primeros minutos: 1 tick por segundo
    { threshold: 180, speed: 1.0, interval: 1000, volume: 0.4 }, // 3:00 - 2:00
    { threshold: 120, speed: 1.0, interval: 1000, volume: 0.5 }, // 2:00 - 1:00

    // A partir de 1 minuto: empieza a acelerar
    { threshold: 90, speed: 1.1, interval: 909, volume: 0.55 }, // 1:30 - 1:00
    { threshold: 75, speed: 1.2, interval: 833, volume: 0.6 }, // 1:15 - 1:00
    { threshold: 60, speed: 1.3, interval: 769, volume: 0.65 }, // 1:00 - 0:50

    // Último minuto: aceleración notable
    { threshold: 50, speed: 1.5, interval: 667, volume: 0.7 }, // 0:50 - 0:40
    { threshold: 40, speed: 1.7, interval: 588, volume: 0.75 }, // 0:40 - 0:35
    { threshold: 35, speed: 1.9, interval: 526, volume: 0.8 }, // 0:35 - 0:30
    { threshold: 30, speed: 2.1, interval: 476, volume: 0.85 }, // 0:30 - 0:25

    // Últimos 25 segundos: más rápido
    { threshold: 25, speed: 2.4, interval: 417, volume: 0.9 }, // 0:25 - 0:20
    { threshold: 20, speed: 2.7, interval: 370, volume: 0.95 }, // 0:20 - 0:15
    { threshold: 15, speed: 3.0, interval: 333, volume: 1.0 }, // 0:15 - 0:12

    // Últimos 12 segundos: muy rápido
    { threshold: 12, speed: 3.5, interval: 286, volume: 1.0 }, // 0:12 - 0:10
    { threshold: 10, speed: 4.0, interval: 250, volume: 1.0 }, // 0:10 - 0:8
    { threshold: 8, speed: 5.0, interval: 200, volume: 1.0 }, // 0:08 - 0:6

    // Últimos 6 segundos: extremadamente rápido
    { threshold: 6, speed: 6.0, interval: 167, volume: 1.0 }, // 0:06 - 0:5
    { threshold: 5, speed: 7.0, interval: 143, volume: 1.0 }, // 0:05 - 0:4
    { threshold: 4, speed: 8.0, interval: 125, volume: 1.0 }, // 0:04 - 0:3
    { threshold: 3, speed: 10.0, interval: 100, volume: 1.0 }, // 0:03 - 0:2
    { threshold: 2, speed: 12.0, interval: 83, volume: 1.0 }, // 0:02 - 0:1
    { threshold: 1, speed: 15.0, interval: 67, volume: 1.0 }, // 0:01 - 0:0.5
    { threshold: 0.5, speed: 20.0, interval: 50, volume: 1.0 }, // 0:00.5 - 0:0
  ];

  private currentSpeedConfig: BombSpeedConfig = this.bombSpeedMatrix[6];
  private audioContext: AudioContext | null = null;
  private correctAudio: HTMLAudioElement | null = null;
  private incorrectAudio: HTMLAudioElement | null = null;

  private lastTickTime: number = 0;
  private isAlternateTick: boolean = false;

  loadingQuestion: boolean = true;
  errorMessage: string | null = null;

  private subscriptions: Subscription[] = [];

  constructor(
    private gameStateService: GameStateService,
    private questionsService: QuestionsService
  ) {
    this.initializeAudio();
  }

  ngOnInit(): void {
    this.loadNewQuestion();
  }

  private initializeAudio(): void {
    try {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    } catch (e) {}

    this.correctAudio = new Audio("assets/sounds/correct.mp3");
    this.incorrectAudio = new Audio("assets/sounds/incorrect.mp3");

    if (this.correctAudio) this.correctAudio.volume = 0.6;
    if (this.incorrectAudio) this.incorrectAudio.volume = 0.6;

    [this.correctAudio, this.incorrectAudio].forEach((audio) => {
      if (audio) audio.preload = "auto";
    });

    this.bombSpeedMatrix.sort((a, b) => b.threshold - a.threshold);
  }

  loadNewQuestion(): void {
    this.resetQuestionStateOnly();
    this.loadingQuestion = true;
    this.errorMessage = null;

    const questionSub = this.questionsService.getQuestion().subscribe({
      next: (question) => {
        this.currentQuestion = question;
        this.loadingQuestion = false;

        if (this.isFirstQuestion) {
          this.startBomb();
          this.isFirstQuestion = false;
        } else if (this.bombSubscription) {
          this.updateSpeedConfig();
        }
      },
      error: (error) => {
        this.errorMessage = "Error cargando pregunta. Intenta de nuevo.";
        this.loadingQuestion = false;
        setTimeout(() => this.loadNewQuestion(), 3000);
      },
    });

    this.subscriptions.push(questionSub);
  }

  startBomb(): void {
    if (this.isFirstQuestion) {
      this.bombTime = this.initialBombTime;
      this.bombRemaining = this.initialBombTime;
    }

    this.currentSpeedConfig =
      this.bombSpeedMatrix.find((c) => this.bombRemaining >= c.threshold) ||
      this.bombSpeedMatrix[this.bombSpeedMatrix.length - 1];

    this.lastTickTime = 0;
    this.isAlternateTick = false;

    this.stopBomb();

    this.bombSubscription = interval(50).subscribe(() => {
      const now = Date.now();

      if (now - this.lastTickTime >= this.currentSpeedConfig.interval) {
        this.playTickSound();
        this.isAlternateTick = !this.isAlternateTick;
        this.lastTickTime = now;
        this.bombRemaining -= this.currentSpeedConfig.interval / 1000;
        this.updateSpeedConfig();

        if (this.bombRemaining <= 0) {
          this.bombRemaining = 0;
          this.explodeBomb();
        }
      }
    });

    this.subscriptions.push(this.bombSubscription);
  }

  private playTickSound(): void {
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.type = "sine";
      let frequency = this.isAlternateTick ? 1200 : 1400;
      const variation = (Math.random() - 0.5) * 30;
      frequency += variation;

      oscillator.frequency.setValueAtTime(
        frequency,
        this.audioContext.currentTime
      );

      const currentTime = this.audioContext.currentTime;
      const volume = this.currentSpeedConfig.volume;

      gainNode.gain.setValueAtTime(0, currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, currentTime + 0.001);
      gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.1);

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      const duration = 0.1;

      oscillator.start(currentTime);
      oscillator.stop(currentTime + duration);

      oscillator.onended = () => {
        oscillator.disconnect();
        gainNode.disconnect();
      };
    } catch (e) {}
  }

  private updateSpeedConfig(): void {
    let newConfig: BombSpeedConfig | undefined;

    for (const config of this.bombSpeedMatrix) {
      if (this.bombRemaining >= config.threshold) {
        newConfig = config;
        break;
      }
    }

    if (!newConfig) {
      newConfig = this.bombSpeedMatrix[this.bombSpeedMatrix.length - 1];
    }

    if (newConfig !== this.currentSpeedConfig) {
      this.currentSpeedConfig = newConfig;
    }
  }

  private explodeBomb(): void {
    this.stopBomb();
    this.playExplosionSound();
    this.gameStateService.endGame();
  }

  private playExplosionSound(): void {
    if (!this.audioContext) return;

    try {
      const frequencies = [60, 100, 180, 250];
      const startTime = this.audioContext.currentTime;
      const duration = 2.0;

      frequencies.forEach((freq, index) => {
        const oscillator = this.audioContext!.createOscillator();
        const gainNode = this.audioContext!.createGain();

        oscillator.type = "sawtooth";
        oscillator.frequency.setValueAtTime(freq, startTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          freq * 0.2,
          startTime + duration
        );

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.9, startTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext!.destination);

        oscillator.start(startTime + index * 0.05);
        oscillator.stop(startTime + duration + index * 0.05);
      });
    } catch (e) {}
  }

  selectAnswer(answerIndex: number): void {
    if (this.answered || this.loadingQuestion || !this.currentQuestion) return;

    this.selectedAnswerIndex = answerIndex;
    this.answered = true;

    this.isCorrect = answerIndex === this.currentQuestion.correctAnswerIndex;

    if (this.isCorrect) {
      this.playCorrectSound();
    } else {
      this.playIncorrectSound();
    }

    setTimeout(() => {
      if (this.isCorrect) {
        this.bombTime += 10;
      }

      this.loadNewQuestion();
    }, 2000);
  }

  private playCorrectSound(): void {
    if (this.correctAudio) {
      this.correctAudio.currentTime = 0;
      this.correctAudio.play().catch(() => {});
    }
  }

  private playIncorrectSound(): void {
    if (this.incorrectAudio) {
      this.incorrectAudio.currentTime = 0;
      this.incorrectAudio.play().catch(() => {});
    }
  }

  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }

  resetQuestionStateOnly(): void {
    this.selectedAnswerIndex = null;
    this.answered = false;
    this.isCorrect = false;
  }

  stopBomb(): void {
    if (this.bombSubscription) {
      this.bombSubscription.unsubscribe();
      this.bombSubscription = null;
    }
  }

  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  ngOnDestroy(): void {
    this.stopBomb();
    this.subscriptions.forEach((sub) => sub.unsubscribe());

    if (this.audioContext && this.audioContext.state !== "closed") {
      this.audioContext.close();
    }

    [this.correctAudio, this.incorrectAudio].forEach((audio) => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  }
}
