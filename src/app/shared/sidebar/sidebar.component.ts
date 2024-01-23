import { Component } from '@angular/core';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/models/usuario.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent {

  public menuItems: any[];
  public usuario!: Usuario;

  constructor( private sidebarService: SidebarService,
               private usuarioService: UsuarioService ) {
    this.menuItems = sidebarService.menu;
    this.usuario = usuarioService.usuario;
  }



}
 