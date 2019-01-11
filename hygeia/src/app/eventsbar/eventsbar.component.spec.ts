import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsbarComponent } from './eventsbar.component';

describe('EventsbarComponent', () => {
  let component: EventsbarComponent;
  let fixture: ComponentFixture<EventsbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
