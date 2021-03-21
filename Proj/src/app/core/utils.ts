import * as Localization from './../common/Localization';
import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Common as CommonConstants } from '../common/Constants';
import { DateStructure } from '../common/models/DateStructure';

const Locale = Localization.Common.Localization;
export namespace Utils {

    export class DateConvert {

        private static _instance: DateConvert;
        public static get Instance(): DateConvert {
            if (!this._instance) { this._instance = new DateConvert(); }
            return this._instance;
        }

        // получает время Timestamp с смещеним времени
        getTimeOffset(date: any): any {
            return date ? date.getTime() - (date.getTimezoneOffset() * 60000) : null;
        }

        static toDateTimeRequest(dateTime: string | Date) {
            if (dateTime != null && dateTime instanceof Date) {
                const year = dateTime.getFullYear();
                const month = ('00' + (dateTime.getMonth() + 1)).slice(-2);
                const day = ('00' + (dateTime.getDate())).slice(-2);
                const hour = ('00' + (dateTime.getHours())).slice(-2);
                const minute = ('00' + (dateTime.getMinutes())).slice(-2);
                dateTime = `${year}-${month}-${day}T${hour}:${minute}`;
            }
            return dateTime;
        }
    }

    export class DateFormat {

        private static _instance: DateFormat;
        public static get Instance(): DateFormat {
            if (!this._instance) { this._instance = new DateFormat(); }
            return this._instance;
        }

        private datePipe: DatePipe = new DatePipe('ru-RU');
        getDate(value: any, args?: any): string {
            if (!value) { return ""; }
            if (value instanceof Date) {
                value = value.toLocaleDateString('ru-Ru');
            }
            return this.formatDateTime(value);
        }
        getDateTime(value: any, args?: any): string {
            if (!value) { return ""; }
            if (value instanceof Date) {
                value = value.toLocaleDateString('ru-Ru', {
                    // weekday: 'long',
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                }).replace(',', '');
            }
            return this.formatDateTime(value, true);
        }
        getDateMonth(value: string, monthNum?: boolean): string  {
            const dateStructure = this.parseDate(value)
            const months = Object.values(Locale.Calendar.Month) as string[];
            if (dateStructure && dateStructure.month) {
                if (monthNum) {
                    return dateStructure.month;
                }
                return months[+dateStructure.month - 1]
            }
        }
        getDateTimeFromStr(dateTime: string): Date {
            const dateStruct = this.parseDate(dateTime);
            if (dateStruct == null) {
                return null;
            }
            let dateTimeResult = new Date(parseInt(dateStruct.year),
                parseInt(dateStruct.month) - 1,
                parseInt(dateStruct.day));
            if (dateStruct.hh) {
                dateTimeResult = new Date(dateTimeResult.setHours(parseInt(dateStruct.hh)));
            }
            if (dateStruct.mm) {
                dateTimeResult = new Date(dateTimeResult.setMinutes(parseInt(dateStruct.mm)));
            }
            if (dateStruct.ss) {
                dateTimeResult = new Date(dateTimeResult.setSeconds(parseInt(dateStruct.ss)));
            }

            return dateTimeResult;
        }
        parseDate(date: string): DateStructure {
            let dateStructure: DateStructure;
            let year_index = 3;
            let matches: any =
                /^(\d{1,2})[-/.\/](\d{1,2})[-/.\/](\d{4})(?:.+?(\d{1,2}:?(\d{1,2}:?(\d{1,2}.*?)?)?)?)?$/.exec(date);
            if (matches == null) {
                year_index = 1;
                matches =
                    /^(\d{4})[-/.\/](\d{1,2})[-/.\/](\d{1,2})(?:.+?(\d{1,2}:?(\d{1,2}:?(\d{1,2}.*?)?)?)?)?$/.exec(date);
            }
            if (matches != null) {
                dateStructure = new DateStructure();
                dateStructure.day = matches[year_index === 3 ? 1 : 3];
                dateStructure.month = `${matches[2]}`;
                dateStructure.year = matches[year_index];

                if (matches[4]) {
                    const times = matches[4].split(':');
                    for (let i = 0; i < times.length; i++) {
                        if (i === 0) { dateStructure.hh = times[i].length == 1 ? `0${times[i]}` : times[i]; }
                        if (i === 1) { dateStructure.mm = times[i]; }
                        if (i === 2) { dateStructure.ss = times[i].substring(0, 2); }
                    }
                }
            }

            return dateStructure;
        }
        private formatDateTime(date: string, withTime?: boolean): string {

            const dateStructure = this.parseDate(date);
            if (dateStructure != null) {
                const delimiter = CommonConstants.Constants.DATE_FMT_DELIMITER;
                const formatDate = CommonConstants.Constants.DATE_FMT;
                const formatTime = CommonConstants.Constants.TIME_FMT;
                const values = formatDate.split(delimiter);
                if (values.length) {
                    let formatDateStr = '';
                    for (const val in values) {
                        const index = values.indexOf(values[val]);
                        if (values[val] === 'DD') {
                            formatDateStr += dateStructure.day + (index < values.length - 1 ? delimiter : '');
                        } else if (values[val] === 'MM') {
                            formatDateStr += dateStructure.month + (index < values.length - 1 ? delimiter : '');
                        } else if (values[val] === 'YYYY') {
                            formatDateStr += dateStructure.year + (index < values.length - 1 ? delimiter : '');
                        }
                    }
                    if (formatDateStr.length) {
                        let time = '';
                        if (withTime) {
                            const hh = formatTime.split(':').length > 0 ? `${dateStructure.hh}` : '';
                            const mm = formatTime.split(':').length > 1 ? `:${dateStructure.mm}` : '';
                            const ss = formatTime.split(':').length > 2 ? `:${dateStructure.ss}` : '';
                            time = ` ${hh}${mm}${ss}`;
                        }
                        date = formatDateStr + time;
                    }
                }
            }
            return date;
        }
    }

