import { Component } from '@angular/core';

@Component({
    selector: 'buttonPage-ro5',
    templateUrl: 'buttonPage.html'
})

export class TestButtonPageComponent {

    _alert = (message: string) => {
        alert(message);
    }


    __testValue1: number;
    get testValue1() {
        return this.__testValue1;
    };
    set testValue1(v: any) {
        this.__testValue1 = v;
        console.log("testValue1: " + v);
    };
    __testValue2: number;
    get testValue2() {
        return this.__testValue2;
    };
    set testValue2(v: any) {
        this.__testValue2 = v;
        console.log("testValue2: " + v);
    };

    __onNumberChange(e: any) {
        console.log("__onNumberChange: " + e);
    }
}
