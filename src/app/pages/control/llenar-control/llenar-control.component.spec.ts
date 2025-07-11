import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LlenarControlComponent } from './llenar-control.component';

describe('LlenarControlComponent', () => {
  let component: LlenarControlComponent;
  let fixture: ComponentFixture<LlenarControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LlenarControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LlenarControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
