import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryChatComponent } from './secondary-chat.component';

describe('SecondaryChatComponent', () => {
  let component: SecondaryChatComponent;
  let fixture: ComponentFixture<SecondaryChatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SecondaryChatComponent]
    });
    fixture = TestBed.createComponent(SecondaryChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
