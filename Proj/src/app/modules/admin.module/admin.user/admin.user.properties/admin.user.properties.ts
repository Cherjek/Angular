import { AppLocalization } from 'src/app/common/LocaleRes';
import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Subscription } from "rxjs/index";
import { ActivatedRoute, Router } from "@angular/router";
import { AdminUserService } from "../../../../services/admin.module/admin.user/AdminUser.service";
import { AdminGroupsService } from "../../../../services/admin.module/admin.groups/AdminGroups.service";
import { Chips } from "../../../../controls/Chips/Chips";
import { AdminUserGroupView } from "../../../../services/admin.module/admin.groups/Models/AdminUserGroupView";
import { AdminUser } from "../../../../services/admin.module/admin.users/Models/AdminUser";
import { AdminUserProperties } from "../../../../services/admin.module/admin.user/Models/AdminUserProperties";

import { GlobalValues } from "../../../../core";

import * as constants from '../../../../common/Constants';

const mainGroupUndefined: string = AppLocalization.NotDefine2;
const authTypes = constants.Common.Constants.ADMIN_MODULE.auth_types;

@Component({
    selector: 'admin-user-properties',
    templateUrl: './admin.user.properties.html',
    styleUrls: ['./admin.user.properties.css']
})
export class AdminUserPropertiestComponent implements OnInit, OnDestroy {
    loadingContentPanel: boolean;
    errors: any[] = [];
    subscription: Subscription;

    userId: any;
    isPropEdit: boolean;
    userProps: any[] = [];
    initialUserProps: any[];
    groups: any[];
    userError: boolean = false;
    codeAuthType: string;

    Status: string;
    Login: string;
    Name: string;
    PhoneNumber: string;
    Email: string;

    statusNames: any = constants.Common.Constants.ADMIN_MODULE.statuses_names;
    GlobalValues = GlobalValues.Instance;

    @ViewChild('groupChips', { static: false }) groupChips: Chips;
    @ViewChild('mainContainer', { static: true }) mainContainer: ElementRef;

    constructor(public activatedRoute: ActivatedRoute,
                public userPropsService: AdminUserService,
                public groupsService: AdminGroupsService,
                public router: Router) {
        this.subscription = this.activatedRoute.parent.params.subscribe(params => {
            this.userId = params['id'];

            if (this.newUser) {
                this.isPropEdit = true;
            } else {
                this.isPropEdit = false;
            }

            this.groupsService
                .get()
                .subscribe((groups: AdminUserGroupView[]) => {
                        this.groups = groups;
                    },
                    (error: any) => {
                        this.errors = [error];
                    }
                );
        });
    }

