import { ListItem } from "../../../../controls/ListView/ListView";

export class ListTreeItem extends ListItem {
    Parent: ListTreeItem;
    Child: ListTreeItem[];
}