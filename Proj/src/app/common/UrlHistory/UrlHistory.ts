import { Injectable, ReflectiveInjector } from '@angular/core';
import { UrlHistItem } from './UrlHistItem';
import { NavigationEnd, RoutesRecognized } from "@angular/router";
import { Router } from "@angular/router";

const urlHistLength = 5;
export const keyStorageUrlHistory = "UrlHistory";

@Injectable()
export class UrlHistory {

    urlHistory: UrlHistItem[] = []; // история переходов по страницам {[current_url]: previous_url}
    get storageUrlHistory() {
        let urlHistory: UrlHistItem[] = [];
        let storage = localStorage.getItem(keyStorageUrlHistory);
        if (storage) {
            let jsonUrlHistory = JSON.parse(storage);
            jsonUrlHistory.forEach((u: any) => urlHistory.push(new UrlHistItem(u.url)));
        }
        return urlHistory;
    }
    set storageUrlHistory(vals: UrlHistItem[]) {
        if (vals == null) localStorage.removeItem(keyStorageUrlHistory);
        else localStorage.setItem(keyStorageUrlHistory, JSON.stringify(vals));
    }

    CurrentUrl: string;       // текущий url
    PreviousUrl: string;       // предыдущий адрес страницы в случае если мы перешли с нее на страницу на которой есть DataGrid
    PreviousUrlBack: string;   //адрес по кнопке назад
    router: Router;

    saveRouter(router: Router) {
        this.router = router;
    }

    saveBackUrlHistory() {

        let isBack: boolean = false;
        //определяем, что переход был возвратом
        if (this.urlHistory.length) {
            if (this.urlHistory[0].url === this.CurrentUrl) {
                this.urlHistory.splice(0, 1);
                isBack = true;
            }
        } else {
            this.urlHistory = this.storageUrlHistory;
        }

        if (!isBack && this.PreviousUrl) this.urlHistory.splice(0, 0, new UrlHistItem(this.PreviousUrl));

        if (this.urlHistory.length > urlHistLength) {
            this.urlHistory.pop();
        }

        this.storageUrlHistory = this.urlHistory;

        if (this.urlHistory.length) {
            this.PreviousUrlBack = this.urlHistory[0].url;
        }
    }
    saveUrlHistory(e: RoutesRecognized[]) { // запоминание истории переходов
      
        const pathContruct = (route: RoutesRecognized) => route.state.root.children[0].url.map(x => x.path).join('/');
        const current = pathContruct(e[1]);
        // когда у пользователя нет прав на страницу
        if (current.includes('not-found-page')) {
            this.saveBackUrlHistory();
            return;
        }
        
        if (e[0].state.root.pathFromRoot.length && e[0].state.root.pathFromRoot[0].firstChild
          && e[1].state.root.pathFromRoot.length && e[1].state.root.pathFromRoot[0].firstChild) {
            if (e[0].state.root.pathFromRoot[0].firstChild.routeConfig.path ===
              e[1].state.root.pathFromRoot[0].firstChild.routeConfig.path)
              return;
          }

        // когда пользователь нажимает на заголовок вкладки, она не сохранить в массив
        // if (this.CurrentUrl && this.CurrentUrl.includes(current)) {
        //     if (current.length < this.CurrentUrl.length) {
        //       // выходим из нижнего уровня карточки
        //       // пример - Гарантирующие поставщики - Карточка ГП - Карточка Сбытовой надбавки
        //       // CurrentUrl - "/tariff-calc/suppliers/3/addition/83"
        //       // PreviousUrl - "/tariff-calc/suppliers/3/addition"
        //       // current - "tariff-calc/suppliers/3"
        //       const curl = this.urlHistory.shift();
        //       if (this.urlHistory.length) {
        //         this.PreviousUrl = this.urlHistory[0].url;
        //         this.CurrentUrl = curl ? curl.url : current;
        //       }
        //     }
        //     return;
        // }
        // когда мы сохраняем сущность, адрес меняется с new на id, ROM-1998
        // if (e[0].state && e[0].state.root && e[0].state.root.children && e[0].state.root.children.length) {
        //   if (JSON.stringify(e[0].state.root.children[0].params) === JSON.stringify({ id: 'new' })) return;
        // }

        if (e && e instanceof Array && e.length > 1) {
            //e[0] - предыдущий
            //e[1] - текущий
            this.PreviousUrl = e[0].url;
            this.CurrentUrl = e[1].url;
        }

        if (this.CurrentUrl === '/objects') {
            this.urlHistory = [];
            delete this.CurrentUrl;
            delete this.PreviousUrl;
            delete this.PreviousUrlBack;
            this.storageUrlHistory = null;
        }
    }

    backNavigate() {
        this.router.navigateByUrl(this.PreviousUrlBack);
    }

    getPreviousUrlKey() {
        return -1;
    }

    popLastUrl() {
        if (this.urlHistory.length) {
            this.urlHistory.splice(0, 1);
        }
        if (this.urlHistory.length) {
            this.PreviousUrl = 
                this.PreviousUrlBack = 
                    this.urlHistory[0].url;
        }
    }
}