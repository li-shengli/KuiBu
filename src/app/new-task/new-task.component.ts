import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, TaskService } from '../_services';

@Component({
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css']
})
export class NewTaskComponent implements OnInit {
  taskType = 'Reading';
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
            taskName: ['Reading a book', Validators.required],
            expectDays: ['10', Validators.required],
            totalPages: ['500', Validators.required]
        });
  }

  // convenience getter for easy access to form fields
  get f() { return this.newTaskForm.controls; }

  onSubmit() {
        this.submitted = true;
        console.debug ("New task was submitted, taskName = " + this.f.taskName);

        // stop here if form is invalid
        if (this.newTaskForm.invalid) {
            return;
        }

        this.loading = true;
        this.taskService.createTask()
            .subscribe(
                data => {
                    console.debug("task created.")
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