    export class RandomColorGenerator {

        HSV_H = 360;
        HSV_S = 95;
        HSV_V = 70;
        HSV_V_STEP = 15;
        HSV_V_MIN = 70;
        HSV_V_MAX = 100;
        STEP = 24;
        step_start = 0;
        randomColor() {
            let h = this.step_start;
            if (h > this.HSV_H) {
                h = this.step_start = h - this.HSV_H;
                this.HSV_V += this.HSV_V_STEP;
                if (this.HSV_V > this.HSV_V_MAX) { this.HSV_V = this.HSV_V_MIN; }
            }

            const s = this.HSV_S; // [(index % 2 === 0 ? 0 : 1)];
            const v = this.HSV_V;

            this.step_start = this.step_start + this.STEP;

            return this.hsvToRgb(h, s, v);
        }
        hsvToRgb(h: number, s: number, v: number) {
            let r, g, b;
            let i;
            let f, p, q, t;

            // Make sure our arguments stay in-range
            h = Math.max(0, Math.min(360, h));
            s = Math.max(0, Math.min(100, s));
            v = Math.max(0, Math.min(100, v));

            // We accept saturation and value arguments from 0 to 100 because that's
            // how Photoshop represents those values. Internally, however, the
            // saturation and value are calculated from a range of 0 to 1. We make
            // That conversion here.
            s /= 100;
            v /= 100;

            if (s == 0) {
                // Achromatic (grey)
                r = g = b = v;
                return [
                    Math.round(r * 255),
                    Math.round(g * 255),
                    Math.round(b * 255)
                ];
            }

            h /= 60; // sector 0 to 5
            i = Math.floor(h);
            f = h - i; // factorial part of h
            p = v * (1 - s);
            q = v * (1 - s * f);
            t = v * (1 - s * (1 - f));

            switch (i) {
                case 0:
                    r = v;
                    g = t;
                    b = p;
                    break;

                case 1:
                    r = q;
                    g = v;
                    b = p;
                    break;

                case 2:
                    r = p;
                    g = v;
                    b = t;
                    break;

                case 3:
                    r = p;
                    g = q;
                    b = v;
                    break;

                case 4:
                    r = t;
                    g = p;
                    b = v;
                    break;

                default: // case 5:
                    r = v;
                    g = p;
                    b = q;
            }

            return [
                Math.round(r * 255),
                Math.round(g * 255),
                Math.round(b * 255)
            ];
        }
        hexColorFromRGB(rgb: number[]) {

            const correct = (hex: string) => {
                if (hex.length === 1) { return "0" + hex; }
                return hex;
            };

            if (rgb && rgb.length === 3) {
                return '#' + correct(rgb[0].toString(16)) + correct(rgb[1].toString(16)) + correct(rgb[2].toString(16));
            } else {
                return "#000";
            }
        }

        getColor() {
            return this.hexColorFromRGB(this.randomColor());
        }
    }

    export class UtilsTools {

        private static readonly array = [window.screen.height, window.screen.width];

        static getWindowOrientationScreen() {
            let orientationType = ( screen as any).msOrientation || ( screen as any).mozOrientation || (screen.orientation || { type: 'not-found' }).type;
            if (orientationType === 'not-found') {
                if (window.innerWidth > window.innerHeight) {
                    orientationType = 'landscape-primary';
                } else {
                    orientationType = 'portrait-primary';
                }
            }
            return orientationType.startsWith('landscape') ? 'landscape' : 'portrait';
        }
        static get windowScreenWidth() {
            if (this.getWindowOrientationScreen() === 'landscape') {
                return Math.max(...this.array);
            } else {
                return Math.min(...this.array);
            }
        }
        static get windowScreenHeight() {
            if (this.getWindowOrientationScreen() === 'landscape') {
                return Math.min(...this.array);
            } else {
                return Math.max(...this.array);
            }
        }
    }

    @Injectable({
        providedIn: 'root'
    })
    export class UtilsTree {

        // UTILS TREE - INCLUDE TREE ON SOURCE TREE, EXCLUDE TREE ON SOURCE TREE
        
