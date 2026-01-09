import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { GameStateService } from '../../../core/services/game-state.service';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent {
  constructor(private gameStateService: GameStateService) { }

    onEndGame(): void {
    console.log('🎮 Iniciando juego desde PrincipalBoard...');

    this.gameStateService.endGame();
    
    console.log('✅ Estado cambiado a: game');
  }
}