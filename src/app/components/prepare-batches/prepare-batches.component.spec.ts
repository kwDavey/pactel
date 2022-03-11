import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareBatchesComponent } from './prepare-batches.component';

describe('PrepareBatchesComponent', () => {
  let component: PrepareBatchesComponent;
  let fixture: ComponentFixture<PrepareBatchesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepareBatchesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareBatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
