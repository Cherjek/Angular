import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'loader-ro5',
    templateUrl: 'Loader.html',
    styleUrls: ['Loader.css']
})
export class Loader {

    private _loading: boolean;
    @Input()
    get loading(): boolean {
        return this._loading;
    }
    set loading(val: boolean) {
        this._loading = val;
        this.loadingChange.emit(this.loading);
    }
    @Output() loadingChange = new EventEmitter<any>();
}
