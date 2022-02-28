import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanBoxComponent } from './scan-box.component';

describe('ScanBoxComponent', () => {
  let component: ScanBoxComponent;
  let fixture: ComponentFixture<ScanBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScanBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
