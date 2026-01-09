import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { GameStateService } from '../../../core/services/game-state.service';
import { labels } from '../../../core/constants/labels.constants';
import { messages } from '../../../core/constants/messages.constants';

@Component({
  selector: 'app-end-game-board',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './end-game-board.component.html',
  styleUrls: ['./end-game-board.component.scss']
})
export class EndBoardComponent {

  labels = labels;
  messages = messages;
  
  constructor(private gameStateService: GameStateService) { }

  onRestartGame(): void {
    this.gameStateService.startGame();
  }
}