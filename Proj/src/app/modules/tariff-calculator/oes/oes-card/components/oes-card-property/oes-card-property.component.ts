import { AppLocalization } from 'src/app/common/LocaleRes';
import { OES } from './../../../../../../services/tariff-calculator/models/oes';
import { OesService } from 'src/app/services/tariff-calculator/oes.service';
import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { IEntityViewProperty } from '../../../../../../services/common/Interfaces/IEntityViewProperty';

@Component({
  selector: 'rom-oes-card-property',
  templateUrl: './oes-card-property.component.html',
  styleUrls: ['./oes-card-property.component.less'],
})
export class OesCardPropertyComponent implements OnDestroy {
  public loadingContent: boolean;
  public errors: any[] = [];
  public errorLoadEntity: any;

  private idZone: number | string;
  private subscription: Subscription;
  sub$: Subscription;

  public get isNew() {
    return this.idZone === 'new';
  }
  public properties: IEntityViewProperty[];

  constructor(
    private oesService: OesService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.subscription = this.activatedRoute.parent.params.subscribe(
      (params) => {
        this.idZone = params.id;

        this.loadItems();
      }
    );
  }

  ngOnDestroy() {
    this.unsubscriber(this.subscription);
    this.unsubscriber(this.sub$);
  }

  private loadItems() {
    this.loadingContent = true;
    this.sub$ = this.oesService
      .get(this.idZone)
      .pipe(
        finalize(() => {
          this.loadingContent = false;
        })
      )
      .subscribe(
        (data: OES) => {
          this.initProperties(data);
        },
        (error: any) => {
          this.errorLoadEntity = error;
        }
      );
  }

  private initProperties(oes: OES) {
    this.properties = [
      {
        Code: 'Name',
        Name: AppLocalization.Name,
        Type: 'String',
        Value: oes.Name,
        IsRequired: true,
      },
      {
        Code: 'Code',
        Name: AppLocalization.Code,
        Type: 'String',
        Value: oes.Code,
        IsRequired: true,
      },
    ];
  }

  public save(properties: IEntityViewProperty[], propControl: any) {
    this.errors = [];
    const oes = new OES();
    if (!this.isNew) {
      oes.Id = this.idZone as number;
    }
    properties.forEach((prop: IEntityViewProperty) => {
      if (typeof prop.Value === 'string') {
        prop.Value = prop.Value.trim();
      }
      oes[prop.Code] = prop.Value;
    });
    if (!oes.Name) {
      this.errors = [AppLocalization.YouNeedToSetAName];
      return;
    } else if (!oes.Code) {
      this.errors = [AppLocalization.YouNeedToSetTheCode];
      return;
    }
    this.loadingContent = true;
    this.oesService
      .post(oes)
      .then((id) => {
        this.loadingContent = false;

        if (this.isNew) {
          this.router.navigate(['../../' + id], {
            relativeTo: this.activatedRoute,
          });
        } else {
          this.loadItems();
        }

        propControl.cancelChangeProperty();
      })
      .catch((error: any) => {
        this.loadingContent = false;
        this.errors = [error];
      });
  }

  private unsubscriber(sub: Subscription) {
    if (sub) {
      sub.unsubscribe();
    }
  }
}
