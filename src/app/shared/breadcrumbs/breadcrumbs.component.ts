import { Component, OnDestroy } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Subject, Subscription, filter, map } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnDestroy {

  public titulo: string = '';
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
      filter( (event: any) => event instanceof ActivationEnd ),
      filter( ( event: ActivationEnd ) => event.snapshot.firstChild === null  ),
      map( ( event: ActivationEnd ) => event.snapshot.data ),
    )
    .subscribe( ({titulo}) => { 
      this.titulo = titulo;
      document.title = `AdminPro - ${this.titulo}`;  
    })
  }

}
