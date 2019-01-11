import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalValidatorComponent } from './hospital-validator.component';

describe('HospitalValidatorComponent', () => {
  let component: HospitalValidatorComponent;
  let fixture: ComponentFixture<HospitalValidatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HospitalValidatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
