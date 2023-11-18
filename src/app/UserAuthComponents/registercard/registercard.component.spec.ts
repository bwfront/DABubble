import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistercardComponent } from './registercard.component';

describe('RegistercardComponent', () => {
  let component: RegistercardComponent;
  let fixture: ComponentFixture<RegistercardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistercardComponent]
    });
    fixture = TestBed.createComponent(RegistercardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
