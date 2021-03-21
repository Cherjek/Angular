import { AppLocalization } from 'src/app/common/LocaleRes';
import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  AfterViewInit,
  Injector,
  OnDestroy,
} from '@angular/core';
import { DataGrid } from 'src/app/controls/DataGrid';
import { ActivatedRoute } from '@angular/router';
import { WebService } from 'src/app/services/common/Data.service';
import { forkJoin, Subscription, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { IInlineGrid } from 'src/app/services/common/Interfaces/IInlineGrid';
import { PermissionCheck } from 'src/app/core';

@Component({
  selector: 'rom-inline-grid',
  templateUrl: './inline-grid.component.html',
  styleUrls: ['./inline-grid.component.less'],
})
export class InlineGridComponent implements OnInit, AfterViewInit, OnDestroy {
  public loadingContent = true;
  public editMode = false;
  @ViewChild('dataGridRo5', { static: false }) dataGrid: DataGrid;
  @ViewChild('columnTextTemplate', { static: false })
  public columnTextTemplate: TemplateRef<any>;
  @ViewChild('columnActionsTemplate', { static: false })
  public columnActionsTemplate: TemplateRef<any>;
  title = '';
  private keyField = 'Id';

  private _isSavedClicked: any;
  sub$: Subscription;
  private _subServiceData: any;
  columnsValues = {};
  route$: Subscription;
  private _isEmptyCell: boolean;
  alert: any;
  private alertTimeout: any;
  private firstTimeLoad = true;
  permission: any;
  permissionAdd: any;
  permissionEdit: any;
  permissionDelete: any;
  public get isEmptyCell(): boolean {
    return this._isEmptyCell;
  }
  public set isEmptyCell(value: boolean) {
    this._isEmptyCell = value;
  }
  public get subServiceData(): any {
    return this._subServiceData;
  }
  public set subServiceData(value: any) {
    this._subServiceData = null;
    this._subServiceData = [...value];
  }

  get isSavedClicked() {
    return this._isSavedClicked;
  }

  set isSavedClicked(value) {
    this._isSavedClicked = value;
  }

  searchBoxStyle: any = { 'max-width': 'calc(100% - 57px)' };

  data: any = [];

  columns: any = [];
  currentEditingItemId: number;
  itemCloneBeforeEdit: any;
  itemAfterEdit: any;
  service: WebService<any> & IInlineGrid;
  subServices: any[];
  routeData: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private injector: Injector,
    private permissionCheck: PermissionCheck
  ) {}

  ngOnInit() {
    this.routeData = this.activatedRoute.snapshot.data;
    if (this.routeData.access != null) {
      if (typeof this.routeData.access === 'string') {
        this.permission = this.routeData.access;
      } else {
        if (this.routeData.access.add)
          this.permissionAdd = this.routeData.access.add;
        if (this.routeData.access.edit)
          this.permissionEdit = this.routeData.access.edit;
        if (this.routeData.access.delete)
          this.permissionDelete = this.routeData.access.delete;
      }
    }
    this.title = this.routeData.title || '';
    this.service = this.injector.get(this.routeData.service);
    this.route$ = this.activatedRoute.parent.params.subscribe((x) => {
      this.service.params = x;
    });
    this.subServices = (this.routeData.subServices || []).map(
      (servObj: any) => {
        if (servObj.getMethod && !servObj.service) {
          servObj.service = this.routeData.service;
        }
        let objInstance: any;
        if (servObj) {
          const instance = this.injector.get(servObj.service);
          // setting instance methods and properties
          objInstance = Object.assign(
            Object.create(Object.getPrototypeOf(instance)),
            instance
          );
          objInstance.getMethod = servObj.getMethod || 'get';
          objInstance.columnNames = servObj.columnNames;
        }
        return objInstance;
      }
    );
    this.accessDataGridInit().subscribe((results: boolean[]) => {
      if (!results[0]) {
        this.searchBoxStyle = {};
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (((this.routeData || {}).columns || []).length) {
        this.loadColumns(this.routeData);
      }
    });
  }

  ngOnDestroy() {
    this.unsubscriber(this.sub$);
    this.unsubscriber(this.route$);
  }

  private loadColumns(compData: any) {
    if (compData && compData.columns && typeof compData.columns === 'string') {
      this.service[compData.columns]().subscribe((result: any) => {
        this.columns = result;
        this.initDataGrid();
      });
    } else {
      this.columns = compData.columns;
      this.initDataGrid();
    }
  }

  private initDataGrid() {
    this.createColumns();
    this.loadDataGrid();
    this.initData();
  }

  private createColumns() {
    this.columns[0].FocusEditCell = true;

    const columns = (this.columns || []).map((x: any) => {
      if (x) {
        x.CellTemplate = this.columnTextTemplate;
        return x;
      }
    });

    this.columns = columns;
    this.columns.push({
      Name: 'ActionButtons',
      CellTemplate: this.columnActionsTemplate,
      Width: 200,
    });
  }

  private loadDataGrid() {
    this.dataGrid.Columns = this.columns;
    this.dataGrid.KeyField = this.keyField;
  }

  private initData() {
    const checkParams = (params: any[]) =>
      params !== undefined && params.length;
    this.sub$ = forkJoin([
      this.service.read(),
      ...(this.subServices.map((s) => {
        const serviceParam = s.params; // parameters for service
        if (checkParams(serviceParam)) {
          return s[s.getMethod](...serviceParam);
        }
        return s[s.getMethod]();
      }) || []),
    ])
      .pipe(finalize(() => (this.loadingContent = false)))
      .subscribe(
        (data: any[]) => {
          if (data.length) {
            this.data = data[0]; // сброс данных на Добавить новый
            this.dataGrid.DataSource = data[0];
            data.shift();
            if (data.length) {
              data.forEach((columnData, index) => {
                const columnNames = this.subServices[index].columnNames || [];
                columnNames.forEach((columnName: string) => {
                  if (columnName) {
                    this.columnsValues[columnName] = [...columnData];
                  }
                });
              });
            }

            this.editMode = false;
            if (!this.firstTimeLoad) {
              this.showAlert(AppLocalization.Successfully, 'success');
            }
            this.firstTimeLoad = false;
          }
        },
        (err) => {
          this.showAlert(err.ShortMessage, 'danger');
        }
      );
  }

  private accessDataGridInit(): Observable<boolean[]> {
    const checkAccess = [
      this.permission,
      this.permissionAdd,
      this.permissionEdit,
      this.permissionDelete,
    ];

    const obsrvs: any[] = [];
    checkAccess
      .filter((x) => x != null)
      .forEach((access: string | string[]) => {
        obsrvs.push(this.permissionCheck.checkAuthorization(access));
      });

    return forkJoin<boolean>(obsrvs);
  }

  cancelEdit() {
    if (this.currentEditingItemId) {
      this.resetInput();
    } else {
      this.removeNewEmptyObject();
    }
    this.editMode = false;
  }

  itemEdit(item: any) {
    this.cancelEdit();
    this.itemAfterEdit = item;
    this.itemCloneBeforeEdit = { ...item };
    this.currentEditingItemId = item.Id;
    this.editMode = true;
  }

  addNew() {
    this.isSavedClicked = false;
    this.cancelEdit();
    this.currentEditingItemId = null;
    const newObj = {};
    for (const prop in this.data[0]) {
      if (prop) {
        newObj[prop] = null;
      }
    }
    this.dataGrid.DataSource = [newObj, ...this.data];
    this.editMode = true;

    this.scrollToTop();
  }

  saveItem(item: any = null) {
    this.isSavedClicked = true;
    // при нажатии Ctrl + s нажал вместо "сохранить"
    if (!item) {
      const source = this.dataGrid.DataSource;
      let editedItem = (source || []).find(
        (x) => x.Id === this.currentEditingItemId
      );
      // для обработки, когда нет элементов в таблице, а когда новый элемент добавляется не имеет ID
      if (!editedItem && source.length > 0) {
        editedItem = source[0];
      }
      if (editedItem) {
        item = editedItem;
      }
    }
    this.evaluateBoolValues(item);
    if (!this.validate(item)) {
      this.loadingContent = false;
      return;
    }
    this.service.create(item).then(
      (_: any) => {
        if (typeof this.routeData.columns === 'string') {
          this.loadColumns(this.routeData);
        } else {
          this.initData();
        }
      },
      (err: any) => {
        this.showAlert(err.ShortMessage, 'danger');
        this.loadingContent = false;
      }
    );
  }

  closeAlert() {
    this.alert = null;
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
  }

  deleteItem(item: any) {
    if (!item) {
      return;
    }
    this.loadingContent = true;
    this.service.remove(item.Id).then(
      () => {
        if (this.routeData.config && this.routeData.config.isDynamic) {
          this.dataGrid.DataSource = this.dataGrid.DataSource.filter(
            (x) => x.Id !== item.Id
          );
          this.loadingContent = false;
        } else {
          this.initData();
        }
      },
      (err: any) => {
        this.showAlert(err.ShortMessage, 'danger', 20000);
        this.loadingContent = false;
      }
    );
  }

  private removeNewEmptyObject() {
    if (
      this.dataGrid.DataSource.length &&
      this.dataGrid.DataSource[0][this.keyField] == null
    ) {
      (this.dataGrid.DataSource || []).shift();
    }
  }

  private validate(item: any) {
    this.isEmptyCell = false;
    this.loadingContent = true;
    if (this.topObjectIsEmpty()) {
      this.loadingContent = false;
      this.showAlert(AppLocalization.AllFieldsEmpty, 'danger');
      return false;
    }
    for (const column of this.columns) {
      if (typeof item[column.Name] === 'string') {
        item[column.Name] = item[column.Name].trim();
      }
      if (
        column.IsRequired &&
        (item[column.Name] == null || item[column.Name] === '')
      ) {
        this.isSavedClicked = true;
        this.isEmptyCell = true;
        return false;
      }
    }
    return true;
  }

  // поле 'input box' при отмене
  private resetInput() {
    for (const prop in this.itemCloneBeforeEdit) {
      if (this.itemAfterEdit.hasOwnProperty(prop)) {
        if (prop !== this.keyField && prop) {
          this.itemAfterEdit[prop] = this.itemCloneBeforeEdit[prop];
        }
      }
    }
  }

  private topObjectIsEmpty() {
    return Object.values(this.dataGrid.DataSource[0]).every((x) => x == null);
  }

  private unsubscriber(sub: Subscription) {
    if (sub) {
      sub.unsubscribe();
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

  private evaluateBoolValues(item: any) {
    const boolCols = (this.columns || []).filter(
      (column: any) => column.Type && column.Type.toLocaleLowerCase() === 'bool'
    );
    (boolCols || []).forEach((col: any) => {
      if (col && !item[col.Name]) {
        item[col.Name] = false;
      }
    });
  }

  private scrollToTop() {
    setTimeout(() => {
      this.dataGrid.virtualScroll.scrollToIndex(0);
    });
  }
}
