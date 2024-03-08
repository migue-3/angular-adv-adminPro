import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, delay } from 'rxjs';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { Hospital } from 'src/models/hospital.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [],
})
export class HospitalesComponent implements OnInit, OnDestroy {
  public hospitales: Hospital[] = [];
  public loading: boolean = true;
  public imgSubs!: Subscription;

  constructor(
    private hospitalService: HospitalService,
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService
  ) {}

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospitales();
    // nos suscribimos al event emitter, esto va a refrescar la vista actual mostrando la nueva imagen actualizada
    this.imgSubs = this.modalImagenService.imagenCambio
      .pipe(delay(100))
      .subscribe((img) => this.cargarHospitales());
  }

  cargarHospitales() {
    this.loading = true;
    this.hospitalService.cargarHospitales().subscribe((hospitales) => {
      this.loading = false;
      this.hospitales = hospitales;
    });
  }

  guardarCambios(hospital: Hospital) {
    this.hospitalService
      .actualizarHospital(hospital._id!, hospital.nombre)
      .subscribe((resp) => {
        Swal.fire('Actualizado', hospital.nombre, 'success');
      });
  }
  eliminarHospital(hospital: Hospital) {
    this.hospitalService.borrarHospital(hospital._id!).subscribe((resp) => {
      this.cargarHospitales();
      Swal.fire('Eliminado', hospital.nombre, 'success');
    });
  }

  async abrirSweetAlert() {
    // Igualamos value a un espacio vacio '', por un error que se disparaba cuando le dabas cancelar al sweetAlert de crear hospital
    const { value = '' } = await Swal.fire<string>({
      input: 'text',
      text: 'Ingrese el nombre del nuevo hospital',
      title: 'Crear hospital',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true,
    });
    if (value!.trim().length > 0) {
      this.hospitalService.crearHospitales(value!).subscribe((resp: any) => {
        this.hospitales.push(resp.hospital);
      });
    }
  }

  abrirModal(hospital: Hospital) {
    this.modalImagenService.abrirModal(
      'hospitales',
      hospital._id!,
      hospital.img
    );
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      return this.cargarHospitales();
    }
    this.busquedasService.buscar('hospitales', termino).subscribe((resp) => {
      this.hospitales = resp as Hospital[];
    });
  }
}
