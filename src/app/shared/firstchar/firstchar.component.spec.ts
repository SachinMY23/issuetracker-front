import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstcharComponent } from './firstchar.component';

describe('FirstcharComponent', () => {
  let component: FirstcharComponent;
  let fixture: ComponentFixture<FirstcharComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstcharComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstcharComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
