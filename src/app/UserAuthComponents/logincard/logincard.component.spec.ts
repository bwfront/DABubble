import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogincardComponent } from './logincard.component';

describe('LogincardComponent', () => {
  let component: LogincardComponent;
  let fixture: ComponentFixture<LogincardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogincardComponent]
    });
    fixture = TestBed.createComponent(LogincardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
