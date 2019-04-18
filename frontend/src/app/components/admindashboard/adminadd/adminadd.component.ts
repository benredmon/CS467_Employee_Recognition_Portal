import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatFormFieldModule, MatSelectModule, MatCheckboxModule } from '@angular/material';
import { AdminService } from '../../../service/admin.service';
import { Admin } from '../../../model/admin.model';

@Component({
  selector: 'app-adminadd',
  templateUrl: './adminadd.component.html',
  styleUrls: ['./adminadd.component.css']
})
export class AdminaddComponent implements OnInit {

  adminForm: FormGroup;

  constructor(private adminService: AdminService, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder) {
    this.createForm();
  }

  createForm() {
    this.adminForm = this.formBuilder.group({
      first_name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      last_name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(255)]),
      pword: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      master: new FormControl('', [Validators.required])
    });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.adminForm.controls[controlName].hasError(errorName);
  }

  // SOURCE: https://malcoded.com/posts/angular-fundamentals-reactive-forms
  addAdmin() {
    //const result: Admin = Object.assign({}, this.adminForm.value);
    const result = this.adminForm.value;
    //console.log(result);
    this.adminService.addAdmin(result.first_name, result.last_name, result.email, result.pword, result.master).subscribe(() => {
      this.router.navigate(['admin/admins']);
    });
  }

  ngOnInit() {}

}
