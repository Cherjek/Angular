import { Component, Input, Output, EventEmitter, TemplateRef, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';

declare var $: any;

@Component({
    selector: 'button-ro5',
    templateUrl: 'Button.html',
    styleUrls: ['Button.less']
})

export class Button implements OnInit, AfterViewInit {

    @Input() disabled: boolean = false;
    @Input() isFullSize: boolean;
    @Input() class: string;
    @Input() tooltip: string;
    @Output() onclick = new EventEmitter<any>();

    @ViewChild('button', { static: true }) buttonElement: ElementRef;

    constructor() {
        
    }

    ngOnInit(): void {
        
    }

    ngAfterViewInit(): void {
        if (this.class != null) $(this.buttonElement.nativeElement).addClass(this.class);
    }
}