import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewboxesComponent } from './viewboxes.component';

describe('ViewboxesComponent', () => {
  let component: ViewboxesComponent;
  let fixture: ComponentFixture<ViewboxesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewboxesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewboxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