    ngOnInit() {
        if (!this.newUser) {
            this.loadingContentPanel = true;
            this.userPropsService.getUser(this.userId).subscribe(
                (userProps: AdminUser) => {
                    this.GlobalValues.Page = {adminUserName: userProps['Name']};

                    this.initUserProps(userProps);
                    this.loadingContentPanel = false;
                },
                (error: any) => {
                    this.userError = error.Message;
                    this.loadingContentPanel = false;
                }
            );
        } else {
            let emptyUserEntity: AdminUserProperties = new AdminUserProperties(
                /*Id: */null,

                /*IsBlocked: */false,
                /*IdMainUserGroup: */0,
                /*Login: */null,
                /*Name: */null,
                /*PhoneNumber: */null,
                /*Email: */null,
                /*Password: */null,
                /*IdAuthenticityType: */authTypes.authType1,
                /*Comment: */null,
                /*UserGroups: */[],

                /*AuthType: */[authTypes.authType1, authTypes.authType2]
            );
            this.initUserProps(emptyUserEntity);
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    get getMainGroupUndefined() {
        return mainGroupUndefined;
    }

    initUserProps(props: any) {
        this.userProps = [];

        let auth_psb_vals: any[] = props['AuthType'].map((item: any, index: number) => { return {code: index, type: item}; });
        const authTypeProps = {
          name: 'IdAuthenticityType',
          value: auth_psb_vals.find((item: any) => { return item['type'] == props['IdAuthenticityType']; }),
          psb_vals: auth_psb_vals
        }
        this.userProps.push(authTypeProps);
        this.codeAuthType = authTypeProps.value.type;

        this.userProps.push({
            name: 'Password',
            value: props['Password'],
            admit: null
        });

        this.userProps.push({
            name: 'Status',
            value: !props['IsBlocked']
        });

        let main_group: any = props['UserGroups'].find((group: any) => { return group.Id == props['IdMainUserGroup']; });
        this.userProps.push({
            name: 'UserGroups',
            value: props['UserGroups'],
            main_group_id: props['IdMainUserGroup'],
            main_group: main_group || { Name: mainGroupUndefined }/* основная группа не задана */
        });

        Object.keys(props)
            .filter((key: any) => {
                return key !== 'Id' &&
                       key !== 'IsBlocked' &&

                       key !== 'IdAuthenticityType' &&
                       key !== 'AuthType' &&

                       key !== 'Password' &&

                       key !== 'UserGroups' &&
                       key !== 'IdMainUserGroup';
            })
            .forEach((key: string) => {
                this.userProps.push({
                    name: key,
                    value: props[key]
                });
            });
    }

    getName(key: string) {
            switch (key) {
                case 'IdAuthenticityType':
                    return AppLocalization.TypeOfAuthorization;
                case 'Login':
                    return AppLocalization.Login;
                case 'Password':
                    return AppLocalization.Password;
                case 'UserGroups':
                    return AppLocalization.UserGroups;
                case 'Status':
                    return AppLocalization.Activity;
                case 'Name':
                    return AppLocalization.Label111;
                case 'PhoneNumber':
                    return AppLocalization.Phone;
                case 'Email':
                    return AppLocalization.Email;
                case 'Comment':
                    return AppLocalization.Comment;
            }
    }

    saveUser() {
        this.saveUserGroups();

        if (!this.getUserProp('IdAuthenticityType').value) {
            let error: string = AppLocalization.Label58;
            this.errors = [error];

        } else if (!this.newUser && this.getUserProp('Password').value != this.getUserProp('Password').admit) {
            let error: string = AppLocalization.Label70;
            this.errors = [error];

        } else if (this.newUser && this.codeAuthType !== 'Ldap' &&
                   ((!this.getUserProp('Password').value || !this.getUserProp('Password').value.length || !this.getUserProp('Password').admit || !this.getUserProp('Password').admit.length) ||
                    (this.getUserProp('Password').value != this.getUserProp('Password').admit))) {
            let error: string = AppLocalization.Label71;
            this.errors = [error];

        } else if (!(this.getUserProp('UserGroups').value && this.getUserProp('UserGroups').value.length) || /*из чипсов выбрана хотя бы одна группа*/
            !(this.groupChips.selectIndexCursor || this.groupChips.selectIndexCursor == 0)/*основная группа задана*/) {
            let error: string = AppLocalization.Label44;
            this.errors = [error];

        } else if (!this.getUserProp('Login').value) {
            let error: string = AppLocalization.Label57;
            this.errors = [error];

        } else {
            this.errors = [];
            this.loadingContentPanel = true;

            let userEntity: AdminUserProperties = new AdminUserProperties(
                /*Id: */this.newUser ? null : this.userId,

                /*IsBlocked: */!this.getUserProp('Status').value,
                /*IdMainUserGroup: */this.newUser ? this.getUserProp('UserGroups').value[0].Id : this.getUserProp('UserGroups').main_group_id,
                /*Login: */this.getUserProp('Login').value,
                /*Name: */this.getUserProp('Name').value,
                /*PhoneNumber: */this.getUserProp('PhoneNumber').value,
                /*Email: */this.getUserProp('Email').value,
                /*Password: */this.getUserProp('Password').value,
                /*IdAuthenticityType: */this.getUserProp('IdAuthenticityType').value['type'],
                /*Comment: */this.getUserProp('Comment').value,
                /*UserGroups: */this.getUserProp('UserGroups').value,

                /*AuthType: */null
            );

            this.userPropsService
                .setNewUser(userEntity)
                .then((userId: any) => {
                    this.loadingContentPanel = false;

                    if (!this.newUser) this.isPropEdit = false;

                    this.router.navigate(['admin/user/' + userId]);
                })
                .catch((error: any) => {
                    this.loadingContentPanel = false;
                    this.errors = [error];
                });
        }
    }

    changeUserProperties() {
        this.mainContainer.nativeElement.focus(); // на данный момент не было ни одного клика по корневой форме -
                                                  // так что устанавливаем фокус на случай если сразу после этого нажмем Ctrl+S или Esc

        let cloneArray: any = (arr: any[]) => {
            let clone: any[] = [];
            arr.forEach((item: any) => {
                clone.push({ ...item });
            });
            return clone;
        };

        this.initialUserProps = cloneArray(this.userProps);
        this.initUserGroupsChips();
        this.isPropEdit = true;
    }

    getUserProp(name: string) {
        return this.userProps.find((Prop: any) => { return Prop.name == name; });
    }

    cancelChanges() {
        if (!this.newUser) {
            this.userProps = this.initialUserProps;
            this.isPropEdit = false;
        } else {
            this.backToPrevPage();
        }
    }

    get newUser() {
        return this.userId == 'new';
    }

    saveUserGroups() {
        if (this.groupChips.chips.length && (this.groupChips.selectIndexCursor == 0 || this.groupChips.selectIndexCursor)) { // группы набраны из чипсов и основную группу задали
            let userGroupsProp: any = this.getUserProp('UserGroups');
            userGroupsProp.value = [];

            let main_group: any = this.groups.find((group: any) => {
                return group.Name == this.groupChips.chips[this.groupChips.selectIndexCursor];
            });
            userGroupsProp.main_group = main_group;
            userGroupsProp.main_group_id = main_group.Id;

            this.groupChips.chips.forEach((chip: any) => {
                let group: any = this.groups.find((group: any) => {
                    return group.Name == chip;
                });
                userGroupsProp.value.push(group);
            });
        }
    }

    initUserGroupsChips() {
        let userGroupsProp: any = this.getUserProp('UserGroups');
        let userGroups: any[] = userGroupsProp.value;

        let chips: any[] = userGroups.map(group => group.Name);

        this.groupChips.chips = chips.sort((g1: string, g2: string) => {

            if (g1 != userGroupsProp.main_group.Name) return 1;

            return -1;
        });

        if (userGroupsProp.main_group.Name !== mainGroupUndefined) { // если основная группа задана
            this.groupChips.selectIndexCursor = 0; // то она будет первой и выделенной в чипсах при переключении в режим редактирования
            this.groupChips.selectIndex = {0: true};
        } else {
            this.groupChips.selectIndexCursor = null; // если основная группа не задана - выделенных чипсов не будет при переключении в режим редактирования
            // this.groupChips.selectIndex = {};
        }
    }

    get getLeftGroups() {
        let user_groups = (this.groupChips || {chips: []}).chips;
        return (this.groups || [])
            .filter((group: any) => {
                return user_groups.find((user_group: any) => {
                        return user_group.Id == group.Id;
                    }) ==
                    undefined;
            })
            .map((group: any) => { return group.Name; });
    }

    keySaveOrCancel(event: any) {
        if (this.isPropEdit && (event.target.tabIndex == 0 // перед комбинацией клавиш трогали любой элемент формы кроме чипсов
                || event.target.tabIndex == 1 // перед комбинацией клавиш трогали компонент чипсов но не трогали сами его чипсины
                || event.target.tabIndex == 2)) { // перед комбинацией клавиш трогали саму чипсину
            if (event.ctrlKey && event.keyCode == 83) { // Ctrl + S
                this.saveUser();
            } else if (event.keyCode == 27) { // Esc
                this.cancelChanges();
            }
        }
    }

    backToPrevPage() {
        GlobalValues.Instance.UrlHistory.backNavigate();
    }
}
