import { Component, NgZone } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HandDetectorDirective } from './hand-detector.directive';

@Component({
  template: ` <video snakeHandDetector></video>`,
  standalone: true,
  imports: [HandDetectorDirective],
})
class TestComponent {}

describe('HandDetectorDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let directiveElements: any[];

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);

    fixture.detectChanges(); // initial binding

    // all elements with an attached HighlightDirective
    directiveElements = fixture.debugElement.queryAll(
      By.directive(HandDetectorDirective)
    );
  });

  // color tests
  it('should have a hand detector element', () => {
    expect(directiveElements.length).toBe(1);
  });
});
