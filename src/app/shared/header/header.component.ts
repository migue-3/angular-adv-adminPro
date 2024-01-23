import { Component } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/models/usuario.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent {

  //Creamos una variable para hacer la instancia a nuestro modelo de Usuarios y poder acceder a todas sus propiedades
  public usuario!: Usuario;

  constructor( private usuarioService: UsuarioService ) {
    // Hacemos la instancia a nuestro modelo de Usuarios y ya podemos acceder a sus propiedades
    this.usuario = usuarioService.usuario;
  }

  logout() {
    this.usuarioService.logout();
  }
}
