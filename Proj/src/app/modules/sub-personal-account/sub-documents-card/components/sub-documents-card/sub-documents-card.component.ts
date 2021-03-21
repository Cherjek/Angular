import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ContextButtonItem } from 'src/app/controls/ContextButton/ContextButtonItem';
import { NavigateItem } from 'src/app/common/models/Navigate/NavigateItem';
import { AppLocalization } from 'src/app/common/LocaleRes';
import { SubPersonalAccountDocsService } from 'src/app/services/sub-personal-account/sub-personal-account-docs.service';
import { IAppDocument } from 'src/app/services/sub-personal-account/models/app-document';

@Component({
  selector: 'rom-sub-documents-card',
  templateUrl: './sub-documents-card.component.html',
  styleUrls: ['./sub-documents-card.component.less'],
})
export class SubDocumentsCardComponent implements OnDestroy {
  public docName: string;
  public doc: IAppDocument;
  private docId: string | number;
  private sub$: Subscription;
  public loadingPanel: boolean;
  public headerErrors: any[] = [];
  public contextButtonItems: ContextButtonItem[];
  public menuItems: NavigateItem[] = [
    {
      code: 'property',
      url: 'property',
      name: AppLocalization.Properties,
    },
  ];
  subParam$: Subscription;

  public get isNew() {
    return this.docId === 'new';
  }

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private docsService: SubPersonalAccountDocsService
  ) {
    this.subParam$ = this.activateRoute.parent.params.subscribe((param) => {
      this.docId = param.id;
    });

    this.sub$ = this.docsService
      .get(this.docId)
      .subscribe((x: IAppDocument) => {
        this.doc = x;
        if (this.doc) {
          this.docName = `${this.doc.Name}`;
        }
      });
  }

  ngOnDestroy() {
    this.unsubscriber(this.sub$);
    this.unsubscriber(this.subParam$);
  }

  goBack() {
    this.router.navigate(['../'], {
      relativeTo: this.activateRoute,
    });
  }

  private unsubscriber(sub: Subscription) {
    if (sub) {
      sub.unsubscribe();
    }
  }
}
