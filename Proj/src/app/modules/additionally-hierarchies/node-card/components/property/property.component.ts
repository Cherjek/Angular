import { Component, OnInit, OnDestroy, ViewChild, QueryList, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { map, tap, finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { HierarchyCardService,
         HierarchiesEditorService,
         NodeType,
         Node,
         HierarchyNodeEdit,
         HierarchyNodeView,
         PropertyCategory } from '../../../../../services/additionally-hierarchies';
import { IEntityViewProperty } from '../../../../../services/common/Interfaces/IEntityViewProperty';
import { sessionStorageKey } from '../../../node-create/components/node-create.component';

import { IDetailsComponent } from '../../../../../controls/ListComponentCommon/DetailsRow/IDetailsComponent';
import { PropertiesEditorPanelComponent } from '../../../../../shared/rom-forms/properties.editor.panel/properties.editor.panel';

import { GlobalValues } from '../../../../../core';
import { ValueType } from 'src/app/services/common/Models/ValueType';

@Component({
    selector: 'ahm-node-property',
    templateUrl: './property.component.html',
    styleUrls: ['./property.component.less']
})
export class PropertyComponent implements IDetailsComponent, OnInit, OnDestroy {
    
    // IDetailsComponent property implements
    parentKey: any;
    data: HierarchyNodeView;
    params: any;
    @Output() onLoadEnded = new EventEmitter<boolean>();

    public loadingContent: boolean;
    public errors: any[] = [];
    public errorLoadEntity: any;

    private nodeEdit: HierarchyNodeEdit;
    private _nodeType: NodeType;
    private idNode: number | string;
    private idHierarchy: number;
    private nodeParent?: number;
    private get nodeType() {
        if (this._nodeType == null) {
            const storage = sessionStorage.getItem(sessionStorageKey);
            this._nodeType = JSON.parse(storage) as NodeType;
        }
        return this._nodeType;
    }
    private subscription: Subscription;
    private subscriptionQuery: Subscription;

    public get isNew() {
        return this.idNode === 'new';
    }
    // признак того, что данный компонент используется в строке детализации
    public get isDetailRowMode() {
        return this.data != null;
    }
    public properties: IEntityViewProperty[];
    public propertyCategories: PropertyCategory[];

    private propertyEditCategories: Map<string, any>;
    
    constructor(private hierarchyCardService: HierarchyCardService,
                private hierarchiesEditorService: HierarchiesEditorService,
                private router: Router,
                private activatedRoute: ActivatedRoute) {
        this.subscription = this.activatedRoute.parent.params.subscribe(params => {
            this.idNode = params.id;
        });
    }

    ngOnInit() {
        if (this.isDetailRowMode) {
            this.idNode = this.data.Id;
        }
        this.subscriptionQuery = this.activatedRoute.queryParams.subscribe((qparams: any) => {
            this.idHierarchy = qparams.idHierarchy;
            this.nodeParent = qparams.nodeParent;
            
            this.loadNode();
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.subscriptionQuery.unsubscribe();
    }

    private loadNode() {
        this.loadingContent = true;
        let observable: any;
        if (this.isNew) {
            observable = this.hierarchiesEditorService.getNewNode(this.nodeType.Id, this.idHierarchy, this.nodeParent);
        } else {
            if (this.idNode == null) return;

            observable = this.hierarchiesEditorService.getNode(this.idNode as number);
        }
        observable
            .pipe(
                finalize(() => {
                    this.loadingContent = false;
                    if (this.isDetailRowMode) {
                        this.onLoadEnded.emit(true);
                    }
                })
            )
            .subscribe(
                (data: HierarchyNodeEdit) => {
                    this.nodeEdit = data;
                    if (data != null) {
                        const propNodeType = data.Properties.find(d => d.Code === 'NodeType');
                        const propParentNode = data.Properties.find(d => d.Code === 'ParentNode');
                        propParentNode.Type = 'Tree';

                        if (this.isNew) {
                            propNodeType.Value = this.nodeType;
                        } else {
                            propNodeType.Value = this.convertToValueType(propNodeType.Value);
                        }
                        if (propParentNode.Value != null) {
                            propParentNode.Value = this.convertToValueType(propParentNode.Value);
                        }
                    }
                    this.properties = data.Properties;
                    this.propertyCategories = data.PropertyCategories.map(pc => {
                        (pc as any).isOnePropNotNull = (pc.Properties || []).find(prop => prop.Value != null) != null;
                        return pc;
                    });
                },
                (error: any) => {
                    this.errorLoadEntity = error;
                }
            );
    }

    private convertToValueType(data: any) {
        const valueType = new ValueType();
        valueType.Id = data.Code;
        valueType.Name = data.Text;
        return valueType;
    }

    private convertToOptionValue(data: ValueType) {
        return {
            Code: data.Id,
            Text: data.Name
        };
    }

    private removeTreeNode(nodes: Node[], nodeId: number) {
        nodes.forEach((node: Node, index: number) => {
            if (node.Id == nodeId) {
                nodes.splice(index, 1);
                return;
            } else if (node.Nodes != null) {
                this.removeTreeNode(node.Nodes, nodeId);
            }
        });
    }

    optionControlDropDown(event: any) { 
        const property = event.property;
        if (property.Code === 'ParentNode' && property.arrayValues == null) {
            this.hierarchyCardService.getNodeTree(this.idHierarchy)
                .subscribe(
                    (tree) => {
                        if (!this.isNew) {
                            this.removeTreeNode(tree, this.idNode as number);
                        }

                        property.arrayValues = tree;
                    },
                    (error: any) => {
                        this.errors = [error];
                    }
                );
        }
    }

    public initPropertyCategoriesPanel(propCat: PropertyCategory, propPanel: PropertiesEditorPanelComponent) {
        this.propertyEditCategories = this.propertyEditCategories || new Map<string,any>();
        this.propertyEditCategories.set(
                JSON.stringify({ Code: propCat.Code, Name: propCat.Name }), 
                { propCat, propPanel }
            );
    }

    public save(properties: IEntityViewProperty[], propControl: any) {
        this.loadingContent = true;
        const hierarchyNodeEdit = new HierarchyNodeEdit();
        if (!this.isNew) {
            hierarchyNodeEdit.Id = this.idNode as number;
        }
        hierarchyNodeEdit.IdHierarchy = this.idHierarchy;
        const cloneProperties = () => {
            return properties.map(p => {
                const newP = {...p};
                if (newP.Value != null && newP.Value instanceof Object) {
                    newP.Value = {...newP.Value};
                }
                return newP;
            });
        }
        hierarchyNodeEdit.Properties = cloneProperties();
        hierarchyNodeEdit.Properties.forEach((prop: IEntityViewProperty) => {
            if (prop.Type === 'Option' || prop.Type === 'Tree') {
                if (prop.Value) {
                    prop.Value = this.convertToOptionValue(prop.Value);
                }
            }
            if (prop.Type === 'Tree') {
                prop.Type = 'Option';
            }
        });        

        const propCats: PropertyCategory[] = [];        
        if (this.propertyEditCategories != null) {
            this.propertyEditCategories.forEach((val, key) => {
                if (val.propCat.Properties != null) {
                    val.propCat.Properties = val.propPanel.getEditProperties();
                }
                propCats.push(val.propCat);
            });
        }
        hierarchyNodeEdit.PropertyCategories = propCats;

        this.hierarchiesEditorService.postNode(hierarchyNodeEdit)
            .then((idNode: number) => {
                this.loadingContent = false;

                if (this.isNew) {
                    GlobalValues.Instance.Page.backwardButton.popLastUrl();

                    this.router.navigate(['../../../node-card/' + idNode], {
                        relativeTo: this.activatedRoute
                    });
                } else {
                    this.loadNode();
                }

                propControl.cancelChangeProperty();
            })
            .catch((error: any) => {
                this.loadingContent = false;
                this.errors = [error];
            });
    }
}