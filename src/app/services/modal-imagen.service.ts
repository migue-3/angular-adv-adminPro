import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class ModalImagenService {
  private _ocultarModal: boolean = true;

  public tipo!: 'usuarios' | 'medicos' | 'hospitales';
  public id!: string;
  public img?: string;

  // Para controlar cuando la imagen cambie desde el modal y actualizar la vista en tiempo real
  public imagenCambio: EventEmitter<string> = new EventEmitter<string>();

  get ocultarModal() {
    return this._ocultarModal;
  }

  abrirModal(
    tipo: 'usuarios' | 'medicos' | 'hospitales',
    id: string,
    img: string = 'no-img'
  ) {
    this._ocultarModal = false;
    this.tipo = tipo;
    this.id = id;
    // this.img = img;

    // Validar si la img es de google
    if (img.includes('https')) {
      this.img = img;
    } else {
      this.img = `${base_url}/upload/${tipo}/${img}`;
    }
    // /upload/medicos/39e797b1-42f1-47d7-8e87-344a86179533.jpg
  }

  cerrarModal() {
    this._ocultarModal = true;
  }

  constructor() {}
}
