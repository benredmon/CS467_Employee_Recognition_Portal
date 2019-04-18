// SOURCE: https://www.youtube.com/watch?v=IlpU1z3cvSQ&index=1&list=PLmGlSqRtRSPjL9MxaiaXQcfVxswKErJTq

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from '../../service/login.service';
import { DataService } from '../../service/data.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm : FormGroup=new FormGroup({
  email:new FormControl(null,[Validators.email,Validators.required]),
  pword:new FormControl(null, Validators.required)
  });
  constructor(private data: DataService, private router:Router, private user:LoginService, private flashMessage: FlashMessagesService) { }

  ngOnInit() {
  }

  logInUser:any;

  adminlogin(){
    if(!this.loginForm.valid){
      console.log('Invalid');
      return;
    }

    // console.log(JSON.stringify(this.loginForm.value));
    this.user.adminlogin(JSON.stringify(this.loginForm.value))
    .subscribe(
      data=>{
        this.logInUser = data,
        this.data.changeLogInUser(this.logInUser.first_name),
        this.data.changeLogInUserID(this.logInUser.id),
        this.router.navigate(['/admin/users']);
      },
      error=>{
        console.error(error),
        this.flashMessage.show('Invalid Admin Username / Password', { cssClass: 'alert-danger' });
      }
    )
  }

  login(){
    if(!this.loginForm.valid){
      console.log('Invalid');
      return;
    }

    // console.log(JSON.stringify(this.loginForm.value));
    this.user.login(JSON.stringify(this.loginForm.value))
    .subscribe(
      data=>{
        this.logInUser = data,
        this.data.changeLogInUser(this.logInUser.fname),
        this.data.changeLogInUserID(this.logInUser.id),
        this.router.navigate(['/userdashboard']);
      },
      error=>{
        console.error(error),
        this.flashMessage.show('Invalid Username / Password', { cssClass: 'alert-danger' });
      }
    )
  }
}
