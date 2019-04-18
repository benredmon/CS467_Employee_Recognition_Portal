import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

import { UserService } from '../../../service/user.service';
import { DataService } from '../../../service/data.service';
import { User } from '../../../model/user.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  editForm: FormGroup;
  passwordForm: FormGroup;
  logInUserID:any;
  user: any = {};
  logInUser:any;

  constructor(private data: DataService, private userService: UserService, private fb: FormBuilder, private router: Router, private flashMessage: FlashMessagesService) {
    this.editForm = this.fb.group({
      fname: [''],
      lname: ['']
    }),
    this.passwordForm = this.fb.group({
      pword: ['', Validators.required],
      cpword: ['', Validators.required]
    }),
    this.data.currentLogInUserID
      .subscribe(logInUserID => this.logInUserID = logInUserID)
  }

  updatePword(pword, cpword) {
    if(pword != cpword) {
      this.flashMessage.show('Password does not match', { cssClass: 'alert-danger' })
    }
    else {
      this.userService.updatePword(this.logInUserID, pword)
      .subscribe(
          data => {
          },
          error => {
          },
          () => {
            this.flashMessage.show('New Password Saved', { cssClass: 'alert-success' })
            //this.router.navigate(['userdashboard']);
          });
    }
  }

  updateProfile(fname, lname) {
    //console.log(this.logInUserID, fname, lname);
    this.userService.updateUser(this.logInUserID, fname, lname)
    .subscribe(
        data => {
          this.logInUser = data,
          this.data.changeLogInUser(this.logInUser.fname)
        },
        error => {
        },
        () => {
          this.flashMessage.show('Changes Saved', { cssClass: 'alert-success' })
          //this.router.navigate(['userdashboard']);
        });
  }

  ngOnInit() {
    this.getUserById(this.logInUserID);
  }

  getUserById(userID) {
    this.userService.getUserById(userID)
      .subscribe((data: any) => {
        this.user = data;
      });
  }
}
