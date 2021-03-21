/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PaRequestCardMainComponent } from './pa-request-card-main.component';

describe('PaRequestCardMainComponent', () => {
  let component: PaRequestCardMainComponent;
  let fixture: ComponentFixture<PaRequestCardMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaRequestCardMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaRequestCardMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
