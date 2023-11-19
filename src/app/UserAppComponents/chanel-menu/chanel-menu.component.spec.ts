import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChanelMenuComponent } from './chanel-menu.component';

describe('ChanelMenuComponent', () => {
  let component: ChanelMenuComponent;
  let fixture: ComponentFixture<ChanelMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChanelMenuComponent]
    });
    fixture = TestBed.createComponent(ChanelMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
