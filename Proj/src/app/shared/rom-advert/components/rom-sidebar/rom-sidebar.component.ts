import { Router } from '@angular/router';
import { Helpers } from './../../../../common/Helpers';
import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'rom-sidebar',
  templateUrl: './rom-sidebar.component.html',
  styleUrls: ['./rom-sidebar.component.less'],
})
export class RomSidebarComponent implements OnChanges {
  display = 'block';
  isValidUrl = false;
  @Input() data: any;
  duration = 1000;
  inAnimate: boolean;
  banner: any;
  private _showSidebar = false;
  showMinimizeButton: boolean;
  interval: any;
  isLogin: boolean;
  public get showSidebar() {
    return this._showSidebar;
  }
  public set showSidebar(value) {
    this.sidebarInit(value);
  }

  constructor(private helpers: Helpers, public router: Router) {}

  ngOnChanges(changes: any) {
    this.banner = changes.data.currentValue;
    if (this.banner) {
      this.constructAdvert();
    }
  }

  sideBarCall() {
    this.showSidebar = true;
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  onClose() {
    this.inAnimate = this.showMinimizeButton = this.showSidebar = false;
    this.display = 'none';
    this.initTimer();
  }

  onMinimize() {
    this.onClose();
    this.showMinimizeButton = true;
  }

  private sidebarInit(value: boolean) {
    this._showSidebar = this.inAnimate = value;
    this.display = 'block';
  }

  private constructAdvert() {
    if (this.banner) {
      this.isValidUrl = this.helpers.isValidURL(this.banner.window.url);
      this.initBannerStyle();
      if (this.isValidUrl && !this.router.url.includes('login')) {
        this.initTimer();
      }
      this.showMinimizeButton = true;
    }
  }

  private initTimer() {
    this.interval = setTimeout(() => {
      if (!this.showSidebar) {
        this.showSidebar = true;
      }
    }, this.banner.reactivateTimeout * 1000);
  }

  private initBannerStyle() {
    const bannerStyle: string =
      this.banner && this.banner.window && this.banner.window.style;
    if (bannerStyle) {
      this.banner.window.style = this.convertStyle(bannerStyle);
    }
    this.initButtonStyle();
  }

  private initButtonStyle() {
    const buttonStyle =
      this.banner && this.banner.button && this.banner.button.style;
    if (buttonStyle) {
      this.banner.button.style = this.convertStyle(buttonStyle);
    }
    this.initCloseButtonStyle();
  }

  private initCloseButtonStyle() {
    const bannerStyle: string =
      this.banner &&
      this.banner.window &&
      this.banner.window.closeButton &&
      this.banner.window.closeButton.style;
    if (bannerStyle) {
      this.banner.window.closeButton.style = this.convertStyle(bannerStyle);
    }
  }

  private convertStyle(bannerStyle: string) {
    if (bannerStyle) {
      let bannerArr = bannerStyle.split(';').map((x) => {
        const nestedProps = x.split(':').map((y) => y.toString().trim());
        return nestedProps;
      });
      bannerArr = bannerArr.filter((x) => x[0].length);
      const styleObj = {};
      bannerArr.forEach((prop) => {
        styleObj[prop[0]] = prop[1];
      });
      return styleObj;
    }
  }
}
