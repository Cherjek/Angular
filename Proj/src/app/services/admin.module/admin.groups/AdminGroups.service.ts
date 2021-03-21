import {Injectable} from '@angular/core';
import {WebService} from '../../common/Data.service';
import {AdminUserGroupView} from './Models/AdminUserGroupView';
import { LdapNode } from '../../../services/admin.module/interfaces/ldap-node';

@Injectable()
export class AdminGroupsService extends WebService<AdminUserGroupView> {
    URL: string = 'admin/groups';
    private ldapNodesData: LdapNode[] | any;

    public getLdapNodes(): Promise<LdapNode[] | any> {
        return new Promise(
            (resolve, reject) => {
                if (this.ldapNodesData !== undefined) {
                    resolve(this.ldapNodesData);
                    return;
                }
                super.get('/ldapNodes').subscribe(
                    (response) => {
                        this.ldapNodesData = response;
                        resolve(response);
                    },
                    (error) => {
                        reject(error);
                    },
                );
            }
        );
    }
}
