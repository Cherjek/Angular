import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'rom-upload-reference',
  templateUrl: './upload-reference.component.html',
  styleUrls: ['./upload-reference.component.less'],
})
export class UploadReferenceComponent implements OnInit {
  errors: any[] = [];
  loadingContentPanel = true;
  draggedFile: File;
  constructor(private router: Router) {}

  ngOnInit() {
    this.loadingContentPanel = false;
  }

  onFileUpload(data: any) {
    try {
      data = JSON.parse(data);
      if (data) {
        this.router.navigate(['/import-export/references/import'], {
          state: { data },
        });
      }
    } catch (error) {
      this.errors = [{ ShortMessage: AppLocalization.Label15 }];
      return;
    }
  }

  onError(error: { ShortMessage: '' }[]) {
    this.errors = error;
  }
}
