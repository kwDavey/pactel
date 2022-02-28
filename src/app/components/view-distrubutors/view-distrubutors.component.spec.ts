import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDistributorsComponent } from './view-Distributors.component';

describe('ViewDistributorsComponent', () => {
  let component: ViewDistributorsComponent;
  let fixture: ComponentFixture<ViewDistributorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDistributorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDistributorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
