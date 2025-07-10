import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitasPacienteComponent } from './citas-paciente.component';

describe('CitasPacienteComponent', () => {
  let component: CitasPacienteComponent;
  let fixture: ComponentFixture<CitasPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitasPacienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitasPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
