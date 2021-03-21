import { AppLocalization } from 'src/app/common/LocaleRes';
import {Component, OnInit, HostListener, ViewChild} from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminGroupService } from '../../../../services/admin.module/admin.group/AdminGroup.service';
import { AdminUserGroupEditView } from '../../../../services/admin.module/admin.group/Models/AdminUserGroupEditView';
import { GlobalValues } from '../../../../core';
import * as RU from '../../../../common/Constants';
import Constant = RU.Common.Constants;
import {AdminGroupsService} from '../../../../services/admin.module/admin.groups/AdminGroups.service';
import {Subscription} from 'rxjs';
import { LdapNode } from '../../../../services/admin.module/interfaces/ldap-node';

@Component({
    selector: 'app-admin-group-properties',
    templateUrl: './admin-group-properties.component.html',
    styleUrls: ['./admin-group-properties.component.less']
})
export class AdminGroupPropertiesComponent implements OnInit {
    public errors: any[] = [];
    public errorLoadGroup: string;
    public loadingContentPanel: boolean = true;
    public urlParamsSubscribe: Subscription;
    public groupId: string | number;
    public isPropEdit: boolean = false;
    public statuses_names = Constant.ADMIN_MODULE.statuses_names;
    public group: AdminUserGroupEditView;
    public __group: AdminUserGroupEditView;//save group if edit, for rollback

    public formValidateGroup: FormGroup;
    public ldapNodesData: LdapNode[];
    mainPageData: any[];

    public get isNew() {
        return this.groupId === 'new';
    }

    @ViewChild('dropDown', { static: false }) public dropDown: any;

    constructor(
        public adminGroupService: AdminGroupService,
        public activatedRoute: ActivatedRoute,
        public router: Router,
        public adminGroupsService: AdminGroupsService,
    ) {
        this.urlParamsSubscribe = this.activatedRoute.parent.params.subscribe(
            params => {
                this.groupId = params['id'];
                if (this.isNew) {
                    this.isPropEdit = true;
                }
                //разобраться, почему не работает запуск конструктора заново, при смене new на id группы
                this.loadGroupsData();
            }
        );
    }

    ngOnInit() {
        this.getLdapNodes();
    }

    @HostListener('document:keydown', ['$event']) onKeyDownFilter(event: KeyboardEvent) {
        if (event.ctrlKey) {
            //Ctrl + s = save
            if (event.keyCode === 83) {
                event.preventDefault();
                this.saveGroup();
            }
        } else {
            if (event.keyCode === 27) {
                this.cancel();
            }
        }
    }

    private getLdapNodes(): void {
        this.adminGroupsService.getLdapNodes().then(
            (response) => {
                this.ldapNodesData = [...response];
            }
        );
    }

    public onItemSelected(event: LdapNode): void {
        this.group.LdapPath = event.Path;
        this.group.LdapGroupPath = event.Path;
    }

    get groupName() {
        return this.formValidateGroup.get('groupName');
    }

    public forbidden = (nameRe: RegExp): ValidatorFn => {
        return (control: AbstractControl): { [key: string]: any } | null => {
            //const forbidden = nameRe.test(control.value);
            //return forbidden ? { 'forbiddenName': { value: control.value } } : null;
            let value = `${control.value}`;
            if (value.length && !nameRe.exec(`${value}`)) {
                return { 'forbiddenName': { value: control.value } };
            }
            return null;
        };
    }

    createFormGroup() {
        this.formValidateGroup = new FormGroup({
            groupName: new FormControl(this.group.Name, [
                Validators.required,
                //Validators.minLength(4),
                this.forbidden(/[a-zA-Zа-яА-Я0-9\S]+/)
            ])
        });
    }

    loadGroupsData() {
        this.adminGroupService.getGroup(this.groupId).subscribe(
            (group: AdminUserGroupEditView) => {
                this.loadingContentPanel = false;
                this.group = group;
                this.createFormGroup();
                if (this.group.Id) {
                    this.updateGroup();
                }
            },
            (error: any) => {
                if (error && error.ShortMessage && (error.ShortMessage as string).toLowerCase().startsWith('permission denied')) {
                    error.ShortMessage = AppLocalization.Label20;
                  }
                this.loadingContentPanel = false;
                this.errorLoadGroup = error.ShortMessage;
            });
    }

    updateGroup() {
        let group: AdminUserGroupEditView = this.group;
        if (this.__group == null) {
            this.__group = { ...group };
        }
    }

    changeProperties() {
        this.isPropEdit = true;
    }

    cancelChangeProperty() {
        this.isPropEdit = false;
    }

    rollBackProperty() {
        this.group = { ...this.__group };
        this.createFormGroup();
    }

    cancel() {
        if (this.isNew) {
            //redirect to back page
            this.back2Objects();
        } else {
            this.rollBackProperty();
            this.cancelChangeProperty();
        }
    }

    goToEditPage(idEntity: number) {
        this.router.navigate([`../${idEntity}/properties`], { relativeTo: this.activatedRoute.parent });
    }

    saveGroup() {
        if (!this.formValidateGroup.valid) {
            return;
        }
        const groupClone = {...this.group};
        this.loadingContentPanel = true;
        this.adminGroupService.postGroup(groupClone).then(
            (idEntity: number) => {
                this.loadingContentPanel = false;
                if (this.isNew) {
                    this.goToEditPage(idEntity);
                } else {
                    this.updateGroup();
                }
                this.cancelChangeProperty();
            }).catch(
                (error: any) => {
                    this.loadingContentPanel = false;
                    this.errors.push(error);
                });
    }

    back2Objects() {
        GlobalValues.Instance.Page.backwardButton.navigate();
    }

    /* клик по форме - нужен для ngbDropdown(dropDown) */
    @HostListener('window:click', ['$event']) public onWindowClick(event: any) {
        if (this.isPropEdit && this.dropDown) {
            this.dropDown.close();
        }
    }

    public openTreeLdap(dropDown: any) {
        try {
            dropDown.open();
        } catch (e) {
        }
    }

    mainPageDropdown() {
        this.mainPageData = this.adminGroupService.appConfig.getConfig('groupPages') || [];
    }

    //закрываем всплытие, точно знаем, что кликнули в области input-box или дерева, в ином случае window.click - закрывать окно
    public stopPropagation(event: any) {
        event.stopPropagation();
    }
}
