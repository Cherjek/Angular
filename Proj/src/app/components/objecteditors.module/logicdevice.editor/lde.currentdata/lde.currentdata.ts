import { Location } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  AfterContentChecked,
} from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

import { DataResultSettingsService } from '../../../../services/datapresentation.module/DataResultSettings.service';
import {
  CurrentDataService,
  TypeEntity,
} from 'src/app/services/currentdata.module/currentdata.service';
import { PageCurrentData } from 'src/app/services/currentdata.module/Models/PageCurrentData';

declare var $: any;

const keyStorageCategoryPosition =
  'LD.OECurrentDataComponent.storageCategoryPosition';

const notFoundClass = 'data-not-found-2';
const filterAttribute = 'data-filter';

@Component({
  selector: 'lde-currentdata',
  templateUrl: './lde.currentdata.html',
  styleUrls: ['./lde.currentdata.css'],
  providers: [CurrentDataService],
})
export class LDECurrentDataComponent
  implements OnInit, OnDestroy, AfterContentChecked {
  categoryId: number;
  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public html: DomSanitizer,
    public currentDataService: CurrentDataService,
    public dataResultSettingsService: DataResultSettingsService,
    private location: Location
  ) {
    currentDataService.typeEntity = TypeEntity.LogicDevice;
    this.subscription = combineLatest(
      activatedRoute.parent.params,
      activatedRoute.queryParams
    ).subscribe((data) => {
      this.unitId = data[0].id;
      if (data[1] && data[1].categoryId) {
        this.categoryId = +data[1].categoryId;
      }
    });
  }

  public loadingPagePanel: boolean = true;
  public errorsPageLoad: any[] = [];
  public loadingContent: boolean;
  public errorsContent: any[] = [];
  public pages: PageCurrentData[];
  public selectedPage: PageCurrentData;
  private subscription: Subscription;
  private unitId: number;
  public innerHTML: any;

  public searchFilter: string;
  private searchTextInputTimeout: any;
  public total: number;

  private get storageCategoryPosition() {
    let storage = localStorage.getItem(keyStorageCategoryPosition);
    return storage != null
      ? Object.assign(new PageCurrentData(), JSON.parse(storage))
      : null;
  }
  private set storageCategoryPosition(p: PageCurrentData) {
    localStorage.setItem(keyStorageCategoryPosition, JSON.stringify(p));
  }

  ngOnInit() {
    this.loadPages(this.unitId).subscribe(
      (data: any) => {
        this.pages = <PageCurrentData[]>data.Pages;
        if (this.pages && this.pages.length) {
          if (this.storageCategoryPosition) {
            this.selectedPage = this.pages.find((x) => {
              return (
                x.Id === (this.categoryId || this.storageCategoryPosition.Id)
              );
            });
          }
          this.selectedPage = this.selectedPage || this.pages[0];
          this.onPageSelect(this.selectedPage);
        }
        this.loadingPagePanel = false;
      },
      (error: any) => {
        this.loadingPagePanel = false;
        this.errorsPageLoad.push(error);
      }
    );
  }

  ngAfterContentChecked() {
    this.updateTotal();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadPages(logicDeviceId: number) {
    return this.currentDataService.getPages(logicDeviceId);
  }

  onPageSelect(page: PageCurrentData) {
    this.location.go(`${this.router.url}&categoryId=${page.Id}`);
    this.storageCategoryPosition = this.selectedPage = page;
    this.loadData();
  }

  loadData() {
    this.loadingContent = true;
    this.currentDataService
      .getPage(this.unitId, this.selectedPage.Id)
      .subscribe(
        (data: string) => {
          this.innerHTML = this.html.bypassSecurityTrustHtml(data);
          this.loadingContent = false;

          let index = data.indexOf('<script>');
          if (index >= 0) {
            let indexEnd = data.indexOf('</script>');
            let script = data.slice(index, indexEnd) + '</script>';
            setTimeout(() => $(document.body).append(script), 100);
          }
        },
        (error: any) => {
          this.errorsContent.push(error);
          this.loadingContent = false;
        }
      );
  }

  clickResponseToView(): void {
    const request = localStorage.getItem('#navToDataPresentTagId');
    localStorage.removeItem('#navToDataPresentTagId');

    this.dataResultSettingsService.setSettings(JSON.parse(request));
    this.router.navigate(['datapresentation/result/data']);
  }

  createDatePicker(e: any) {
    const valAttr = $(e.currentTarget).attr('data-datepicker-id');
    const datepickerElement = document.createElement('datepicker-element');
    (<any>datepickerElement).fastPanel = true;
    $(`div[data-datepicker-id="${valAttr}"]`).append(datepickerElement);
  }

  public searchTextInput(event: any) {
    clearTimeout(this.searchTextInputTimeout);

    this.searchTextInputTimeout = setTimeout(() => {
      this.searchFilter = event;
      this.searchByFilter();
    }, 1000);
  }

  private searchByFilter() {
    if (this.searchFilter && this.searchFilter.trim().length) {
      $(`*[${filterAttribute}]`).each((index: number, el: HTMLElement) => {
        if (
          $(el)
            .attr(`${filterAttribute}`)
            .toLowerCase()
            .indexOf(this.searchFilter.toLowerCase()) !== -1
        ) {
          $(el).removeClass(notFoundClass);
        } else {
          $(el).addClass(notFoundClass);
        }
      });
    } else {
      // ������ ������� ��� ������ ������
      $(`*[${filterAttribute}]`).each((index: number, el: HTMLElement) => {
        $(el).removeClass(notFoundClass);
      });
    }
  }

  
  private updateTotal() {
    this.total = $(`*[${filterAttribute}]:not(.${notFoundClass})`).length;
  }

  private createPrintElement() {
    let createElement = () => {
      let iFrame = document.createElement('iframe');
      iFrame.setAttribute('src', 'assets/printable.html');
      document.body.appendChild(iFrame);
      return iFrame;
    };

    if ((<any>window).printableFrame) {
      document.body.removeChild((<any>window).printableFrame);
    }

    (<any>window).printableFrame = createElement();
  }

  public print() {
    this.loadingContent = true;

    this.currentDataService.print(this.unitId, this.selectedPage.Id).subscribe(
      (data: any) => {
        this.loadingContent = false;
        this.createPrintElement();
        if ((<any>window).printableFrame) {
          let iFrame = (<any>window).printableFrame;
          iFrame.contentWindow.document.open();
          iFrame.contentWindow.document.write(
            `${data}<script>window.print()</script>`
          );
          iFrame.contentWindow.document.close();
        }
      },
      (error: any) => {
        this.errorsContent.push(error);
        this.loadingContent = false;
      }
    );
  }

  public export() {
    this.loadingContent = true;
    this.currentDataService.export(this.unitId, this.selectedPage.Id).subscribe(
      (data: any) => {
        this.loadingContent = false;
        if (navigator.msSaveOrOpenBlob) {
          navigator.msSaveOrOpenBlob(data.blob, data.fileName);
        } else {
          let downloadLink = document.createElement('a');
          let url = window.URL.createObjectURL(data.blob);
          downloadLink.href = url;
          downloadLink.download = data.fileName;

          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }
      },
      (error: any) => {
        this.errorsContent.push(error);
        this.loadingContent = false;
      }
    );
  }
}
