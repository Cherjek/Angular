import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'rom-main-import-export-references',
  templateUrl: './main-import-export-references.component.html',
  styleUrls: ['./main-import-export-references.component.less']
})
export class MainImportExportReferencesComponent implements OnInit {
  public loadingPanel: boolean;
  public headerErrors: any[] = [];
  constructor() {}

  ngOnInit() {}
}
