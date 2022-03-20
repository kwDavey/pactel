import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSpecificBoxComponent } from './view-specific-box.component';

describe('ViewSpecificBoxComponent', () => {
  let component: ViewSpecificBoxComponent;
  let fixture: ComponentFixture<ViewSpecificBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSpecificBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSpecificBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
