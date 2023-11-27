import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUsersPopUpComponent } from './add-users-pop-up.component';

describe('AddUsersPopUpComponent', () => {
  let component: AddUsersPopUpComponent;
  let fixture: ComponentFixture<AddUsersPopUpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddUsersPopUpComponent]
    });
    fixture = TestBed.createComponent(AddUsersPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
