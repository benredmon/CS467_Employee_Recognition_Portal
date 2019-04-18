import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../service/login.service';
//import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from '../../service/data.service';



@Component({
  selector: 'app-userdashboard',
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.css']
})

export class UserdashboardComponent implements OnInit {

  constructor(private data: DataService, private user:LoginService, private router:Router) {
  }

  logInUser:any;

  ngOnInit() {
    this.data.currentLogInUser
      .subscribe(logInUser => this.logInUser = logInUser)
  }

  logout(){
    this.user.logout()
    .subscribe(
      data=>{this.router.navigate(['/'])},
      error=>console.error(error)
    )
  }

  }
