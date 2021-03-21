import { Injectable } from "@angular/core";
import { WebService } from "../common/Data.service";

import * as Models from './Models/DataValidationJobResult';
import DataValidationJobResult = Models.Services.ValidationModule.Models.DataValidationJobResult;

export class ValidationResultService extends WebService<DataValidationJobResult> {
    URL: string = "validation/result";

    getIssueSolveMethods(issueId: any) {
        return super.get(`/solvemethods/${issueId}`);
    }

    fixIssueError(id: any, issueId: any, issueSolveId: any) {
        return super.post(null, `/fixissueerror/${id}/${issueId}/${issueSolveId}`);
    }
}