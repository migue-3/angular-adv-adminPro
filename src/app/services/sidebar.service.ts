import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  public menu: any[] = [];

  cargarMenu() {
    this.menu = JSON.parse(localStorage.getItem('menu')!) || [];
  }

  //****NOTA****
  //Ahora el menu no se va a cargar de manera estatica, Ahora se hara una peticion al backend
  // y este nos traera el menu a mostrar depende del ROLE que tenga el user
  // menu: any[] = [
  //   {
  //     titulo: '*Dashboard*',
  //     icono: 'mdi mdi-gauge',
  //     submenu: [
  //       { titulo: 'Main', url:'/'},
  //       { titulo: 'Progress', url:'progress'},
  //       { titulo: 'Graficas', url:'grafica1'},
  //       { titulo: 'Promesas', url:'promesas'},
  //       { titulo: 'Rxjs', url:'rxjs'},
  //     ]

  //   },

  //   {
  //     titulo: '*Mantenimientos*',
  //     icono: 'mdi mdi-folder-lock-open',
  //     submenu: [
  //       { titulo: 'Usuarios', url:'usuarios'},
  //       { titulo: 'Hospitales', url:'hospitales'},
  //       { titulo: 'Médicos', url:'medicos'},
  //     ]

  //   }
  // ];

  constructor() {}
}
