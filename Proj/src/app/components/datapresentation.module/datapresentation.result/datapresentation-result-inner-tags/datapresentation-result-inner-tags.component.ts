import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { GlobalValues, Utils } from 'src/app/core';
import { ObjectTagsValueService } from 'src/app/services/datapresentation.module/ObjectTagsValue.service';

@Component({
  selector: 'rom-datapresentation-result-inner-tags',
  templateUrl: './datapresentation-result-inner-tags.component.html',
  styleUrls: ['./datapresentation-result-inner-tags.component.less'],
})
export class DatapresentationResultInnerTagsComponent implements OnInit {
  @Output() onLoadEnded = new EventEmitter<boolean>();
  loadingContentPanel = false;
  errors: any = [];
  tagValues: any = [];
  alert: any;
  private alertTimeout: any;
  @Input() parentKey: any;
  @Input() params: any;
  @Input() data: any;
  tag = { Datetime: '' } as any;
  currentTag: any = {};
  dataArr: any[] = [];
  constructor(private tagsValueService: ObjectTagsValueService) {
    this.tagValues = GlobalValues.Instance.Page.dataPresTags;
  }

  ngOnInit() {
    this.getValue();
  }

  getValue() {
    if (this.tagValues && this.tagValues.length) {
      this.currentTag = this.tagValues.find(
        (x: any) => x.TagId === this.parentKey
      );
    } else {
      this.dataArr = [];
      this.dataArr.push(this.data);
      this.currentTag = this.dataArr[0];
    }
    this.tag.ValueType =
      (this.currentTag && this.currentTag.ValueType) || 'String';
    setTimeout(() => {
      this.onLoadEnded.emit(true);
    });
  }

  save() {
    this.loadingContentPanel = true;
    this.tag.Datetime = Utils.DateConvert.toDateTimeRequest(this.tag.Datetime);
    if (this.tag.ValueType == 'ValueDatetime') {
      this.tag.ValueEdit = Utils.DateConvert.toDateTimeRequest(
        this.tag.ValueEdit
      );
    }
    if (
      this.tag.ValueType == 'ValueFloat' ||
      this.tag.ValueType == 'ValueInteger'
    ) {
      this.tag.ValueEdit = +this.tag.ValueEdit || 0;
    }
    this.tag[this.currentTag.ValueType] = this.tag.ValueEdit;
    const newItem = { ...this.currentTag, ...this.tag };
    newItem.IdDeviceTag = this.currentTag.TagId;
    this.errors = [];
    this.tagsValueService
      .post([newItem], 'add')
      .then(() => {
        this.alert = {
          msg: AppLocalization.Successfully,
          type: 'success',
        };
        const millisecs = (datetime: any) => new Date(datetime).getTime();
        const sortedTagValues: any[] = this.tagValues.sort(
          (x: any, y: any) => millisecs(x.Datetime) - millisecs(y.Datetime)
        );
        const index = this.getIndex(
          newItem,
          sortedTagValues,
          (x: any, y: any) => {
            const xMilli = millisecs(x.Datetime);
            const yMilli = millisecs(y.Datetime);
            if (xMilli < yMilli) return -1;
            if (xMilli > yMilli) return 1;
            return 0;
          }
        );
        sortedTagValues.splice(index + 1, 0, newItem);
        setTimeout(() => {
          this.close();
        }, 2000);
      })
      .catch((err) => {
        this.errors = [err];
        this.loadingContentPanel = false;
      });
  }

  cancel() {
    this.errors = [];
    this.tag = this.tagValues
      .map((x: any) => ({ ...x }))
      .find((x: any) => x.TagId === this.parentKey);
    this.close();
  }

  close() {
    this.loadingContentPanel = false;
    this.params.dataGrid.DetailRow.closeExpandedRow();
  }

  closeAlert() {
    this.alert = null;
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
  }

  getIndex(
    ele: any,
    arr: any[],
    comparer: any,
    start = 0,
    end = arr.length
  ): number {
    if (arr.length == 0) return -1;
    else {
      const pivot = (start + end) >> 1;
      const compareResult = comparer(ele, arr[pivot]);
      if (end - start <= 1) return compareResult == -1 ? pivot - 1 : pivot;

      switch (compareResult) {
        case -1:
          return this.getIndex(ele, arr, comparer, start, pivot);
        case 0:
          return pivot;
        case 1:
          return this.getIndex(ele, arr, comparer, pivot, end);
      }
    }
  }
}
