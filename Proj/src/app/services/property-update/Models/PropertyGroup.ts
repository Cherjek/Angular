import { Property } from './Property';

export class PropertyGroup {
  Code: string;
  Name: string;
  PropertyTypes: Property[];
  PropertyGroups: PropertyGroup[];
}