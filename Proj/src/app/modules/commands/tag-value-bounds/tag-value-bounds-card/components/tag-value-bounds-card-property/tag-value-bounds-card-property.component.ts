import { AppLocalization } from 'src/app/common/LocaleRes';
import {
  ITagValueBound,
  TagValueBound,
} from './../../../../../../services/commands/Models/TagValueBounds';
import { TagValueBoundsService } from 'src/app/services/commands/Configuration/tag-value-bounds.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { IEntityViewProperty } from 'src/app/services/common/Interfaces/IEntityViewProperty';
import { TagValueDiscreteBound } from 'src/app/services/commands/Models/TagValueDiscreteBound';
import { TagValueTopDownBound } from 'src/app/services/commands/Models/TagValueTopDownBound';
import { ITagValueBaseBound } from 'src/app/services/commands/Models/TagValueBaseBound';

@Component({
  selector: 'rom-tag-value-bounds-card-property',
  templateUrl: './tag-value-bounds-card-property.component.html',
  styleUrls: ['./tag-value-bounds-card-property.component.less'],
})
export class TagValueBoundsCardPropertyComponent implements OnInit, OnDestroy {
  public loadingContent: boolean;
  public errors: any[] = [];
  public errorLoadEntity: any;

  private idBound: number | string;
  private subscription$: Subscription;
  private userGroup$: Subscription;
  private bound$: Subscription;

  public properties: IEntityViewProperty[];
  public get isNew() {
    return this.idBound === 'new';
  }
  public typeBound: any;
  public tagValueBound: ITagValueBaseBound;
  constructor(
    private tagValueBoundsService: TagValueBoundsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.subscription$ = this.activatedRoute.parent.params.subscribe(
      (params) => {
        this.idBound = params.id;
      }
    );
  }

  ngOnInit() {
    this.loadBounds();
  }

  ngOnDestroy() {
    this.unsubscriber(this.subscription$);
    this.unsubscriber(this.userGroup$);
    this.unsubscriber(this.bound$);
  }

  private loadBounds() {
    this.loadingContent = true;
    this.bound$ = this.tagValueBoundsService
      .get(this.idBound)
      .pipe(
        finalize(() => {
          this.loadingContent = false;
        })
      )
      .subscribe(
        (data: ITagValueBound) => {
          if (data.Bounds != null) {
            this.tagValueBound = data.Bounds;
            const arrayTypeValues = this.tagValueBoundsService.getBoundTypes();
            if (this.tagValueBound.Type === 0) {
              this.typeBound = arrayTypeValues[0];
            } else {
              this.typeBound = arrayTypeValues[1];
            }
          }
          this.initProperties(data);          
        },
        (error: any) => {
          this.errorLoadEntity = error;
        }
      );
  }

  private initProperties(valueBound: ITagValueBound) {
    const objClone = {
      ...valueBound,
      Bounds: { Name: valueBound.Bounds.Type },
    };
    this.properties = [
      {
        Code: 'Name',
        Name: AppLocalization.Name,
        Type: 'String',
        Value: objClone.Name,
        IsRequired: true,
      },
      {
        Code: 'GenerateMissedEvents',
        Name: AppLocalization.GenerateMissedEvents,
        Type: 'Bool',
        Value: objClone.GenerateMissedEvents,
      },
      {
        Code: 'Bounds',
        Name: AppLocalization.Values,
        Type: 'Option',
        Value: this.typeBound,
      },
    ];
  }

  optionControlDropDown(event: any) {
    if (event.control.event === 'LOAD_TRIGGER') {
      const property = event.property;
      property.arrayValues = this.tagValueBoundsService.getBoundTypes();
    } else if (event.control.event === 'SELECT') {
      // const device = {};
      // event.properties.forEach((prop: IEntityViewProperty) => {
      //   if (prop.Code !== 'MinimumValue' && prop.Code !== 'MaximumValue') {
      //     device[prop.Code] = prop.Value;
      //   }
      // });
      // this.initProperties(device as ITagValueBound);
      this.typeBound = event.property.Value;
      if (this.typeBound.Id === 1) {
        this.tagValueBound = new TagValueDiscreteBound();
      } else if (this.typeBound.Id === 2) {
        this.tagValueBound = new TagValueTopDownBound();
      }
    }
  }

  public save(properties: IEntityViewProperty[], propControl: any) {
    this.errors = [];
    const bound = new TagValueBound();
    if (!this.isNew) {
      bound.Id = this.idBound as number;
    }
    properties.forEach((prop: IEntityViewProperty) => {
      bound[prop.Code] = prop.Value;
    });
    if (!bound.Name) {
      this.errors = [AppLocalization.YouNeedToSetAName];
      return;
    }
    const request = {
      tagValueBound: bound,
      tagValueTopDownBoundDto: this.typeBound.Id === 2 ? this.tagValueBound : null,
      tagValueDiscreteBoundDto: this.typeBound.Id === 1 ? this.tagValueBound : null
    }
    this.loadingContent = true;
    this.tagValueBoundsService
      .post(request as any)
      .then((idBound: number) => {
        this.loadingContent = false;

        if (this.isNew) {
          this.router.navigate(['../../../bounds/' + idBound], {
            relativeTo: this.activatedRoute,
          });
        } else {
          this.loadBounds();
        }

        propControl.cancelChangeProperty();
      })
      .catch((error: any) => {
        this.loadingContent = false;
        this.errors = [error];
      });
  }

  private unsubscriber(subscription: Subscription) {
    if (subscription) {
      subscription.unsubscribe();
    }
  }
}
