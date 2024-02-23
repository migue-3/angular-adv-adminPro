import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, delay } from 'rxjs';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/models/usuario.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [],
})
export class UsuariosComponent implements OnInit, OnDestroy {
  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  // Usamos el usuariosTemp para pulir la busqueda y regresar los usuarios completos cuando el usario borre la caja de texto de buscar
  public usuariosTemp: Usuario[] = [];

  public imgSubs!: Subscription;
  public paginaDesde: number = 0;
  public loading: boolean = true;

  constructor(
    private usuariosService: UsuarioService,
    private busquedasService: BusquedasService,
    private modalImagenService: ModalImagenService
  ) {}

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarUsuarios();

    // nos suscribimos al event emitter, esto va a refrescar la vista actual mostrando la nueva imagen actualizada
    this.imgSubs = this.modalImagenService.imagenCambio
      .pipe(delay(100))
      .subscribe((img) => this.cargarUsuarios());
  }

  cargarUsuarios() {
    this.loading = true;
    this.usuariosService
      .cargarUsuarios(this.paginaDesde)
      .subscribe(({ total, usuarios }) => {
        this.totalUsuarios = total;
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
        //Cuando ya tenemos la respuesta ponemos el loading en false
        this.loading = false;
      });
  }

  cambiarPagina(valor: number) {
    this.paginaDesde += valor;

    if (this.paginaDesde < 0) {
      this.paginaDesde = 0;
    } else if (this.paginaDesde >= this.totalUsuarios) {
      // hacemos el proceso inverso al de arriba
      this.paginaDesde -= valor;
    }

    this.cargarUsuarios();
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      /* le asignamos a this.usuarios que son los que se muestran en la tabla de busqueda los usuarios.temp,
       cuando la caja de texto de buscar se mande en blanco se debe mostrar en la tabla de busqueda los
       usuarios que estaban antes de borrar la caja de texto */
      return (this.usuarios = this.usuariosTemp);
    }
    this.busquedasService
      .buscar('usuarios', termino)
      .subscribe((resultados) => {
        this.usuarios = resultados;
      });

    return true;
  }

  eliminarUsuario(usuario: Usuario) {
    // Validacion para no permitir borrarme a mi mismo
    if (usuario.uid === this.usuariosService.uid) {
      return Swal.fire('Error', 'No puede borrarse a si mismo', 'error');
    }

    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Esta a punto de borrar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      // confirmButtonColor: "#3085d6",
      // cancelButtonColor: "#d33",
      confirmButtonText: 'Eliminarlo',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuariosService.eliminarUsuario(usuario).subscribe((resp) => {
          // Una vez se confirmar la eliminacion llamamos al metodo cargarUsuarios() para actualizar la vista en la tabla
          this.cargarUsuarios();
          Swal.fire(
            'Usuario eliminado',
            `${usuario.nombre} fue eliminado correctamente`,
            'success'
          );
        });
      }
    });
    return true;
  }

  cambiarRole(usuario: Usuario) {
    this.usuariosService.GuardarUsuario(usuario).subscribe((resp) => {
      console.log(resp);
    });
  }

  abrirModal(usuario: Usuario) {
    this.modalImagenService.abrirModal('usuarios', usuario.uid!, usuario.img);
  }
}
