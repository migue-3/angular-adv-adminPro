import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/models/usuario.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [],
})
export class HeaderComponent {
  //Creamos una variable para hacer la instancia a nuestro modelo de Usuarios y poder acceder a todas sus propiedades
  public usuario!: Usuario;

  constructor(private usuarioService: UsuarioService, private router: Router) {
    // Hacemos la instancia a nuestro modelo de Usuarios y ya podemos acceder a sus propiedades
    this.usuario = usuarioService.usuario;
  }

  logout() {
    this.usuarioService.logout();
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      return;
    }

    this.router.navigateByUrl(`/dashboard/buscar/${termino}`);
  }
}
