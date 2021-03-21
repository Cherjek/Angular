import { AppLocalization } from 'src/app/common/LocaleRes';
import { Utils } from 'src/app/core';
import { Subscription, forkJoin } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IScriptEditor } from 'src/app/services/script-editor/model/script-editor';
import { ScriptEditorService } from 'src/app/services/script-editor/script-editor.service';
import { DataQueryMainService } from 'src/app/services/data-query';

@Component({
  selector: 'rom-script-editor-card-check',
  templateUrl: './script-editor-card-check.component.html',
  styleUrls: ['./script-editor-card-check.component.less'],
})
export class ScriptEditorCardCheckComponent implements OnInit {
  loadingContent: boolean;
  errors: any[] = [];
  isPropEdit = true;
  valueTypes: any;
  editorData: IScriptEditor = {} as any;
  executeSuccess = false;
  compileSuccess = false;
  resultList: any = [];
  alert: any;
  resultMessages: any = [];
  private alertTimeout: any;
  private scriptId: number | string;
  private routeSub$: Subscription;
  private editorSub$: Subscription;
  get isNew() {
    return this.scriptId === 'new';
  }
  public headers = [
    {
      Code: 'Script',
      Name: AppLocalization.Script,
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
      this.goBack();
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
        if (data[0]) {
          const params = data[0].Parameters;
          const results = data[0].Results;
          if (params && params.length) {
          }
          if (results && results.length) {
          }
        }
        this.valueTypes = data[1];
        this.loadingContent = false;
      }
    );
  }
  cancel() {
    this.errors = [];
    this.goBack();
  }

  check() {
    this.beforeOperation();
    this.scriptEditorService
      .post({ text: this.editorData.Text } as any, 'compile')
      .then((res: any[]) => {
        if (!res.length) {
          this.compileSuccess = true;
        }
        this.resultList = res;
        this.loadingContent = false;
      })
      .catch((err) => {
        this.errors = [err];
        this.loadingContent = false;
      });
  }

  execute() {
    this.beforeOperation();
    const params = this.editorData.Parameters;
    const paramsClone = params.map((x) => ({ ...x }));
    let parameters: any = [];
    if (paramsClone && paramsClone.length) {
      parameters = paramsClone
        .map((x) => ({
          name: x.Name,
          value: (() => {
            const interval = (val: any) => (val != undefined ? `,${val}` : '');
            if (x.Value && x.ValueType.Name.toLowerCase().includes('date')) {
              x.Value =
                Utils.DateConvert.toDateTimeRequest(x.Value) +
                interval(Utils.DateConvert.toDateTimeRequest(x.ToValue));
              return x.Value;
            }
            if (x.ValueType.Name.toLowerCase() == 'bool') {
              x.Value = Boolean(x.Value);
            }
            const result = (x.Value + interval(x.ToValue)) as any;
            return !isNaN(result) ? +result : result;
          })(),
        }))
        .filter((x: any) => x.value !== 'undefined');
    }
    this.scriptEditorService
      .post(
        {
          text: this.editorData.Text,
          parameters,
          results: this.editorData.Results.length
            ? this.editorData.Results.map((x) => ({ name: x.Name }))
            : [],
        } as any,
        'execute'
      )
      .then((data) => {
        this.resultMessages = data;
        this.executeSuccess = true;
        this.loadingContent = false;
      })
      .catch((err) => {
        // this.errors = [err];
        this.resultList = Array.isArray(err) ? err : [err];
        this.loadingContent = false;
      });
  }

  save() {
    this.loadingContent = true;
    this.scriptEditorService
      .post(this.editorData)
      .then((id: number) => {
        this.loadingContent = false;
        this.showAlert(AppLocalization.SavedSuccessfully, 'success');
      })
      .catch((err) => {
        this.errors = [err];
        this.loadingContent = false;
      });
  }

  closeAlert() {
    this.alert = null;
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
  }

  private showAlert(msg: string, type: string, timeout = 2000) {
    this.alert = {
      msg,
      type,
    };
    this.alertTimeout = setTimeout(() => {
      this.alert = null;
    }, timeout);
  }

  private goBack() {
    this.router.navigate(['../'], {
      relativeTo: this.activatedRoute,
    });
  }
  private unsubscriber(subs: Subscription[]) {
    subs.forEach((sub) => {
      if (sub) sub.unsubscribe();
    });
  }
  private beforeOperation() {
    this.executeSuccess = this.compileSuccess = false;
    this.loadingContent = true;
    this.resultList = [];
  }
}
