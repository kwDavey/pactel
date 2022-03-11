import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferBranchComponent } from './transfer-branch.component';

describe('TransferBranchComponent', () => {
  let component: TransferBranchComponent;
  let fixture: ComponentFixture<TransferBranchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferBranchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
