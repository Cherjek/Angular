export class AdminUser {
    constructor(
        public CreationDate: string,
        public Email: string,
        public Id: number,
        public IsBlocked: boolean,
        public Login: string,
        public Name: string,
        public PhoneNumber: string) {
    }
}