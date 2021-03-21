import { Injectable } from '@angular/core';
import { Observable, Observer, of } from 'rxjs';
import { delay } from 'rxjs/internal/operators';
import { WebService } from '../common/Data.service';
import { Hierarchy } from './Models/Hierarchy';
import { NodeType } from './Models/NodeType';
import { HierarchyNodeTypePropertyCategory } from './Models/HierarchyNodeTypePropertyCategory';
import { HierarchyNodeTypePropertyType } from './Models/HierarchyNodeTypePropertyType';

import { map, tap, finalize } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class HierarchyPropertyService extends WebService<Hierarchy | NodeType | HierarchyNodeTypePropertyCategory | HierarchyNodeTypePropertyCategory | number[]> {
    URL = 'hierarchy-property';

    hierarchyCache: Hierarchy;
    /**
    * получение экземпляра иерархии
    * @param idHierarchy номер иерахии, number
    * @returns Hierarchy
    */
    getHierarchy(idHierarchy: number | string): Observable<Hierarchy> {
        if (this.hierarchyCache != null) {
            return of(this.hierarchyCache);
        } else {
            return super.get(`hierarchy/${idHierarchy}`).pipe(
                map(data => {
                    // Object.assign сохраняет класс, spread { ...new Hierarchy(), ...data } возвращает Object
                    this.hierarchyCache = Object.assign(new Hierarchy(), data);
                    return this.hierarchyCache;
                })
            );
        }
    }

    /**
    * получение экземпляра типа узла
    * @param idHierarchyNodeType номер типа узла, number
    * @param idHierarchy номер иерахии, number
    * @returns NodeType
    */
    getHierarchyNodeType(idHierarchyNodeType: number | string, idHierarchy?: number): Observable<NodeType> {
        let url = `node-type/${idHierarchyNodeType}`;
        if (idHierarchy != null) {
            url = `${idHierarchy}/${url}`;
        }
        return super.get(url).pipe(
            map(data => {
                // Object.assign сохраняет класс, spread { ...new NodeType(), ...data } возвращает Object
                return Object.assign(new NodeType(), data);
            })
        );
    }

    /**
    * получение экземпляра дополнительного свойства, типа узла
    * @param idHierarchyNodeTypePropertyType номер доп. свойства
    * @param idHierarchyNodeType номер типа узла, number
    * @returns NodeType
    */
    getHierarchyNodeTypePropertyType(idHierarchyNodeTypePropertyType: number | string, idHierarchyNodeType?: number): Observable<HierarchyNodeTypePropertyType> {
        let url = `additionally-property/${idHierarchyNodeTypePropertyType}`;
        if (idHierarchyNodeType != null) {
            url = `${idHierarchyNodeType}/${url}`;
        }
        return super.get(url).pipe(
            map(data => {
                // Object.assign сохраняет класс, spread { ...new NodeType(), ...data } возвращает Object
                return Object.assign(new HierarchyNodeTypePropertyType(), data);
            })
        );
    }

    /**
    * получение экземпляра категории свойства, типа узла
    * @param idHierarchyNodeTypePropertyCategory номер категории свойства
    * @param idHierarchyNodeType номер типа узла, number
    * @returns NodeType
    */
    getHierarchyNodeTypePropertyCategory(idHierarchyNodeTypePropertyCategory: number | string, idHierarchyNodeType?: number): Observable<HierarchyNodeTypePropertyCategory> {
        let url = `category-property/${idHierarchyNodeTypePropertyCategory}`;
        if (idHierarchyNodeType != null) {
            url = `${idHierarchyNodeType}/${url}`;
        }
        return super.get(url).pipe(
            map(data => {
                // Object.assign сохраняет класс, spread { ...new NodeType(), ...data } возвращает Object
                return Object.assign(new HierarchyNodeTypePropertyCategory(), data);
            })
        );
    }

    /**
     * SAVE
     */
    postHierarchy(hierarchy: Hierarchy) {
        return super.post(hierarchy, 'hierarchy');
    }
    postNodeType(nodeType: NodeType) {
        return super.post(nodeType, 'node-type');
    }
    postNodeTypeCategoryProperty(categoryProperty: HierarchyNodeTypePropertyCategory) {
        return super.post(categoryProperty, 'category-property');
    }
    postNodeTypeAdditionallyProperty(propertyType: HierarchyNodeTypePropertyType) {
        return super.post(propertyType, 'additionally-property');
    }
    

    /**
     * DELETE
     */
    deleteHierarchyAsync(idHierarchy: number) {
        return super.delete(idHierarchy, 'hierarchy');
    }
    deleteHierarchyNodeTypeAsync(idHierarchyNodeType: number) {
        return super.delete(idHierarchyNodeType, 'node-type');
    }
    deleteHierarchyNodeTypePropertyCategoryAsync(idHierarchyNodeTypePropertyCategory: number) {
        return super.delete(idHierarchyNodeTypePropertyCategory, 'category-property');
    }
    deleteHierarchyNodeTypePropertyTypeAsync(idHierarchyNodeTypePropertyType: number) {
        return super.delete(idHierarchyNodeTypePropertyType, 'additionally-property');
    }

     /**
     * DELETE BATCH
     */
    deleteHierarchiesAsync(idHierarchies: number[]) {
        return super.post(idHierarchies, 'hierarchies/delete');
    }
    deleteHierarchyNodeTypesAsync(idHierarchyNodeTypes: number[]) {
        return super.post(idHierarchyNodeTypes, 'node-types/delete');
    }
    deleteHierarchyNodeTypePropertyCategoriesAsync(idHierarchyNodeTypePropertyCategories: number[]) {
        return super.post(idHierarchyNodeTypePropertyCategories, 'category-properties/delete');
    }
    deleteHierarchyNodeTypePropertyTypesAsync(idHierarchyNodeTypePropertyTypes: number[]) {
        return super.post(idHierarchyNodeTypePropertyTypes, 'additionally-properties/delete');
    }
}