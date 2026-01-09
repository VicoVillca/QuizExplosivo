import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { GameStateService } from '../../../core/services/game-state.service';

@Component({
  selector: 'app-principal-board',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './principal-board.component.html',
  styleUrls: ['./principal-board.component.scss']
})
export class PrincipalBoardComponent {
  constructor(private gameStateService: GameStateService) { }

  onStartGame(): void {
    console.log('🎮 Iniciando juego desde PrincipalBoard...');

    this.gameStateService.startGame();
    
    console.log('✅ Estado cambiado a: game');
  }
}