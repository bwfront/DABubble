import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DabubbleappComponent } from './dabubbleapp.component';

describe('DabubbleappComponent', () => {
  let component: DabubbleappComponent;
  let fixture: ComponentFixture<DabubbleappComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DabubbleappComponent]
    });
    fixture = TestBed.createComponent(DabubbleappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
