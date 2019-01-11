import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NhsComponent } from './nhs.component';

describe('NhsComponent', () => {
  let component: NhsComponent;
  let fixture: ComponentFixture<NhsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NhsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NhsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
