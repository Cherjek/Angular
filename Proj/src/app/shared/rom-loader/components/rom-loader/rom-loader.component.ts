import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RomLoaderService } from '../../services/rom-loader.service';

@Component({
    selector: 'rom-loader',
    templateUrl: './rom-loader.component.html',
    styleUrls: ['./rom-loader.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RomLoaderComponent implements OnInit {
    /**
     * Отвечает за отображения лоадера
     * @var loader$ BehaviorSubject<boolean>
     */
    public loader$: BehaviorSubject<boolean>;
    /**
     * Отвечает за отображения сообщения состояния загрузки
     * @var message$ BehaviorSubject<string>
     */
    public message$: BehaviorSubject<string>;

    constructor(private loaderService: RomLoaderService) {
    }

    ngOnInit() {
        this.loader$ = this.loaderService.getLoaderState();
        this.message$ = this.loaderService.getMessageState();
    }
}
