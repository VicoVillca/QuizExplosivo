import { Component, OnDestroy, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { labels } from "../../../core/constants/labels.constants";
import { messages } from "../../../core/constants/messages.constants";
import { SplashScreamComponent } from "../../components/splash-scream/splash-scream.component";
import { EndBoardComponent } from "../../components/end-game-board/end-game-board.component";
import { GameBoardComponent } from "../../components/game-board/game-board.component";
import { PrincipalBoardComponent } from "../../components/principal-board/principal-board.component";
import {
  GameState,
  GameStateService,
} from "../../../core/services/game-state.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-organizer-page",
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    ProgressSpinnerModule,
    EndBoardComponent,
    GameBoardComponent,
    PrincipalBoardComponent,
    SplashScreamComponent,
  ],
  templateUrl: "./organizer-page.component.html",
  styleUrls: ["./organizer-page.component.scss"],
})
export class OrganizerPageComponent implements OnInit, OnDestroy {
  label = labels;
  message = messages;

  currentState: GameState = "splash";
  private stateSubscription!: Subscription;

  constructor(private gameStateService: GameStateService) {}

  ngOnInit() {
    this.stateSubscription = this.gameStateService.currentState$.subscribe(
      (state) => {
        console.log(state);
        this.currentState = state;
      }
    );
  }

  onStartGame() {
    this.gameStateService.startGame();
  }

  onGameOver() {
    this.gameStateService.endGame();
  }

  onRestart() {
    this.gameStateService.restartGame();
  }

  ngOnDestroy() {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }
}
