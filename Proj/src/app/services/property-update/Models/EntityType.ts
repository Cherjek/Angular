import { Property } from './Property';
import { PropertyGroup } from './PropertyGroup';

export class EntityType {
  Code: string;
  Name: string;  
  PropertyTypes: Property[];
  PropertyGroups: PropertyGroup[];
}