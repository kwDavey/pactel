import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocateClientComponent } from './allocate-client.component';

describe('AllocateClientComponent', () => {
  let component: AllocateClientComponent;
  let fixture: ComponentFixture<AllocateClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllocateClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllocateClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
