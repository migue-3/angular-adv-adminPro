import { Component, OnDestroy } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Subject, Subscription, filter, map, takeUntil } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnDestroy {

  public titulo!: string;
  tituloSubs$: Subject<void> = new Subject();

  constructor( private router: Router) {
   this.getArgumentosRuta();
  }
  ngOnDestroy(): void {
    this.tituloSubs$.next();
    this.tituloSubs$.complete
  }

  getArgumentosRuta() {
    this.router.events
    .pipe(
      // Filtramos solo las instancias de ActivationEnd en el primer filter
      filter( (event: any) => event instanceof ActivationEnd ),
      // Filtramos solo el que tiene la data que nos interesa
      filter( ( event: ActivationEnd ) => event.snapshot.firstChild === null  ),
      // Finalmente con el map solo retornamos la data que viene del event de arriba
      map( ( event: ActivationEnd ) => event.snapshot.data ),
      takeUntil(this.tituloSubs$),
    )
    .subscribe( ({titulo}) => { 
      this.titulo = titulo;
      document.title = `AdminPro - ${this.titulo}`;  
    })
  }

}
