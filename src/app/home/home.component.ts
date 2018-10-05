import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Chart } from 'angular-highcharts';
import { Router } from '@angular/router';
import { NewTaskComponent } from '../new-task/new-task.component';
import { first } from 'rxjs/operators';
import { TaskInfo } from '../_models';

import { TaskService, AlertService } from '../_services';

@Component({
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.css']})
export class HomeComponent implements OnInit {
  title = 'KuiBu';
  submittedTasks: TaskInfo[] = [];
  ongoingTasks: TaskInfo[] = [];
  doneTasks: TaskInfo[] = [];

  constructor(
    public dialog: MatDialog,
    private taskService: TaskService,
    private router: Router,
    private alertService: AlertService) {}

  ngOnInit() {
    this.taskService.getAllTasks().subscribe(
      data => {
          console.log("retrieve tasks...");
          this.submittedTasks = data["0"];
          this.ongoingTasks = data["1"];
          this.doneTasks = data["2"];
      },
      error => {
          // this.router.navigate([this.returnUrl]);
          this.alertService.error(error);
      });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(NewTaskComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().pipe(first()).subscribe(result => {
      if (result) {
        console.log('Dialog result: '+ `${result.value}`);
        this.taskService.createTask(result.value).subscribe(
          data => {
              console.log('everything goes well. go to home page.')
              this.router.navigate(['/home']);
          },
          error => {
            console.log('something is wrong: '+ error);
              // this.router.navigate([this.returnUrl]);
              this.alertService.error(error);
              //this.loading = false;
          });;
      } else {
        console.log('dialog closed, no need to refresh the task list.');
      }
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
        data: [[0, 0], [2, 21], [5, 32], [7, 39], [8, 47], [11, 75]]
      }
    ]
  });
  
  
}