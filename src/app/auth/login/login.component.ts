import { Component, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {

  //Tomamos el boton de google por referencia local
  @ViewChild('googleBtn') googleBtn!: ElementRef;

  public formSubmitted = false;

  public loginForm: FormGroup = this.fb.group({
    email:[ localStorage.getItem('email') || '', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    password: ['', Validators.required ],
    remember: [false],
  });

  constructor( private fb: FormBuilder,
               private router: Router,
               private usuarioService: UsuarioService,
               private ngZone: NgZone ) {}

  ngAfterViewInit(): void {
    this.googleInit();
  }

  googleInit() {
    google.accounts.id.initialize({
      client_id: "85631883213-g23grlean480rikei8v2vrjtq6vhratj.apps.googleusercontent.com",
      callback: (response: any) => this.ngZone.run(() => this.handleCredentialResponse(response))
    });

    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "outline", size: "large" }  // customization attributes
    );
  }

  handleCredentialResponse( response: any) {
    this.usuarioService.loginGoogle( response.credential)
      .subscribe( resp => {
        // console.log({login: resp})
        // En caso de que la auntenticacion sea correcta navegamos al dashboard
        this.router.navigateByUrl('/');
      });
  }

  login(){

    this.formSubmitted = true;
    // console.log(this.loginForm.value );

    if ( this.loginForm.invalid ) {
      return;
    } 
    // Realizar el posteo del formulario
    this.usuarioService.loginUsuario( this.loginForm.value )
      .subscribe(
        {
          next: resp => {

            if ( this.loginForm.get('remember')?.value ){
              localStorage.setItem('email', this.loginForm.get('email')?.value );
            }else{
              localStorage.removeItem('email');
            }

            // En caso de que la auntenticacion sea correcta navegamos al dashboard
            this.router.navigateByUrl('/');
          },
          error: (err) =>
          {
            // si sucede un error
            Swal.fire('Error', err.error.msg, 'error');
          }
        }
      );
  }

}
