import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, TaskService } from '../_services';

@Component({
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css', '../../assets/css/bootstrap.min.css']
})
export class NewTaskComponent implements OnInit {
  newTaskForm: FormGroup;
  loading = false;
  submitted = false;

  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private taskService: TaskService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
     this.newTaskForm = this.formBuilder.group({
            taskType: ['0', Validators.required],
            taskName: ['Reading a book', Validators.required],
            expectDays: ['10', Validators.required],
            totalPages: ['500', Validators.required]
        });
  }

}
