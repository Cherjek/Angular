import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'upload-file-ro5',
  templateUrl: 'UploadFile.html',
  styleUrls: ['UploadFile.css'],
})
export class UploadFile implements OnInit {
  @Input() fileToUploadName: string;
  @Input() acceptType = '.';
  @Input() multiple: any = undefined;
  @Output() OnUpload = new EventEmitter<File | File[]>();

  ngOnInit() {
    if (this.fileToUploadName == null) {
      if (this.multiple) {
        this.fileToUploadName = AppLocalization.SelectFiles;
      } else {
        this.fileToUploadName = AppLocalization.SelectFile;
      }
    }
  }

  public handleFileInput(filesList: FileList) {
    if (filesList.length) {
      const files = Array.from(filesList);
      this.fileToUploadName = files.map((x) => x.name).join('; ');
      if (!this.multiple) {
        this.OnUpload.emit(files[0]);
      } else {
        this.OnUpload.emit(files);
      }
    }
  }
}