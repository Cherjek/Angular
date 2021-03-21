export interface IEMailRecipient {
    RecipientType: string;
    EMail: string;
    Name: string;
}

export class EMailRecipient implements IEMailRecipient {
    RecipientType: string;
    EMail: string;
    Name: string;
}