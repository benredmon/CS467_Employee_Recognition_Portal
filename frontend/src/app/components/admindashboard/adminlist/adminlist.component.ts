import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatTabsModule, MatTableModule, MatSort, MatTableDataSource, MatFormFieldModule, MatInputModule, MatButtonModule } from '@angular/material';
import { AdminService } from '../../../service/admin.service';
import { Admin } from '../../../model/admin.model';
import { DataService } from '../../../service/data.service';

@Component({
  selector: 'app-adminlist',
  templateUrl: './adminlist.component.html',
  styleUrls: ['./adminlist.component.css']
})
export class AdminlistComponent implements OnInit {

  dataSource = new MatTableDataSource<Admin>();
  items: any;
  currentUser: any;

  //admins : Admin[];
  displayedColumns: string[] = ['id', 'first_name', 'last_name', 'email', 'master', 'delete'];

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router: Router,
    private adminService: AdminService,
    private data: DataService) { }

  ngOnInit() {
    this.userID();
    this.listAdmins();
    this.dataSource.sort = this.sort;
  }

  listAdmins() {
    this.adminService.getAdmins().subscribe(data => {
        this.items = data;
        this.dataSource.data = this.items;

        for (let i = 0; i < this.dataSource.data.length; i++) {
          if (this.dataSource.data[i].master == "1") {
            this.dataSource.data[i].master = "Yes";
          }
          else {
            this.dataSource.data[i].master = "No";
          }
        }
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteAdmin(admin: Admin): void {
    if (admin.master != "Yes" && admin.id != this.currentUser) {
      this.adminService.deleteAdmin(admin.id).subscribe(data => {
          this.listAdmins();
        });
    }
  }

  editAdmin(admin: Admin): void {
    this.adminService.getAdmin(admin.id).subscribe(data => {
      this.router.navigate(['admin/adminedit/' + admin.id]);
    })
  }

  addAdmin(): void {
    this.router.navigate(['admin/adminadd/']);
  }

  userID() {
    this.data.getID().subscribe(data => {
      this.currentUser = data;
      //console.log(this.currentUser);
    });
  }

}
