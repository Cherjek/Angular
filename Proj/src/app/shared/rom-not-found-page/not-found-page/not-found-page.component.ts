import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { GlobalValues } from '../../../core';

@Component({
    selector: 'not-found-page',
    templateUrl: 'not-found-page.component.html',
    styleUrls: ['not-found-page.component.less'],
})

export class NotFoundPageComponent {
    public error = {
        message: AppLocalization.PageIsNotFound,
        code: 404,
    };

    constructor(private activatedRoute: ActivatedRoute, private location: Location) {
        this.activatedRoute.queryParamMap.subscribe((response: Params) => {
            if (response.params.hasOwnProperty('access') && response.params.access === 'false') {
                this.error = {
                    message: AppLocalization.Label109,
                    code: null,
                };
            }
        });
    }

    public back(): void {
        if (GlobalValues.Instance.Page.backwardButton != null) {
            GlobalValues.Instance.Page.backwardButton.navigate();
        } else {
            this.location.back();
        }
    }
}