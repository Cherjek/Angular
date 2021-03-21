import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'rom-uploader',
  templateUrl: './rom-uploader.component.html',
  styleUrls: ['./rom-uploader.component.less'],
})
export class RomUploaderComponent implements OnInit {
  loadingContentPanel = true;
  @Input() acceptType = '.';
  @Input() multiple: any = undefined;
  @Input() asBlob: boolean;
  @Input() parseData = true;
  @Input() get draggedFile(): File | File[] {
    return this._draggedFile;
  }
  set draggedFile(value: File | File[]) {
    this._draggedFile = value;
    if (value) {
      this.onUpload(value);
    }
  }
  @Output() onFileUpload = new EventEmitter<any>();
  @Output() onWrongFileUpload = new EventEmitter<any>();  
  
  private _draggedFile: File | File[];
  constructor() {}

  ngOnInit() {
    this.loadingContentPanel = false;
  }

  onUpload(file: File | File[]) {
    setTimeout(() => {
      let allowed = this.acceptType === '.' ? true : this.isAllowedFile(file);
      if (allowed) {
        if (this.asBlob) {
          this.onFileUpload.emit(file);
        } else {
          this.readFileDataAsText(file);
        }        
      } else {
        this.loadingContentPanel = false;
      }
    }, 100);
  }

  private getFileExtension(name: string) {
    const str = name;
    const ext = str.substr(str.lastIndexOf('.'), str.length);
    return ext;
  }
  private isAllowedFile(file: File | File[]) {
    let success;
    if (file instanceof Array) {
      success = file.map(f => f.name).every(x => this.acceptType.includes(this.getFileExtension(x)));
    } else {
      success =  this.acceptType.includes(this.getFileExtension(file.name));
    }    
    if (success) {
      return true;
    } else {
      this.onWrongFileUpload.emit([
        { ShortMessage: AppLocalization.Label15 },
      ]);
      this.loadingContentPanel = false;
      return false;
    }
  }

  private readAsText(file: File): Observable<string> {
    return new Observable((subscribe) => {
      const fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = (content) => {
        subscribe.next((content.target as any).result);
        subscribe.complete();
      };
    });    
  }

  private readFileDataAsText(file: File | File[]) {
    if (file instanceof Array) {
      forkJoin(file.map(f => this.readAsText(f)))
        .subscribe((results: string[]) => {
          this.onFileUpload.emit(results);
        });
    } else {
      this.readAsText(file)
        .subscribe((results: string) => {
          this.onFileUpload.emit(results);
        });
    }      
  }
}
