import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateChannelPopUpComponent } from './create-channel-pop-up.component';

describe('CreateChannelPopUpComponent', () => {
  let component: CreateChannelPopUpComponent;
  let fixture: ComponentFixture<CreateChannelPopUpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateChannelPopUpComponent]
    });
    fixture = TestBed.createComponent(CreateChannelPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
