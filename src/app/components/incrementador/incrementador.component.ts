import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: [
  ]
})
export class IncrementadorComponent {
 
  @Input() progreso: number = 30;
  @Input() btnClass: string = 'btn btn-primary';

  @Output() emitValor: EventEmitter<number> = new EventEmitter();

  changeValue( value: number){
    
    if ( this.progreso >= 100 && value >= 0) {
      this.emitValor.emit(100);
      this.progreso = 100;
      return 
    }
    
    if ( this.progreso <= 0 && value < 0) {
      this.emitValor.emit(0);
      this.progreso = 0;
      return 
    }
    
    this.progreso = this.progreso + value;
    this.emitValor.emit(this.progreso)
  }

  onChange( inputValue: number){
    this.progreso = Math.min(100, Math.max(0, inputValue));
    this.emitValor.emit(this.progreso);
  }

}
