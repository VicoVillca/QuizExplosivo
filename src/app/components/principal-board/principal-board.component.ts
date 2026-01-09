import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { GameStateService } from "../../../core/services/game-state.service";
import { labels } from "../../../core/constants/labels.constants";
import { messages } from "../../../core/constants/messages.constants";

@Component({
  selector: "app-principal-board",
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: "./principal-board.component.html",
  styleUrls: ["./principal-board.component.scss"],
})
export class PrincipalBoardComponent {
  labels = labels;
  messages = messages;

  constructor(private gameStateService: GameStateService) {}

  onStartGame(): void {
    this.gameStateService.startGame();
  }
}
