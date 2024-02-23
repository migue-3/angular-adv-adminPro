import { Component } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [],
})
export class ModalImagenComponent {
  public imagenPorSubir!: File;
  public imgTemp: any = '';

  constructor(
    public modalImagenService: ModalImagenService,
    public fileUploadService: FileUploadService
  ) {}

  cerrarModal() {
    this.imgTemp = null;
    this.modalImagenService.cerrarModal();
  }

  cambiarImagen(file: File) {
    this.imagenPorSubir = file;

    //Procedimiento para mostrar en el html la imagen que quiero subir en tiempo real
    if (!file) {
      this.imgTemp = null;
    }

    const reader = new FileReader();
    reader.readAsDataURL(this.imagenPorSubir);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    };
  }

  subirImagen() {
    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUploadService
      .actualizarFoto(this.imagenPorSubir, tipo, id)
      // Con esta parte le asignamos la nueva imagen al usuario y se actualiza en todos lados en tiempo real
      .then((img) => {
        Swal.fire('Success!', 'img changed', 'success');

        // Cuando se suba la imagen podemos hacer una emision del servicio
        this.modalImagenService.imagenCambio.emit(img);
        this.cerrarModal();
      })
      .catch((err) => {
        Swal.fire('Error!', err.error.msg, 'error');
      });
  }
}
