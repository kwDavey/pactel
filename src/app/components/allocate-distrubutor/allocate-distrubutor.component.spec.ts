import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocateDistrubutorComponent } from './allocate-distrubutor.component';

describe('AllocateDistrubutorComponent', () => {
  let component: AllocateDistrubutorComponent;
  let fixture: ComponentFixture<AllocateDistrubutorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllocateDistrubutorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllocateDistrubutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
