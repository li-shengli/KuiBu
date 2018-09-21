import { Component, Inject, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { NewTaskComponent } from './new-task/new-task.component';
import {Chart} from 'angular-highcharts';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'KuiBu';

  animal: string;
  name: string;

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(NewTaskComponent, {
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
      
    }
    series: [
      {
        name: 'Days',
        data: [10, 21, 32, 39, 47, 56, 68, 79, 84, 88, 97, 102, 109, 112, 118, 130, 139, 140, 146, 157]
      }
    ]
  });
  
  
}

