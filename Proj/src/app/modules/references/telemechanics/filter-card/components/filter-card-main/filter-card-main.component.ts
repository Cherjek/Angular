import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component } from '@angular/core';
import { NavigateItem } from 'src/app/common/models/Navigate/NavigateItem';

@Component({
  selector: 'rom-filter-card-main',
  templateUrl: './filter-card-main.component.html',
  styleUrls: ['./filter-card-main.component.less'],
})
export class FilterCardMainComponent {
  public loadingContent: boolean;
  public errors: any[] = [];
  public navigateMenuTabs: NavigateItem[] = [
    {
      name: AppLocalization.Limitations,
      url: 'bounds',
      code: 'bounds',
      access: 'CFG_TAG_FILTER_BOUNDS_VIEW'
    },
    {
      name: AppLocalization.TagTypes,
      url: 'tag-types',
      code: 'tag-types',
      access: ['REF_VIEW_LOGIC_DEVICE_TAGS','CFG_TAG_FILTER_TAGS_VIEW']
    },
  ];
}
