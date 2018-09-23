import { Component, OnInit, Inject, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Chart} from 'angular-highcharts';

@Component({
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.css']})
export class HomeComponent implements OnInit {
    title = 'KuiBu';

  animal: string;
  name: string;

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(HomeComponent, {
      width: '250px',
      data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }

  chart = new Chart({
    chart: {
      type: 'line'
    },
    title: {
      text: 'Reading Data Flow'
    },
    credits: {
      enabled: false
    },
    yAxis: {
      gridLineWidth: 1,
      title: {
        text: 'Pages'
      },
      tickInterval: 50,
      ceiling: 580,
      
    },
    plotOptions: {
      line: {
          dataLabels: {
              enabled: true
          }
      }
    },
    series: [
      {
        name: 'Days',
        data: [[0, 10], [2, 21], [5, 32], [8, 39], [8, 47], [11, 75]]
      }
    ]
  });
  
  
}