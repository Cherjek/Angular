import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'markerText'
})
export class MarkerTextPipe implements PipeTransform {
    //typeVal, значение которое означает тип данных: 1 - decimal, для формата
    transform(text: string, search: string, typeVal?: number): any {

        if (text == null) {
            return text;
        }

        text = this.textReplaceHTML(text);
        search = this.textReplaceHTML(search);

        if (!search) {
            return (text != null ? text : '');
        }
        const pattern = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
        if (typeVal !== null && typeVal === 1) {
            text = text.replace(' ', '');
        }
        const regex = new RegExp(pattern, 'gi');
        return search ? ((text || '') + '').replace(regex, (match) => `<span class="highlight">${match}</span>`) : text;
    }

    private textReplaceHTML(text: string) {
        if (text != null && typeof text === 'string') {
            if (text.replace(' ', '').length) {
                text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            }
        }
        return text;
    }
}