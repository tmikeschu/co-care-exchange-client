import { Component, OnInit } from '@angular/core';
import * as c3 from 'c3'
import { Router } from '@angular/router';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss']
})
export class MetricsComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  close() {
    this.router.navigate(['/dashboard']);
  }

  ngAfterViewInit() {
    var chartReceived;
    var receivedData = ['data1', 3, 20, 10, 40, 15, 25];
    chartReceived = this.generateChart('chartReceived', receivedData);

    var chartShared;
    var sharedData = ['data1', 10, 4.5, 0, 6, 8.5, 5.5];
    chartShared = this.generateChart('chartShared', sharedData);

  }

  generateChart(chartId, data) {
    return c3.generate({
      bindto: '#' + chartId,
      data: {
        columns: [
          data,

        ],
        type: 'bar',
        labels: true
      },
      bar: {
        width: {
          ratio: 0.3 // this makes bar width 50% of length between ticks
        }
      },
      size: {
        height: 200,
        width: 300
    },
      legend: {
        show: false
      }
    });
  }

}

