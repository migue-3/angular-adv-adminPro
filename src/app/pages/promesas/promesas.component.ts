import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {


  ngOnInit(): void {
    
    // const promesa = new Promise( ( resolve, reject) => {

    //   if ( true ){
    //     //Cuando la promesa se ejecuta correctamente
    //     resolve('Hola Mundo');
    //   } else {
    //     //
    //     reject('Algo salio mal');
    //   }
    // });

    // // Nos suscribimos a la promesa, 'then' para cuando se ejecuta exitosamente
    // promesa.then( (mensaje) => {
    //   console.log(mensaje);
    // })
    // .catch( err => console.log('ERROR EN MI PROMESA-->>', err) );

    // console.log('Fin del Init')

    this.getUsuarios().then( usuarios => {
      console.log(usuarios);
    })
    
  }
  
  //usamos el fetch API que nos permite hacer peticiones http rapidamente y ya viene incluido en java no se importa.
  getUsuarios() {

    const promesa = new Promise((resolve) => {
      fetch('https://reqres.in/api/users?page=2')
        .then( resp => resp.json() )
        .then( body => resolve(body.data))
    });

    return promesa;
  }
}
