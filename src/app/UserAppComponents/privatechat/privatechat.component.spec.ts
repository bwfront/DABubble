import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivatechatComponent } from './privatechat.component';

describe('PrivatechatComponent', () => {
  let component: PrivatechatComponent;
  let fixture: ComponentFixture<PrivatechatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrivatechatComponent]
    });
    fixture = TestBed.createComponent(PrivatechatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
