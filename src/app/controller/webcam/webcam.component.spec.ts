import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebcamComponent } from './webcam.component';

describe('WebcamComponent', () => {
  let component: WebcamComponent;
  let fixture: ComponentFixture<WebcamComponent>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(WebcamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
