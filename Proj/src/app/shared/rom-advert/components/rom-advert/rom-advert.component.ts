import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'rom-advert',
  templateUrl: './rom-advert.component.html',
  styleUrls: ['./rom-advert.component.less'],
})
export class RomAdvertComponent implements OnInit {
  // @Input() header = 'Реклама';
  close = false;
  display = 'block';
  @Output() advertClick = new EventEmitter();
  @Input() bannerData: any[] = [];
  banner: any;
  constructor() {}

  ngOnInit() {
    this.banner = this.bannerData.find(
      (x) => (x.code as string).toLocaleUpperCase() === 'ASUNO'
    );
  }

  onClose() {
    // this.isAdvertShown(true);
    // this.close = true;
    // setTimeout(() => {
    //   this.display = 'none';
    // }, 400);
  }

  // isAdvertShown(isShown = false) {
  //   if (isShown) {
  //     localStorage.setItem('rom-advert-shown', 'true');
  //   }
  //   return localStorage.getItem('rom-advert-shown');
  // }
}
