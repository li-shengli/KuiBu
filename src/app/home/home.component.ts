import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Chart } from 'angular-highcharts';
import { Router } from '@angular/router';
import { NewTaskComponent } from '../new-task/new-task.component';
import { first } from 'rxjs/operators';
import { TaskInfo } from '../_models';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TaskService, AlertService } from '../_services';

@Component({
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.css']})
export class HomeComponent implements OnInit {
  title = 'KuiBu';
  submitTaskForms: FormGroup[] = [];
  ongoingTaskForms: FormGroup[] = [];
  submittedTasks: TaskInfo[] = [];
  ongoingTasks: TaskInfo[] = [];
  doneTasks: TaskInfo[] = [];

  constructor(
    public dialog: MatDialog,
    private taskService: TaskService,
    private router: Router,
    private formBuilder: FormBuilder,
    private alertService: AlertService) {}

  ngOnInit() {
    this.taskService.getAllTasks().subscribe(
      data => {
          console.log("retrieve tasks...");
          this.submittedTasks = data["0"];
          this.ongoingTasks = data["1"];
          this.doneTasks = data["2"];

          for (let i = 0; i < this.submittedTasks.length; i++) {
            console.log('task name: '+ this.submittedTasks[i].taskName);

            this.submitTaskForms[i] = this.formBuilder.group({
              taskId: [this.submittedTasks[i].taskId],
              taskName: [this.submittedTasks[i].taskName, Validators.required],
              pagesIntotal: [this.submittedTasks[i].pagesIntotal, Validators.required],
              expectedDays: [this.submittedTasks[i].expectedDays, Validators.required]
            });
          }

          for (let i=0; i<this.ongoingTasks.length; i++) {
            this.ongoingTaskForms[i] = this.formBuilder.group ({
              taskId: [this.ongoingTasks[i].taskId],
              taskName: [this.ongoingTasks[i].taskName, Validators.required],
              pagesIntotal: [this.ongoingTasks[i].pagesIntotal, Validators.required],
              pagesCurrent: [this.ongoingTasks[i].pagesCurrent, Validators.required],
              chart: new Chart({
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
              })
            })
          }
      },
      error => {
          // this.router.navigate([this.returnUrl]);
          this.alertService.error(error.message);
      });
  }

  saveAndStart(task: FormGroup) {
    console.log("Update the task and start it: " + task.value.taskName);
    task.value.taskStatus = 1;
    this.taskService.updateReadingTask(task.value).subscribe(
      data => {
          console.log('everything goes well. go to home page.')
          this.router.navigate(['/home']);
      },
      error => {
        console.log('something is wrong: '+ error.message);
        this.alertService.error(error);
      });
  }

  update(task: FormGroup) {
    console.log("Update the task: " + task.value.taskName);
    this.taskService.updateReadingTask(task.value).subscribe(
      data => {
          console.log('everything goes well. go to home page.')
          this.router.navigate(['/home']);
      },
      error => {
        console.log('something is wrong: '+ error.message);
        this.alertService.error(error.message);
      });
  }

  delete(task: FormGroup) {
    console.log("Update the task: " + task.value.taskName);
    this.taskService.deleteReadingTask(task.value).subscribe(
      data => {
          console.log('everything goes well. go to home page.')
          this.router.navigate(['/home']);
      },
      error => {
        console.log('something is wrong: '+ error.message);
        this.alertService.error(error.message);
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
            console.log('something is wrong: '+ error.message);
            this.alertService.error(error.message);
          });;
      } else {
        console.log('dialog closed, no need to refresh the task list.');
      }
    });
  }
}