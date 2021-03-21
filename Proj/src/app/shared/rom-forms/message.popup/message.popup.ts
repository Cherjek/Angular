import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, Input, ElementRef } from '@angular/core';
declare var $: any;

@Component({
    selector: 'message-popup',
    templateUrl: 'message.popup.html',
    styleUrls: ['message.popup.less']
})

export class MessagePopupComponent {

    @Input()
    messages: string[] = [];

    constructor(private elementRef: ElementRef) { }

    public onClose(i: number) {
        this.messages.splice(i, 1);
    }

    public getMessage(message: any) {
        return message.ShortMessage || (message instanceof Object ? AppLocalization.ThereWasAMistake : message);
    }
}