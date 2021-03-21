import { timer, Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';

export interface ITimer {
  loadData(): any;
}

export abstract class Timer implements ITimer, OnDestroy {
  private interval: number;
  timer$: Subscription;
  constructor(interval = 10000) {
    this.interval = interval;
  }

  abstract loadData(): any;

  /**
   * Метод запустить таймер для периодического обновления таблицыления таблицы
   */
  startTimer(): void {
    this.timer$ = timer(this.interval).subscribe(() => {
      this.loadData();
    });
  }

  /**
   * Остановить таймер периодическое обновление таблицы
   */
  stopTimer(): void {
    if (this.timer$) {
      this.timer$.unsubscribe();
    }
  }

  /** В случае, если вы забыли, чтобы остановить таймер, я Гоча! */
  ngOnDestroy() {
    this.stopTimer();
  }
}
