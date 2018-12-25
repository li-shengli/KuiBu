import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService, UserService } from '../_services';
import { Router } from '@angular/router';

declare var navigator: any;
declare var Camera: any;

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

  captureSuccess (mediaFiles) {
      var i, path, len;
      for (i = 0, len = mediaFiles.length; i < len; i += 1) {
          path = mediaFiles[i].fullPath;
          // do something interesting with the file
      }
  };

  // capture error callback
  captureError (error) {
     navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
  };

  // start image capture
  takePic() {
    var srcType = Camera.PictureSourceType.CAMERA;
    navigator.camera.getPicture(this.captureSuccess, this.captureError, this.setOptions(srcType));
  }

  setOptions(srcType) {
    var options = {
        // Some common settings are 20, 50, and 100
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        // In this app, dynamically set the picture source, Camera or photo gallery
        sourceType: srcType,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: true,
        correctOrientation: true  //Corrects Android orientation quirks
    }
    return options;
}
  
}
