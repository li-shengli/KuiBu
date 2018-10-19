import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Chart } from 'angular-highcharts';
import { Router } from '@angular/router';
import { NewTaskComponent } from '../new-task/new-task.component';
import { first } from 'rxjs/operators';
import { TaskInfo } from '../_models';
import { MapArrayConverter } from '../_helpers/MapArrayConverter';

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
          console.log("retrieve tasks..." + JSON.stringify(data));
          this.submittedTasks = data["Submitted"];
          this.ongoingTasks = data["Executing"];
          this.doneTasks = data["Finished"];

          for (let i = 0; i < this.submittedTasks.length; i++) {
            console.log('task history 3: '+ Array.from(this.submittedTasks[i].history));

            this.submitTaskForms[i] = this.formBuilder.group({
              taskId: [this.submittedTasks[i].taskId],
              taskType: [this.submittedTasks[i].taskType],
              taskName: [this.submittedTasks[i].taskName, Validators.required],
              pagesCurrent: [this.submittedTasks[i].pagesCurrent, [Validators.required, Validators.pattern('[\d]')]],
              pagesIntotal: [this.submittedTasks[i].pagesIntotal, [Validators.required, Validators.pattern('[\d]')]],
              expectedDays: [this.submittedTasks[i].expectedDays, [Validators.required, Validators.pattern('[\d]')]]
            });
          }

          for (let i=0; i<this.ongoingTasks.length; i++) {
            console.log("Show task : " + this.ongoingTasks[i].taskName);

            this.ongoingTaskForms[i] = this.formBuilder.group ({
              taskId: [this.ongoingTasks[i].taskId],
              taskType: [this.ongoingTasks[i].taskType],
              taskName: [this.ongoingTasks[i].taskName, Validators.required],
              taskStatus: [this.ongoingTasks[i].taskStatus],
              pagesIntotal: [this.ongoingTasks[i].pagesIntotal, [Validators.required, Validators.pattern('[\d]')]],
              pagesCurrent: [this.ongoingTasks[i].pagesCurrent, [Validators.required, Validators.pattern('[\d]')]],
              progress: 100*this.ongoingTasks[i].pagesCurrent/this.ongoingTasks[i].pagesIntotal,
              chartData: new Chart({
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
                  tickInterval: this.ongoingTasks[i].pagesIntotal/10,
                  ceiling: this.ongoingTasks[i].pagesIntotal,
                  
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
                    data: this.arrayConvert(this.ongoingTasks[i].history)
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

  arrayConvert(history: Map<number, number>) {
    var historyArray = MapArrayConverter.toArray(history);
    return historyArray;
  }

  saveAndStart(task: FormGroup) {
    console.log("Update the task and start it: " + task.value.taskName);
    task.value.taskStatus = "Executing";
    this.taskService.updateReadingTask(task.value).subscribe(
      data => {
          console.log('everything goes well. go to home page.')
          this.router.navigate(['/home']);
          this.ngOnInit();
      },
      error => {
        console.log('something is wrong: '+ error.message);
        this.alertService.error(error.message);
      });
  }

  update(task: FormGroup) {
    console.log("Update the task: " + task.value.taskName);
    task.value.chartData = null;
    this.taskService.updateReadingTask(task.value).subscribe(
      data => {
          console.log('everything goes well. go to home page.')
          this.router.navigate(['/home']);
          this.ngOnInit();
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
          this.ngOnInit();
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
              this.ngOnInit();
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