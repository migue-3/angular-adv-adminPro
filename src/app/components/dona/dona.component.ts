import { Component, Input, OnInit } from '@angular/core';
import { ChartData } from 'chart.js';


@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent implements OnInit {

  public data: number[] = [200, 350, 250]

  ngOnInit(): void {
    this.doughnutChartData = {
      labels: this.doughnutChartLabels,
      datasets: [
        { data: this.data, 
          backgroundColor:['#FF0000','#00FF00','#FFFF00']
        },
      ],
    };
  }

  @Input() title:string = 'N/A'

    // Doughnut
  @Input('labels') doughnutChartLabels: string[] = [
    'Label1',
    'Label2',
    'Label3',
    ];
    @Input('data') doughnutChartData: ChartData<'doughnut'> = {
      labels: this.doughnutChartLabels,
      datasets: [
        { data: [200, 350, 250], 
          backgroundColor:['#FF0000','#00FF00','#FFFF00']
        },
      ],
    };
}
