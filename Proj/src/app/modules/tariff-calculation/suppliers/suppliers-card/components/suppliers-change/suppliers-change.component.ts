import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AppLocalization } from 'src/app/common/LocaleRes';
import { GlobalValues, Utils } from 'src/app/core';
import { TariffSupplier } from 'src/app/services/taiff-calculation/suppliers/Models/TariffSupplier';
import { SuppliersService } from 'src/app/services/taiff-calculation/suppliers/suppliers.service';

@Component({
  selector: 'app-suppliers-change',
  templateUrl: './suppliers-change.component.html',
  styleUrls: ['./suppliers-change.component.less']
})
export class SuppliersChangeComponent implements OnInit {

  public loadingContent: boolean;
  public saveComplete: boolean;
  public errors: any[] = [];
  public date: Date | string = new Date();
  public suppliers: TariffSupplier[];
  public suppliers1: TariffSupplier[];
  public suppliers2: TariffSupplier[];
  public supplier1: TariffSupplier;
  public supplier2: TariffSupplier;
  constructor(
    private router: Router,
    private suppliersService: SuppliersService,
  ) { }

  ngOnInit() {
    this.loadData();
  }

  @HostListener('document:keydown', ['$event']) onKeyDownFilter(event: KeyboardEvent) {
        if (event.ctrlKey) {
            // Ctrl + s = save
            if (event.keyCode === 83) {
                event.preventDefault();
                this.save();
            }
        } else {
            if (event.keyCode === 27) {
                this.cancel();
            }
        }
    }

  public loadData() {
    this.loadingContent = true;
    this.suppliersService
      .get()
      .pipe(
        finalize(() => this.loadingContent = false)
      )
      .subscribe(
        (results: TariffSupplier[]) => {
          this.suppliers = results.map(r => ({...r}));
          this.suppliers1 = results.map(r => ({...r}));
          this.suppliers2 = results.map(r => ({...r}));
        },
        (error) => { this.errors = [error]}
      )
  }

  public changeSupplier1(s: TariffSupplier) {
    this.supplier1 = s;
    if (this.supplier2 != null && s != null && this.supplier2.Id === s.Id) {
      delete this.supplier2;
    }
    this.suppliers2 = this.suppliers.map(r => ({...r})).filter(x => x.Id !== s.Id);
  }

  public changeSupplier2(s: TariffSupplier) {
    this.supplier2 = s;
    if (this.supplier1 != null && s != null && this.supplier1.Id === s.Id) {
      delete this.supplier1;
    }
    this.suppliers1 = this.suppliers.map(r => ({...r})).filter(x => x.Id !== s.Id);
  }

  save() {
    if (this.supplier1 == null) {
      this.errors = [AppLocalization.Label1];
      return;
    }
    if (this.supplier2 == null) {
      this.errors = [AppLocalization.Label2];
      return;
    }
    this.saveComplete = true;
    this.loadingContent = true;
    const request = {
      Date: Utils.DateConvert.toDateTimeRequest(this.date),
      IdSourceTariffSupplier: this.supplier1.Id,
      IdDestTariffSupplier: this.supplier2.Id
    }
    this.suppliersService
      .replace(request)
      .then(_ => {
        this.loadingContent = false;
        this.cancel();
      })
      .catch((error: any) => {
        this.loadingContent = false;
        this.errors = [error];
      });
  }

  cancel() {
    this.saveComplete = true;
    this.router.navigate(['tariff-calc/suppliers']);
  }
}
