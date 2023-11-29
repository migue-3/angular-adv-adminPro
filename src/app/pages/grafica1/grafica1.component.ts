import { Component } from '@angular/core';
import { ChartData } from 'chart.js';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component {

  labels1: string[] = ['Semillas', 'Abono', 'Rollings'];
  public data: number[] = [400, 200, 600]

  public data1: ChartData<'doughnut'> = {
    labels: this.labels1,
    datasets: [
      { data: this.data },
    ]
  };
}
