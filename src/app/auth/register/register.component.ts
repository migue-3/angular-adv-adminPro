import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  public formSubmitted = false;

  public registerForm = this.fb.group({
    nombre: ['miguel', [ Validators.required, Validators.minLength(3)]],
    email: ['test100@gmail.com', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    password: ['123456', Validators.required ],
    password2: ['123456', Validators.required ],
    terminos: [ true, Validators.requiredTrue ],
  }, {
    // Validacion personalizada para que el formulario cambie invalido/valido dependendiendo
    //   de alguna otra validacion. Lo podemos definir asi-->>
    validators: this.passwordsIguales('password', 'password2')
  });

  constructor( private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private router: Router ) {}

  crearUsuario() {
    this.formSubmitted = true;
    console.log(this.registerForm.value );

    if ( this.registerForm.invalid ) {
      return;
    } 
    // Realizar el posteo del formulario solo si es valido
    this.usuarioService.crearUsuario( this.registerForm.value )
      .subscribe(
        {
          next: resp => {
            console.log('usuario creado');
            // console.log(resp)
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
  };

  campoNoValido( campo: string): boolean {
    
    if ( !this.registerForm.get(campo)?.valid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }
  };

  passwordInvalid() {
    const pass1 = this.registerForm.get('password')?.value;
    const pass2 = this.registerForm.get('password2')?.value;

    if ( ( pass1 !== pass2 ) && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }
  };

  passwordsIguales(pass1Name: string, pass2Name: string) {

    //Necesitamos retornar una funcion y hacer referencia al formulario (CON EL FORMGROUP )
    return ( formgroup: FormGroup ) => {

      const pass1Control = formgroup.get(pass1Name);
      const pass2Control = formgroup.get(pass2Name);

      if ( pass1Control?.value === pass2Control?.value ) {
        pass2Control?.setErrors(null);
      } else {
        pass2Control?.setErrors({ noEsIgual: true })
      }
      
    }

  }

}
