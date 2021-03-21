import { IAuthorization } from "../Authorization/IAuthorization";

export class NavigateItem implements IAuthorization {
    code: string;
    name: string;
    url?: string;
    isDisabled?: boolean = false;
    isActive?: boolean = false;
    isVisible?: boolean = true;
    access?: string | any;
}