import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, filter, interval, map, retry, take } from 'rxjs';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnInit, OnDestroy {

  public intervalSubs: Subscription;
  
  ngOnInit(): void {
  }
  
  constructor() {

    // this.retornaObservable().pipe(
    //   retry(2)
    // ).subscribe({
    //   next: value => console.log('Subs:', value),
    //   error: err => console.warn('ERROR:', err),
    //   complete: () => console.info('obs$ terminado!!')
    //  });
    this.intervalSubs = this.retornaIntervalo()
                          .subscribe(
                            (valor) => console.log(valor)
                          )
  }
  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }

  retornaIntervalo(): Observable<number> {
    const intervalo$ = interval(200).pipe(
                                        // take(10),
                                        map( valor => {
                                          return valor + 1;
                                        }),
                                        filter( valor => (valor % 2 === 0) ? true : false),
                                    );
    return intervalo$;

  }

  retornaObservable(): Observable<number>{
    let i = -1;

    const obs$ = new Observable<number>( observer => {

     const intervalo = setInterval( () => {
        i++;
        observer.next(i);

        if ( i === 4) {
          clearInterval(intervalo);
          observer.complete();
        }

        if ( i === 2 ) {
          observer.error( 'i llego al valor de 4');
        }
      }, 1000)
    });

    return obs$;
  }


}
