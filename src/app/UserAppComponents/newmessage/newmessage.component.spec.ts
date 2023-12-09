import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewmessageComponent } from './newmessage.component';

describe('NewmessageComponent', () => {
  let component: NewmessageComponent;
  let fixture: ComponentFixture<NewmessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewmessageComponent]
    });
    fixture = TestBed.createComponent(NewmessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
