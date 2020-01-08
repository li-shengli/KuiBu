import { Component, OnInit } from '@angular/core';
import { TablestoreService } from '../_helpers';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { TaskInfo } from '../_models';

@Component({
  selector: 'app-data-sync',
  templateUrl: './data-sync.component.html',
  styleUrls: ['./data-sync.component.css']
})
export class DataSyncComponent implements OnInit {
   currentUser = JSON.parse(localStorage.getItem('currentUser'));
   userDetailsForm: FormGroup;

  constructor(
    private tablestoreService: TablestoreService,
    private formBuilder: FormBuilder,
    private router: Router) { }

  ngOnInit() {
    this.userDetailsForm = this.formBuilder.group ({
      id: [this.currentUser.id],
      nickName: [this.currentUser.nickName],
      username: [this.currentUser.username]
    });
  }

  exportData() {
    let content = localStorage.getItem('currentUserId') + '\n';
    content += localStorage.getItem('currentUser') + '\n';
    content += localStorage.getItem('tasks') + '\n';
    content += localStorage.getItem('users') + '\n';
    const tasks: TaskInfo[] = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach( task => {
      content += task.taskId + ': ' + localStorage.getItem(task.taskId) + '\n';
    });

    const blob = new Blob([content], {type: 'text/plain;charset=utf-8'});
    FileSaver.saveAs(blob, 'hello world.txt');
  }

}
