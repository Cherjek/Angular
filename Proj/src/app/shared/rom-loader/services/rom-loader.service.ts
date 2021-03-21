import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class RomLoaderService {
    /**
     * Отвечает за отображения лоадера
     * @var loader$ BehaviorSubject<boolean>
     */
    private loader$ = new BehaviorSubject<boolean>(false);
    /**
     * Отвечает за отображения сообщения состояния загрузки
     * @var message$ BehaviorSubject<string>
     */
    private message$ = new BehaviorSubject<string>(null);

    /**
     * Показать лоадер
     * @param message string
     */
    public showLoader(message?: string): void {
        this.loader$.next(true);
        this.message$.next(message);
    }

    /**
     * Скрыть лоадер
     */
    public hideLoader(): void {
        this.loader$.next(false);
        this.message$.next(null);
    }

    /**
     * Получить состояние лоадера
     * @return BehaviorSubject<boolean>
     */
    public getLoaderState(): BehaviorSubject<boolean> {
        return this.loader$;
    }

    /**
     * Получить состояние сообщения
     * @return BehaviorSubject<string>
     */
    public getMessageState(): BehaviorSubject<string> {
        return this.message$;
    }
}
