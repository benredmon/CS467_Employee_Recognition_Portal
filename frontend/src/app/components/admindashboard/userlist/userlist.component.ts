import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTabsModule, MatTableModule, MatSort, MatTableDataSource, MatFormFieldModule, MatInputModule, MatButtonModule } from '@angular/material';
import { AdminService } from '../../../service/admin.service';
import { User } from '../../../model/admin.model';
import * as moment from 'moment';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent {

  dataSource = new MatTableDataSource<User>();
  items: any;

  displayedColumns: string[] = ['id', 'fname', 'lname', 'email', 'signature', 'timestamp', 'delete'];

  @ViewChild(MatSort) sort: MatSort;

  constructor(private router: Router, private adminService: AdminService) { }

  ngOnInit() {
    this.listUsers();
  }

  ngAfterViewInit() {
  this.dataSource.sort = this.sort;
  this.dataSource.sortingDataAccessor = (item, property) => {
    switch (property) {
      case 'timestamp': return new Date(item.timestamp);
      default: return item[property];
    }
   };
  }

  listUsers() {
    this.adminService.getUsers().subscribe(data => {
        this.items = data;
        //console.log(this.items);
        this.dataSource.data = this.items;

        for (let i = 0; i < this.dataSource.data.length; i++) {
          this.dataSource.data[i].timestamp = moment(this.dataSource.data[i].timestamp).format('LL');
        }

      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteUser(user: User): void {
    this.adminService.deleteUser(user.id).subscribe(data => {
      this.listUsers();
    });
  }

  editUser(user: User): void {
    this.adminService.getUser(user.id).subscribe(data => {
      this.router.navigate(['admin/useredit/' + user.id]);
    })
  }

  addUser(): void {
    this.router.navigate(['admin/useradd/']);
  }

  getSignature(user: User) {
    var element = document.getElementById(user.email);

    if (element.childNodes.length > 1) {
      return;
    }
    else if (user.signature.includes(".png")) {
      var image = document.createElement("img");
      image.setAttribute('src', user.signature);
      image.setAttribute('width', '100px');

      element.appendChild(image);
    }
    // append image to td
    else {
      var sig = user.signature;
      var image = document.createElement("img");
      image.setAttribute('src', sig);
      image.setAttribute('width', '100px');

      element.appendChild(image);
      // var sig = "data:image/png;base64," + user.signature;
      // var image = document.createElement("img");
      // image.setAttribute('src', sig);
      // image.setAttribute('width', '100px');
      //
      // element.appendChild(image);
    }

    // // display text signature if no image available
    // if (!user.signature.includes(".png")) {
    //   return user.signature;
    // }
    // // only append one child
    // else if (element.childNodes.length > 1) {
    //   return;
    // }
    // // append image to td
    // else {
    //   var image = document.createElement("img");
    //   image.setAttribute('src', user.signature);
    //   image.setAttribute('width', '100px');
    //
    //   element.appendChild(image);
    // }
  }

}
