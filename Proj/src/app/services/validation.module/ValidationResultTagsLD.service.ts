import { Injectable } from "@angular/core";
import { WebService } from "../common/Data.service";

export class ValidationResultTagsLDService extends WebService<any> {
    URL: string = "validation/result/ldtags";
}