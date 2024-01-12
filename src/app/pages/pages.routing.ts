import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { PagesComponent } from './pages.component';
import { ProgressComponent } from './progress/progress.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
    { 
    path: 'dashboard',
    component: PagesComponent,
    canActivate: [ AuthGuard ],
    children: [
                        // Enviar parametros por la ruta(data)  //
        { path: '', component: DashboardComponent, data: { titulo: 'Dashboard'} },
        { path: 'grafica1', component: Grafica1Component, data: { titulo: 'Graficas'}  },
        { path: 'progress', component: ProgressComponent, data: { titulo: 'ProgressBar'} },
        { path: 'account-settings', component: AccountSettingsComponent, data: { titulo: 'Settings'} },
        { path: 'promesas', component: PromesasComponent, data: { titulo: 'Promesas'} },
        { path: 'rxjs', component: RxjsComponent, data: { titulo: 'Rxjs'} },
        // { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ]
   },
]

@NgModule({
    imports: [
      RouterModule.forChild( routes)
    ],
    exports: [ RouterModule ]
  })
  export class PagesRoutingModule { }
  

