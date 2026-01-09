import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { GameStateService } from '../../../core/services/game-state.service';

@Component({
  selector: 'app-end-game-board',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './end-game-board.component.html',
  styleUrls: ['./end-game-board.component.scss']
})
export class EndBoardComponent {
  constructor(private gameStateService: GameStateService) { }

  onStartGame(): void {
    console.log('🎮 Iniciando juego desde PrincipalBoard...');

    this.gameStateService.startGame();
    
    console.log('✅ Estado cambiado a: game');
  }
}