import { Component, OnDestroy } from '@angular/core';
import { GameConfig } from './game-config.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy {
  score: number | null = null;
  running = false;
  currLeftTime = 0;
  visible = new Set<number>();
  rows = 3;
  cols = 3;

  gameConfig: GameConfig = {
    rows: this.rows,
    cols: this.cols,
    roundDuration: 15,
    molesAtOnce: 1,
    molesAppearingInterval: 1500,
    totalCount: this.rows * this.cols,
  };

  private countdownTimerId: ReturnType<typeof setInterval> | null = null;
  private moleTimerId: ReturnType<typeof setInterval> | null = null;

  startGame() {
    this.stopTimers();
    this.running = true;
    this.score = 0;
    this.currLeftTime = this.gameConfig.roundDuration;
    this.visible = this.generateMolePositions(
      this.gameConfig.molesAtOnce,
      this.gameConfig.totalCount,
    );
    this.startTimer();
    this.generateMoles(this.gameConfig);
  }

  whackMole(index: number) {
    if (!this.running || !this.visible.has(index)) {
      return;
    }
    const newVisible = new Set<number>(this.visible);
    newVisible.delete(index);
    this.visible = newVisible;
    this.score = (this.score ?? 0) + 1;
  }

  private startTimer() {
    this.countdownTimerId = setInterval(() => {
      if (this.currLeftTime <= 1) {
        this.currLeftTime = 0;
        this.finishGame();
      } else {
        this.currLeftTime -= 1;
      }
    }, 1000);
  }

  private generateMoles({
    molesAtOnce,
    totalCount,
    molesAppearingInterval,
  }: GameConfig) {
    this.moleTimerId = setInterval(() => {
      if (!this.running) {
        return;
      }

      this.visible = this.generateMolePositions(molesAtOnce, totalCount);
    }, molesAppearingInterval);
  }

  private finishGame() {
    this.running = false;
    this.visible = new Set<number>();
    this.stopTimers();
  }

  private stopTimers() {
    if (this.countdownTimerId != null) {
      clearInterval(this.countdownTimerId);
      this.countdownTimerId = null;
    }
    if (this.moleTimerId != null) {
      clearInterval(this.moleTimerId);
      this.moleTimerId = null;
    }
  }

  ngOnDestroy() {
    this.stopTimers();
  }

  private generateMolePositions(molesAtOnce: number, totalCount: number) {
    const indices = Array.from({ length: totalCount }).map((_, index) => index);
    this.shuffle(indices);
    const shuffledIndices = indices.slice(0, molesAtOnce);

    return new Set(shuffledIndices);
  }

  private shuffle(array: number[]) {
    for (let i = 0; i < array.length; i++) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
