import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitasEnfermeroComponent } from './citas-enfermero.component';

describe('CitasEnfermeroComponent', () => {
  let component: CitasEnfermeroComponent;
  let fixture: ComponentFixture<CitasEnfermeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitasEnfermeroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitasEnfermeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
