import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { AuthGuard, canMatch } from '../guards/auth.guard';
//****Se comento esta parte por que ahora vamos a cargar las paginas con LazyLoad en el modulo de childRoutes****
// import { DashboardComponent } from './dashboard/dashboard.component';
// import { Grafica1Component } from './grafica1/grafica1.component';
// import { ProgressComponent } from './progress/progress.component';
// import { AccountSettingsComponent } from './account-settings/account-settings.component';
// import { PromesasComponent } from './promesas/promesas.component';
// import { RxjsComponent } from './rxjs/rxjs.component';
// import { PerfilComponent } from './perfil/perfil.component';
// import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
// import { MedicosComponent } from './mantenimientos/medicos/medicos.component';
// import { HospitalesComponent } from './mantenimientos/hospitales/hospitales.component';
// import { MedicoComponent } from './mantenimientos/medicos/medico.component';
// import { BusquedaComponent } from './busqueda/busqueda.component';
// import { adminGuard } from '../guards/admin.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    component: PagesComponent,
    canActivate: [AuthGuard],
    // Implementamos el canMatch que es un guard que se usa cuando estamos utilizando el lazyLoad
    canMatch: [canMatch],
    loadChildren: () =>
      import('./child-routes.module').then((m) => m.ChildRoutesModule),
    /* Para trabajar con lazyLoad ya no ocupamos el children ahora usaremos loadChildren para cargar las paginas */
    // children: [
    // Enviar parametros por la ruta(data)
    // {
    //   path: '',
    //   component: DashboardComponent,
    //   data: { titulo: 'Dashboard' },
    // },
    // {
    //   path: 'grafica1',
    //   component: Grafica1Component,
    //   data: { titulo: 'Graficas' },
    // },
    // {
    //   path: 'progress',
    //   component: ProgressComponent,
    //   data: { titulo: 'ProgressBar' },
    // },
    // {
    //   path: 'account-settings',
    //   component: AccountSettingsComponent,
    //   data: { titulo: 'Settings' },
    // },
    // {
    //   path: 'buscar/:termino',
    //   component: BusquedaComponent,
    //   data: { titulo: 'Busqueda' },
    // },
    // {
    //   path: 'promesas',
    //   component: PromesasComponent,
    //   data: { titulo: 'Promesas' },
    // },
    // { path: 'rxjs', component: RxjsComponent, data: { titulo: 'Rxjs' } },
    // {
    //   path: 'perfil',
    //   component: PerfilComponent,
    //   data: { titulo: 'Perfil de usuario' },
    // },
    // // { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    // //Mantenimientos
    // {
    //   path: 'medicos',
    //   component: MedicosComponent,
    //   data: { titulo: 'Mantenimiento de Médicos' },
    // },
    // {
    //   path: 'medico/:id',
    //   component: MedicoComponent,
    //   data: { titulo: 'Mantenimiento de Médicos' },
    // },
    // {
    //   path: 'hospitales',
    //   component: HospitalesComponent,
    //   data: { titulo: 'Mantenimiento de Hospitales' },
    // },
    // //Rutas de ADMIN_ROLE - implementamos nuestro guard de ADMIN
    // {
    //   path: 'usuarios',
    //   canActivate: [adminGuard],
    //   component: UsuariosComponent,
    //   data: { titulo: 'Mantenimiento de Usuarios' },
    // },
    // ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
