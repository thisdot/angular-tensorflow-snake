import { Component, NgZone } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CameraFeedDirective } from './camera-feed.directive';

@Component({
  template: ` <video snakeCameraFeed></video>`,
  standalone: true,
  imports: [CameraFeedDirective],
})
class TestComponent {}

describe('CameraFeedDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let directiveElements: any[];

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);

    fixture.detectChanges(); // initial binding

    // all elements with an attached HighlightDirective
    directiveElements = fixture.debugElement.queryAll(
      By.directive(CameraFeedDirective)
    );
  });

  // color tests
  it('should have a camera feed element', () => {
    expect(directiveElements.length).toBe(1);
  });
});
