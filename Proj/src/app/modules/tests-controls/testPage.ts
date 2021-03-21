import { Component } from '@angular/core';

import { ContextButtonItem } from '../../controls/ContextButton/ContextButtonItem';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'test-page-ro5',
    templateUrl: 'testPage.html',
    styleUrls: ['testPage.css']
})

export class TestPageComponent {

    ContextButtonItems: ContextButtonItem[] = [
        {
            code: 'button',
            name: 'Кнопки'
        },
        {
            code: 'editors',
            name: 'Редакторы'
        },
        {
            code: 'list-view',
            name: 'Списки'
        },
        {
            code: 'tree-view',
            name: 'Деревья'
        }
    ];

    constructor(
        public router: Router,
        public activatedRoute: ActivatedRoute) {

    }

    contextButtonHeaderClick(code: string) {
        this.router.navigate([`${code}`], { relativeTo: this.activatedRoute });
    }
}
