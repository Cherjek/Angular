export interface LdapNode {
    Name: string;
    NodeType: string;
    Path: string;
    SamAccountName: string;
    Children: LdapNode[];
}
