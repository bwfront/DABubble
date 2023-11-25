import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersProfilePopUpComponent } from './users-profile-pop-up.component';

describe('UsersProfilePopUpComponent', () => {
  let component: UsersProfilePopUpComponent;
  let fixture: ComponentFixture<UsersProfilePopUpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersProfilePopUpComponent]
    });
    fixture = TestBed.createComponent(UsersProfilePopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
