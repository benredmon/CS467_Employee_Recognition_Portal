import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTabsModule, MatTableModule, MatSort, MatTableDataSource } from '@angular/material';
import { LoginService } from '../../service/login.service';
import { DataService } from '../../service/data.service';

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css']
})
export class AdmindashboardComponent {
  navLinks: any[];
  activeLinkIndex = -1;

  constructor(private data: DataService, private user:LoginService, private router: Router) {
    this.navLinks = [
      { path: './users', label: 'User Accounts', index: 0 },
      { path: './admins', label: 'Admin Accounts', index: 1 },
      { path: './reporting', label: 'Reports', index: 2 }
    ];
  }

  logInUser:any;

  // SOURCE: https://nirajsonawane.github.io/2018/10/27/Angular-Material-Tabs-with-Router/
  ngOnInit(): void {
    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
    });
    this.data.currentLogInUser
      .subscribe(logInUser => this.logInUser = logInUser);
  }

  adminlogout(){
    this.user.adminlogout()
    .subscribe(
      data=>{this.router.navigate(['/'])},
      error=>console.error(error)
    )
  }

}
