import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatIconRegistry, MatIconModule, MatSelectChange } from '@angular/material';
import { Chart } from 'angular-highcharts';
import { Router } from '@angular/router';
import { NewTaskComponent } from '../new-task/new-task.component';
import { first } from 'rxjs/operators';
import { TaskInfo } from '../_models';
import { MapArrayConverter } from '../_helpers/MapArrayConverter';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatOptionSelectionChange } from '@angular/material/core'
import { TaskService, AlertService } from '../_services';

import { ConnectUsComponent } from '../connect-us/connect-us.component';

import {MatSidenav} from '@angular/material/sidenav';
import {DialogConfirmDialog} from '../delete-confirm/delete-confirm.component';
import {DoneConfirmComponent} from '../done-confirm/done-confirm.component';

@Component({
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.css']})
export class HomeComponent implements OnInit {
  title = 'KuiBu';
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  selectedIndex: number = 1;
  submitTaskForms: FormGroup[] = [];
  ongoingTaskForms: FormGroup[] = [];
  doneTaskForms: FormGroup[] = [];
  submittedTasks: TaskInfo[] = [];
  ongoingTasks: TaskInfo[] = [];
  doneTasks: TaskInfo[] = [];
  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(
    public dialog: MatDialog,
    private taskService: TaskService,
    private router: Router,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
    ) {
      iconRegistry.addSvgIcon(
        'clear',
        sanitizer.bypassSecurityTrustResourceUrl('../../assets/img/close.svg'));
      iconRegistry.addSvgIcon(
        'user_profile',
        sanitizer.bypassSecurityTrustResourceUrl('../../assets/img/user_profile.svg'));
      iconRegistry.addSvgIcon(
        'data_backup',
        sanitizer.bypassSecurityTrustResourceUrl('../../assets/img/data_backup.svg'));
    }

  ngOnInit() {
    this.submitTaskForms = [];
    this.ongoingTaskForms = [];
    this.taskService.getAllTasks().subscribe(
      data => {
          console.log("retrieve tasks..." + JSON.stringify(data));
          this.submittedTasks = data["Submitted"];
          this.ongoingTasks = data["Executing"];
          this.doneTasks = data["Finished"];

          for (let i = 0; i < this.submittedTasks.length; i++) {
            console.log('task history 3: '+ Array.from(this.submittedTasks[i].history));

            this.submitTaskForms.push(
              this.formBuilder.group({
                taskId: [this.submittedTasks[i].taskId],
                taskType: [this.submittedTasks[i].taskType],
                taskName: [this.submittedTasks[i].taskName, Validators.required],
                pagesCurrent: [this.submittedTasks[i].pagesCurrent, [Validators.required, Validators.pattern('[\d]')]],
                pagesIntotal: [this.submittedTasks[i].pagesIntotal, [Validators.required, Validators.pattern('[\d]')]],
                expectedDays: [this.submittedTasks[i].expectedDays, [Validators.required, Validators.pattern('[\d]')]]
              })
            );
          }

          for (let i=0; i<this.ongoingTasks.length; i++) {
            console.log("Show task : " + this.ongoingTasks[i].taskName);

            this.ongoingTaskForms[i] = this.taskForGroup(this.ongoingTasks[i]);
          }

          for (let i=0; i<this.doneTasks.length; i++) {
            console.log("Show task : " + this.doneTasks[i].taskName);

            this.doneTaskForms[i] = this.taskForGroup(this.doneTasks[i]);
          }
      },
      error => {
          this.alertService.error(error.message);
      });
  }

  taskForGroup(taskInfo: TaskInfo) {
   return this.formBuilder.group ({
              taskId: [taskInfo.taskId],
              taskType: [taskInfo.taskType],
              taskName: [taskInfo.taskName, Validators.required],
              taskStatus: [taskInfo.taskStatus],
              pagesIntotal: [taskInfo.pagesIntotal],
              pagesCurrent: [taskInfo.pagesCurrent],
              startTime: [new Date(taskInfo.startTime).toLocaleString()],
              endTime: [new Date(taskInfo.endDate).toLocaleString()],
              progress: 100*taskInfo.pagesCurrent/taskInfo.pagesIntotal,
              progressColor: this.progressTheme(taskInfo),
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
                    text: ''
                  },
                  tickInterval: taskInfo.pagesIntotal/10,
                  ceiling: taskInfo.pagesIntotal,
                  
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
                    data: this.arrayConvert(taskInfo.history)
                  }
                ]
              })
            })
  }

  progressTheme(taskInfo: TaskInfo) {
    var buffer: number = 0.05;
    var d: number = (Date.now() - Date.parse(taskInfo.startTime.toString()))/(24*60*60*1000);
    var daysPassed = parseInt(d.toString());
    var pageAlreadyDone = taskInfo.history.get(0);

    var actualProgress = taskInfo.pagesCurrent / taskInfo.pagesIntotal;
    var expectedProgress = (pageAlreadyDone / taskInfo.pagesIntotal) + (taskInfo.pagesCurrent - pageAlreadyDone) / taskInfo.pagesIntotal * daysPassed;

    if (actualProgress - expectedProgress > buffer) {
      return "accent";
    } else if (expectedProgress - actualProgress > buffer) {
      return "warn";
    }
    
    return "primary";
  }

  sideNavClose() {
    this.sidenav.close();
  }

  connectUs() {
    const dialogRef = this.dialog.open(ConnectUsComponent, {
      panelClass: 'contact-us-container'
    });

    dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
    });
  }

  logout() {
    this.router.navigate(['/login']);
  }

  userProfile() {
    this.router.navigate(['/user_profile']);
  }

  arrayConvert(history: Map<number, number>) {
    var historyArray = MapArrayConverter.toArray(history);
    return historyArray;
  }

  reloadCurrentPage() {
    this.ngOnInit();
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['']);
  }

  saveAndStart(task: FormGroup) {
    console.log("Update the task and start it: " + task.value.taskName);
    task.value.taskStatus = "Executing";
    task.value.startTime = new Date();
    this.taskService.updateReadingTask(task.value).subscribe(
      data => {
        this.selectedIndex = 1;
        this.reloadCurrentPage();
        console.log('everything goes well. go to home page');
      },
      error => {
        console.log('something is wrong: '+ error.message);
        this.alertService.error(error.message);
      });
  }

  finish(task: FormGroup) {
    console.log("Update the task: " + task.value.taskName);
    task.value.chartData = null;
    task.value.taskStatus = "Finished";
    this.taskService.finishReadingTask(task.value).subscribe(
      data => {
          this.selectedIndex = 2;
          this.reloadCurrentPage();
          console.log('everything goes well. go to home page.')
      },
      error => {
        console.log('something is wrong: '+ error.message);
        this.alertService.error(error.message);
      });
  }

  delete(task: FormGroup, taskIndex: number, taskType: string) {
    console.log("Delete the task: " + task.value.taskName);
    if ('submitted' == taskType) {
      console.log("Delete a Submitted taskIndex: " + taskIndex);
      this.submitTaskForms.slice(taskIndex, 1);
    } else if ('on-going' == taskType) {
      console.log("Delete a On-going taskIndex: " + taskIndex);
      this.ongoingTaskForms.slice(taskIndex, 1);
    }
    this.taskService.deleteReadingTask(task.value).subscribe(
      data => {
          this.reloadCurrentPage();
          console.log('everything goes well. go to home page.')
      },
      error => {
        console.log('something is wrong: '+ error.message);
        this.alertService.error(error.message);
      });
      
  }
  
  openDialog(): void {
    const dialogRef = this.dialog.open(NewTaskComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().pipe(first()).subscribe(result => {
      if (result) {
        console.log('Dialog result: '+ `${result.value}`);
        this.taskService.createTask(result.value).subscribe(
          data => {
              this.selectedIndex = 0;
              this.reloadCurrentPage();
              console.log('everything goes well. go to home page.')
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

  deleteDialog(task: FormGroup, taskIndex: number, taskType: string) {
    const dialogRef = this.dialog.open(DialogConfirmDialog);

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
          this.delete(task, taskIndex, taskType);
      }
    });
  }

  doneDialog(task: FormGroup, taskIndex: number, taskType: string) {
    const dialogRef = this.dialog.open(DoneConfirmComponent);

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
          this.finish(task);
      }
    });
  }

  pageChange(changed: MatSelectChange, taskIndex: number) {
    console.log('pagesCurrent changed: ' + changed.value);
    console.log('Task Id: ' + this.ongoingTasks[taskIndex].taskId);

    console.log('type of startTime: ' + typeof(this.ongoingTasks[taskIndex].startTime));

    if (this.ongoingTasks[taskIndex].startTime == null) {
        this.ongoingTasks[taskIndex].startTime = this.ongoingTasks[taskIndex].createTime;
    }
    var d: number = (Date.now() - Date.parse(this.ongoingTasks[taskIndex].startTime.toString()))/(24*60*60*1000);
    this.ongoingTasks[taskIndex].history.set(parseInt(d.toString())+1, changed.value);
    this.ongoingTasks[taskIndex].pagesCurrent = changed.value;
    this.taskService.updateReadingTask(this.ongoingTasks[taskIndex]).subscribe(
        data => {
            console.log('Update reading task goes well. stay in current page.')
        },
        error => {
            console.log('something is wrong: '+ error.message);
            this.alertService.error(error.message);
        }
    );
    this.ongoingTaskForms[taskIndex].value.progress = 100*this.ongoingTasks[taskIndex].pagesCurrent/this.ongoingTasks[taskIndex].pagesIntotal;
    this.ongoingTaskForms[taskIndex].value.progressColor = this.progressTheme (this.ongoingTasks[taskIndex]);
    this.ongoingTaskForms[taskIndex].value.chartData.removeSerie(0);
    this.ongoingTaskForms[taskIndex].value.chartData.addSerie({
            name: 'Days',
            data: this.arrayConvert(this.ongoingTasks[taskIndex].history)
        });

    
  }
}
