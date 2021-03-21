import { AppLocalization } from 'src/app/common/LocaleRes';
import { Subscription, forkJoin } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IScriptEditor } from 'src/app/services/script-editor/model/script-editor';
import { ScriptEditorService } from 'src/app/services/script-editor/script-editor.service';
import { ScriptParameter } from 'src/app/services/script-editor/model/script-parameter';
import { DataQueryMainService } from 'src/app/services/data-query';

@Component({
  selector: 'rom-script-editor-card-property',
  templateUrl: './script-editor-card-property.component.html',
  styleUrls: ['./script-editor-card-property.component.less'],
})
export class ScriptEditorCardPropertyComponent implements OnInit {
  loadingContent: boolean;
  errors: any[] = [];
  isPropEdit = false;
  editorDataClone: string;
  valueTypes: any;
  editorData: IScriptEditor = {} as any;
  private lastParamId: number;
  private lastResultId: number;
  private scriptId: number | string;
  private routeSub$: Subscription;
  private editorSub$: Subscription;
  get isNew() {
    return this.scriptId === 'new';
  }
  public headers = [
    {
      Code: 'Property',
      Name: AppLocalization.Properties,
    },
    {
      Code: 'Parameters',
      Name: AppLocalization.Options,
    },
    {
      Code: 'Results',
      Name: AppLocalization.Result,
    },
  ];
  constructor(
    private activatedRoute: ActivatedRoute,
    private scriptEditorService: ScriptEditorService,
    private router: Router,
    private dataQueryService: DataQueryMainService
  ) {
    this.routeSub$ = this.activatedRoute.parent.params.subscribe((param) => {
      this.scriptId = param.id;
    });
  }

  ngOnInit() {
    if (this.isNew) {
      this.isPropEdit = true;
    }
    this.init();
  }

  ngOnDestroy() {
    this.unsubscriber([this.routeSub$, this.editorSub$]);
  }

  init() {
    const observs = [
      this.scriptEditorService.get(this.scriptId),
      this.dataQueryService.getValueTypes(),
    ];
    this.editorSub$ = forkJoin(observs).subscribe(
      (data: [IScriptEditor, any]) => {
        this.editorData = data[0];
        this.editorDataClone = JSON.stringify(data[0]);
        if (data[0]) {
          const params = data[0].Parameters;
          const results = data[0].Results;
          if (params && params.length) {
            this.lastParamId = params[params.length - 1].Id;
          }
          if (results && results.length) {
            this.lastResultId = results[results.length - 1].Id;
          }
        }
        this.valueTypes = data[1];
        if (!this.isNew) {
          this.isPropEdit = false;
          this.loadingContent = false;
        } else {
          this.addResultParameter(this.headers[1]);
          this.addResultParameter(this.headers[2]);
        }
      }
    );
  }
  cancel() {
    this.isPropEdit = false;
    this.errors = [];
    if (this.isNew) {
      this.goBack();
    } else {
      this.editorData = JSON.parse(this.editorDataClone);
    }
  }
  save() {
    this.loadingContent = true;
    this.errors = [];
    if (!this.validate()) {
      this.loadingContent = false;
      return;
    }
    this.scriptEditorService
      .post(this.editorData)
      .then((id: number) => {
        if (this.isNew) {
          this.router.navigate([`../../${id}`], {
            relativeTo: this.activatedRoute,
          });
        }
      })
      .then(() => this.init())
      .catch((err) => {
        this.errors = [err];
        this.loadingContent = false;
      });
  }
  addResultParameter(header: any) {
    const obj = new ScriptParameter();
    // const paraResult = this.editorData[header.Code];
    // if (paraResult && paraResult.length) {
    //   obj.Id = paraResult[paraResult.length - 1].Id + 1;
    // } else {
    //   if (header.Code == 'Parameters') {
    //     obj.Id = this.lastParamId || 1;
    //   } else obj.Id = this.lastResultId || 1;
    // }
    this.editorData[header.Code].push(obj);
  }
  deleteInput(name: string, data: any) {
    this.editorData[name] = this.editorData[name].filter(
      (x: any) => x.Id != data.Id
    );
  }
  private validate() {
    let isValid = true;
    this.errors = [];
    // this.filterNoNameValue();
    const isEmpty = (val: any) =>
      val === null || val === undefined || val.trim() === '';
    const errMsg = (msg: string, singular = true) => {
      this.errors = singular
        ? [`${msg} ${AppLocalization.Label84}`]
        : [`${msg} ${AppLocalization.Label85}`];
      isValid = false;
    };
    if (isEmpty(this.editorData.Name)) {
      errMsg(AppLocalization.Name);
    } else if (isEmpty(this.editorData.Text)) {
      errMsg(AppLocalization.Text);
    } else if (
      (this.editorData.Parameters || []).some(
        (x) =>
          isEmpty(((x || {}) as any).Name) ||
          ((x || {}) as any).ValueType == null
      )
    )
      errMsg(AppLocalization.TheNameAndValueOfTheSettings, false);
    else if (
      this.editorData.Results.some(
        (x) =>
          isEmpty(((x || {}) as any).Name) ||
          ((x || {}) as any).ValueType == null
      )
    )
      errMsg(AppLocalization.TheNameAndValueOfTheResults, false);
    return isValid;
  }
  private goBack() {
    this.router.navigate(['../../'], {
      relativeTo: this.activatedRoute,
    });
  }
  private unsubscriber(subs: Subscription[]) {
    subs.forEach((sub) => {
      if (sub) sub.unsubscribe();
    });
  }

  private filterNoNameValue() {
    const filterFunc = (val: any) =>
      val.filter((x: any) => x.Name || x.ValueType);
    const paramsWithInput = filterFunc(this.editorData.Parameters);
    const resultsWithInput = filterFunc(this.editorData.Results);
    this.editorData.Parameters = paramsWithInput.length
      ? paramsWithInput
      : [{ Id: 1 }];
    this.editorData.Results = resultsWithInput.length
      ? resultsWithInput
      : [{ Id: 1 }];
  }
}
