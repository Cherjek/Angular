import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/index';
import { delay, map } from 'rxjs/operators';
import { WebService } from '../common/Data.service';
import { NodeType } from './Models/NodeType';
import { HierarchyNodeTypePropertyCategory } from './Models/HierarchyNodeTypePropertyCategory';
import { HierarchyNodeTypePropertyType } from './Models/HierarchyNodeTypePropertyType';
import { ValueType } from '../common/Models/ValueType';

@Injectable({
    providedIn: 'root'
})
export class HierarchyTypeEditorService extends WebService<any> {
    URL = 'hierarchy-type-editor';

    /**
    * получение списка типов узлов иерархии
    * @param idHierarchy номер иерахии, number
    * @returns NodeType[]
    */
    getNodeTypes(idHierarchy: number): Observable<NodeType | NodeType[]> {
        return super.get(`${idHierarchy}/types`);
    }

    /** 
     * получение списка категорий в карточке типа узла
     * @param idHierarchyNodeType номер типа узла, number
     * @returns HierarchyNodeTypePropertyCategory[]
    */
    getPropertiesСategories(idHierarchyNodeType: number): Observable<HierarchyNodeTypePropertyCategory | HierarchyNodeTypePropertyCategory[]>{
        return super.get("type-node-categories/" + idHierarchyNodeType); 
    }
    
    /** 
     * получение списка дополнительных свойств в карточке типа узла
     * @param idHierarchyNodeType номер типа узла, number
     * @returns HierarchyNodeTypePropertyCategory[]
    */
    getAdditionalProperties(idHierarchyNodeType: number): Observable<HierarchyNodeTypePropertyType | HierarchyNodeTypePropertyType[]>{
        return super.get("type-node-additional-properties/" + idHierarchyNodeType);
    }

    /**
     * получение списка типов значений при создании и редактировании доп. свойств - HierarchyNodeTypePropertyType.IdValueType
     */
    getValueTypes(): Observable<ValueType[]>{
        return super.get("value-types"); 
    }
}