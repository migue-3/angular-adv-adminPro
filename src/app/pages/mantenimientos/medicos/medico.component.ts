import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs';
import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import { Hospital } from 'src/models/hospital.model';
import { Medico } from 'src/models/medico.models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [],
})
export class MedicoComponent implements OnInit {
  public medicoForm!: FormGroup;
  public hospitales: Hospital[] = [];
  public hospitalSeleccionado!: Hospital;
  public medicoSeleccionado!: Medico;

  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private medicoService: MedicoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    // Para obtener el id del medico por la url con el activatedRoute
    this.activatedRoute.params.subscribe(({ id }) => {
      this.cargarMedico(id);
    });

    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required],
    });

    this.cargarHospitales();
    //Gracias a que estamos trabajando con form reactivos podemos crear un observable que
    // este pendiente del form control del hospital con el valueChanges que es un observable
    // al cual nos podemos subscribir para obtener el id del hospital y poder obtener una instancia
    // del mismo y mostrar la img en el html en tiempo real y a su vez con el find hacemos un filtro para obtener
    // toda la informacion del hospital seleccionado
    this.medicoForm.get('hospital')?.valueChanges.subscribe((hospitalId) => {
      this.hospitalSeleccionado = this.hospitales.find(
        (h) => h._id === hospitalId
      )!;
    });
  }

  cargarMedico(id: string) {
    if (id === 'nuevo') {
      return;
    }

    this.medicoService
      .getMedicosById(id)
      //Agregamos el delay por que no se mostraba correctamente la imagen del hospital
      //en la pantalla de medico
      .pipe(delay(100))
      .subscribe((medico: any) => {
        //Validar que en la url el id sea de un medico que existe en la DB,
        //osea que si el medico no existe quiere decir que es un id que se invento
        // o que ya no existe en la DB
        if (!medico) {
          this.router.navigateByUrl('/dashboard/medicos');
          return;
        }

        const {
          nombre,
          hospital: { _id },
        } = medico;
        this.medicoSeleccionado = medico;
        this.medicoForm.setValue({ nombre, hospital: _id });
      });
  }

  cargarHospitales() {
    this.hospitalService
      .cargarHospitales()
      .subscribe((hospitales: Hospital[]) => {
        this.hospitales = hospitales;
      });
  }

  guardarMedico() {
    if (this.medicoSeleccionado) {
      //Actualizar
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id,
      };
      const { nombre } = this.medicoForm.value;
      //Le mandamos la data
      this.medicoService.actualizarMedico(data).subscribe((resp) => {
        console.log(resp);
        Swal.fire(
          'Actualizado',
          `${nombre} actualizado correctamente`,
          'success'
        );
      });
    } else {
      //Crear
      const { nombre } = this.medicoForm.value;
      this.medicoService
        .crearMedico(this.medicoForm.value)
        .subscribe((resp: any) => {
          Swal.fire('Creado', `${nombre} creado correctamente`, 'success');
          this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`);
        });
    }
  }
}
