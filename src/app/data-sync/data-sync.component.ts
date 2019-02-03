import { Component, OnInit } from '@angular/core';
import { TablestoreService } from '../_helpers';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
    this.tablestoreService.exportLocalDataToAliyun();
  }

}
