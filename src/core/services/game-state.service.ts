import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type GameState = 'splash' | 'principal' | 'game' | 'end';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {

  private currentState = new BehaviorSubject<GameState>('splash');
  currentState$ = this.currentState.asObservable();

  private splashTimer: any;
  private endSoundTimer: any;
  private currentSound?: HTMLAudioElement;

  private sounds: Record<GameState, HTMLAudioElement> = {
    splash: new Audio('assets/sounds/splashh.mp3'),
    principal: new Audio('assets/sounds/menu.mp3'),
    game: new Audio('assets/sounds/gamee.mp3'),
    end: new Audio('assets/sounds/lose.mp3')
  };

  constructor() {
    Object.values(this.sounds).forEach(sound => {
      sound.volume = 0.6;
      sound.loop = true;
      sound.load();
    });

    this.startSplashTimer();
  }

  startSplashTimer() {
    this.changeState('splash');

    this.splashTimer = setTimeout(() => {
      this.changeState('principal');
    }, 2000);
  }

  changeState(newState: GameState) {
    if (this.currentState.value === newState) return;

    this.currentState.next(newState);
    this.playSoundForState(newState);

    if (this.splashTimer) {
      clearTimeout(this.splashTimer);
      this.splashTimer = null;
    }
  }

  private playSoundForState(state: GameState) {
    if (this.currentSound) {
      this.currentSound.pause();
      this.currentSound.currentTime = 0;
    }

    if (this.endSoundTimer) {
      clearTimeout(this.endSoundTimer);
      this.endSoundTimer = null;
    }

    const sound = this.sounds[state];
    if (!sound) return;

    sound.currentTime = 0;

    if (state === 'end') {
      sound.loop = false;
      sound.play().catch(() => {});
      this.currentSound = sound;

      this.endSoundTimer = setTimeout(() => {
        sound.pause();
        sound.currentTime = 0;
        this.currentSound = undefined;
      }, 5000);
    } else {
      sound.loop = true;
      sound.play().catch(() => {});
      this.currentSound = sound;
    }
  }

  startGame() {
    this.changeState('game');
  }

  endGame() {
    this.changeState('end');
  }

  restartGame() {
    this.changeState('principal');
  }

  getCurrentState(): GameState {
    return this.currentState.value;
  }

  setVolume(volume: number) {
    Object.values(this.sounds).forEach(sound => {
      sound.volume = volume;
    });
  }
}
