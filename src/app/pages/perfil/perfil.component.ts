import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import Swal from 'sweetalert2';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public perfilForm!: FormGroup;
  public usuario!: Usuario;
  public imagenPorSubir!: File;
  public imgTemp: any = '';

  constructor( private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private fileUploadService: FileUploadService ) {
      this.usuario = usuarioService.usuario
  }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')] ]
    });
  }

  actualizarPerfil() {
    this.usuarioService.actualizarPerfil( this.perfilForm.value )
      .subscribe( () => {

        //Para actualizar la vista del header  y el sibebar apenas se envie el formulario con los cambios del nombre y email
        // Sin hacer este cambio, tenia que actualizar el navegador para que se vieran reflejados los cambios del nombre y email
        const{ nombre, email } = this.perfilForm.value;
        this.usuario.nombre = nombre;
        this.usuario.email = email;

        Swal.fire('Success!', 'Changes saved', 'success');
      }, (err) => {
        Swal.fire('Error!', err.error.msg, 'error');
      });
  }

  cambiarImagen( file: File) {
    this.imagenPorSubir = file;

    //Procedimiento para mostrar en el html la imagen que quiero subir en tiempo real
    if ( !file ) {
      this.imgTemp = null;
    }

    const reader = new FileReader();
    reader.readAsDataURL(this.imagenPorSubir);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
  }

  subirImagen() {

    this.fileUploadService
      .actualizarFoto( this.imagenPorSubir, 'usuarios', this.usuario.uid!)
      // Con esta parte le asignamos la nueva imagen al usuario y se actualiza en todos lados en tiempo real
      .then( img => {

        this.usuario.img = img;
        Swal.fire('Success!', 'img changed', 'success'); 
      }).catch( err => {
        Swal.fire('Error!', err.error.msg, 'error');
      });
  }

}
