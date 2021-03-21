import { Component, OnInit, OnDestroy } from '@angular/core';
import { GlobalValues } from '../../../core';

@Component({
    selector: 'backward-button',
    templateUrl: 'backward.button.html',
    styleUrls: ['backward.button.css']
})
export class BackwardButtonComponent {

    public title: string = "";

    constructor() {
        GlobalValues.Instance.UrlHistory.saveBackUrlHistory();

        GlobalValues.Instance.Page.backwardButton = this;
    }
    
    navigate() {
        GlobalValues.Instance.UrlHistory.backNavigate();
    }

    popLastUrl() {
        GlobalValues.Instance.UrlHistory.popLastUrl();
    }
}