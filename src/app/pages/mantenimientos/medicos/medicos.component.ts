import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, delay } from 'rxjs';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { Medico } from 'src/models/medico.models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [],
})
export class MedicosComponent implements OnInit, OnDestroy {
  public loading: boolean = true;
  public medicos: Medico[] = [];
  public imgSubs!: Subscription;

  constructor(
    private medicosService: MedicoService,
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService
  ) {}

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();
    // nos suscribimos al event emitter, esto va a refrescar la vista actual mostrando la nueva imagen actualizada
    this.imgSubs = this.modalImagenService.imagenCambio
      .pipe(delay(100))
      .subscribe((img) => this.cargarMedicos());
  }

  cargarMedicos() {
    this.loading = true;
    this.medicosService.cargarMedicos().subscribe((medicos) => {
      this.loading = false;
      this.medicos = medicos;
    });
  }

  abrirModal(medico: Medico) {
    this.modalImagenService.abrirModal('medicos', medico._id!, medico.img);
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      return this.cargarMedicos();
    }
    this.busquedasService.buscar('medicos', termino).subscribe((resp) => {
      this.medicos = resp as Medico[];
    });
  }

  borrarMedico(medico: Medico) {
    Swal.fire({
      title: '¿Borrar medico?',
      text: `Esta a punto de borrar a ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      // confirmButtonColor: "#3085d6",
      // cancelButtonColor: "#d33",
      confirmButtonText: 'Eliminarlo',
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicosService.borrarMedico(medico._id!).subscribe((resp) => {
          // Una vez se confirmar la eliminacion llamamos al metodo cargarUsuarios() para actualizar la vista en la tabla
          this.cargarMedicos();
          Swal.fire(
            'Medico eliminado',
            `${medico.nombre} fue eliminado correctamente`,
            'success'
          );
        });
      }
    });
    return true;
  }
}
