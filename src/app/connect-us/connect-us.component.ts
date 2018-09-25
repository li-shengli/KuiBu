import { Component, OnInit, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  templateUrl: './connect-us.component.html',
  styleUrls: ['./connect-us.component.css']
})
export class ConnectUsComponent implements OnInit {

  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

}
