import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService, UserService } from '../_services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  userDetailsForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.userDetailsForm = this.formBuilder.group ({
      id: [this.currentUser.id],
      nickName: [this.currentUser.nickName],
      motto: [this.currentUser.motto]
    });


  }

  onSubmit() {
    console.log("Update user details: " + this.userDetailsForm.value.nickName);
    this.userService.update(this.userDetailsForm.value).subscribe(
      data => {
        console.log('user stored');
        this.router.navigate(['']);
      },
      error => {
        console.log('something is wrong: '+ error.message);
        this.alertService.error(error.message);
      });
  }
}
