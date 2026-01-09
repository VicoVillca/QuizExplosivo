import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type GameState = 'splash' | 'principal' | 'game' | 'end';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  private currentState = new BehaviorSubject<GameState>('splash');
  currentState$ = this.currentState.asObservable();
  
  // Temporizador para splash screen
  private splashTimer: any;
  
  constructor() {
    // Iniciar automáticamente con splash
    this.startSplashTimer();
  }
  
  startSplashTimer() {
    this.currentState.next('splash');
    
    // Cambiar a principal después de 2.5 segundos
    this.splashTimer = setTimeout(() => {
      this.changeState('principal');
    }, 5000);
  }
  
  changeState(newState: GameState) {
    this.currentState.next(newState);
    
    // Limpiar timer si existe
    if (this.splashTimer) {
      clearTimeout(this.splashTimer);
      this.splashTimer = null;
    }
  }
  
  startGame() {
    this.changeState('game');
  }
  
  endGame() {
    this.changeState('end');
  }
  
  restartGame() {
    // Podrías ir directo al juego o al principal
    this.changeState('principal');
  }
  
  getCurrentState(): GameState {
    return this.currentState.value;
  }
}