import { Directive, ElementRef, AfterViewChecked } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '.main-content-header'
})
export class TabTitleDirective implements AfterViewChecked {
  pageTitle = '';
  modulePath = '';
  constructor(
    private title: Title,
    private el: ElementRef,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.data.subscribe(x => {
      this.modulePath = x.modulePath || '';
    });
  }

  ngAfterViewChecked() {
    const headers = Array.from(
      this.el.nativeElement.querySelectorAll('h3, .label-info')
    ).map((x: HTMLElement) => x.innerText.trim());
    if (headers.length) {
      const headerText = headers.join(' ');
      if (this.pageTitle === headerText) {
        return;
      } else {
        this.pageTitle = headerText;
        const tabName =
          this.modulePath.toLocaleLowerCase() ===
            this.pageTitle.toLocaleLowerCase() || !this.modulePath
            ? this.pageTitle
            : this.modulePath + ' - ' + this.pageTitle;
        this.title.setTitle(tabName);
      }
    }
  }
}
