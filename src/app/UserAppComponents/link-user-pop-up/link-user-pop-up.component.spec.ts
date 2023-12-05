import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkUserPopUpComponent } from './link-user-pop-up.component';

describe('LinkUserPopUpComponent', () => {
  let component: LinkUserPopUpComponent;
  let fixture: ComponentFixture<LinkUserPopUpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinkUserPopUpComponent]
    });
    fixture = TestBed.createComponent(LinkUserPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
