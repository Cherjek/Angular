export class AdminUserGroupEditView {
    constructor(public Id: number,
        public Name: string,
        public IsBlocked: boolean,
        public LdapPath?: string,
        public LdapGroupPath?: string,
        public StartPage?: string) {
    }
}