        // получает дерево по id leaf
        public filterSourceTreeFromIds(nodeLeafIds: any[], sourceTree: any[], treeKey: string, treeChildKey: string) {

            nodeLeafIds = nodeLeafIds || [];
            sourceTree = sourceTree || [];

            const recursiveFilter = (_nodeLeafIds: any[], _sourceTree: any[]): any[] => {
                /*_nodeLeafIds.forEach((id: any) => {

                });*/
                const nodesLeaf: any[] = [];

                _sourceTree.forEach((node: any) => {
                    if (node[treeChildKey] != null && node[treeChildKey].length) {
                        const nodesLeafFind = recursiveFilter(_nodeLeafIds, node[treeChildKey]);
                        if (nodesLeafFind && nodesLeafFind.length) {
                            const copy = { ...node };
                            copy[treeChildKey] = nodesLeafFind;
                            nodesLeaf.push(copy);
                        }
                    } else {
                        if (_nodeLeafIds.some((id: any) => id == node[treeKey])) {
                            nodesLeaf.push(node);
                        }
                    }
                });

                return nodesLeaf;
            };

            return recursiveFilter(nodeLeafIds, sourceTree);
        }

        // добавляет одно дерево в другое, добавляет не достающие ветки
        public includeTree(tree: any[], sourceTree: any[], treeKey: string, treeChildKey: string): void {

            tree = tree || [];
            sourceTree = sourceTree || [];

            const recursiveInclude = (_tree: any[], _sourceTree: any[]) => {
                (_tree || []).forEach((node: any) => {

                    const nodeSource = _sourceTree.find((nodeSource: any) => node[treeKey] == nodeSource[treeKey]);
                    if (nodeSource) {
                        recursiveInclude(node[treeChildKey], nodeSource[treeChildKey]);
                    } else {
                        _sourceTree.push({ ...node });
                    }

                });
            };

            recursiveInclude(tree, sourceTree);
        }

        /**
         * @param tree //дерево которое передаем в основное дерево - sourceTree
         * @param sourceTree //дерево слияния
         * @param treeKey //ключ основной, считается одинаковым для обеих записей
         * @param treeChildKey //имя дочернего свойства в JSON объекте
         * @param sourceTreeKey //не обязательный, соответствует treeKey, когда JSON обеих источников совпадает
         * @param sourceTreeChildKey //не обязательный, соответствует treeKey, когда JSON обеих источников совпадает
         */
        // удаляет одно дерево из другого, часть дерева, по ключу
        public excludeTree(tree: any[], sourceTree: any[], treeKey: string, treeChildKey: string, sourceTreeKey?: string, sourceTreeChildKey?: string): void {
            if (sourceTreeKey == null) { sourceTreeKey = treeKey; }
            if (sourceTreeChildKey == null) { sourceTreeChildKey = treeChildKey; }

            // получение у дерева листа, от него рекурсивно удаляем у sourceTree записи от leaf до root
            const getLeafRoot = (nodes: any[], nodeIds: any[]) => {

                (nodes || []).forEach((node: any) => {

                    if (node[treeChildKey] != null && node[treeChildKey].length) {
                        getLeafRoot(node[treeChildKey], nodeIds);
                    } else {
                        // this node is leaf
                        nodeIds.push(node[treeKey]);
                    }

                });

            };

            const removeArrayObject = (array: any[] = [], id: any) => {
                const indexRemove = array.indexOf(array.find((n: any) => n[sourceTreeKey] == id));
                array.splice(indexRemove, 1);
            };

            // получение у дерева листа, от него рекурсивно удаляем у sourceTree записи от leaf до root
            const removeLeafRoot = (nodes: any[], nodeIds: any[], parentNode?: any) => {

                for (let i = (nodes || []).length - 1; i >= 0; i--) {

                    const node: any = nodes[i];
                    const nodeId: any = node[sourceTreeKey];

                    if (node[sourceTreeChildKey] != null && node[sourceTreeChildKey].length) {
                        removeLeafRoot(node[sourceTreeChildKey], nodeIds, node);

                        // после удаления, проверить, что у ноды остались дочерние, если нет, удалить и родителя
                        if (!node[sourceTreeChildKey].length) {

                            if (parentNode) {
                                removeArrayObject(parentNode[sourceTreeChildKey], nodeId);
                            } else {
                                removeArrayObject(nodes, nodeId);
                            }

                        }
                    } else {
                        // this node is leaf
                        if (nodeIds.some((Id: any) => Id == node[sourceTreeKey])) {

                            if (parentNode) {
                                removeArrayObject(parentNode[sourceTreeChildKey], nodeId);
                            } else {
                                removeArrayObject(nodes, nodeId);
                            }

                            const array = nodeIds;
                            const indexRemove = array.indexOf(array.find((n: any) => n == node[sourceTreeKey]));
                            array.splice(indexRemove, 1);
                        }
                    }
                }

            };

            const nodeIds: any[] = [];
            getLeafRoot(tree, nodeIds);
            if (nodeIds.length) {
                removeLeafRoot(sourceTree, nodeIds);
            }
        }
    }
}