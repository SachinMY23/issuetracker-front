import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyissueComponent } from './myissue.component';

describe('MyissueComponent', () => {
  let component: MyissueComponent;
  let fixture: ComponentFixture<MyissueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyissueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyissueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
