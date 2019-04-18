import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatFormFieldModule, MatSelectModule } from '@angular/material';
import { AdminService } from '../../../service/admin.service';

@Component({
  selector: 'app-adminedit',
  templateUrl: './adminedit.component.html',
  styleUrls: ['./adminedit.component.css']
})
export class AdmineditComponent {

  id: number;
  adminForm: FormGroup;

  constructor(private adminService: AdminService, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder) {
    this.createForm();
  }

  createForm() {
    this.adminForm = this.formBuilder.group({
      first_name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      last_name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(255)]),
      // pword: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      master: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params.id;
      //console.log(this.id);
      this.adminService.getAdmin(this.id).subscribe(res => {
        //console.log(res[0].master);
        this.adminForm.get('first_name').setValue(res[0].first_name);
        this.adminForm.get('last_name').setValue(res[0].last_name);
        this.adminForm.get('email').setValue(res[0].email);
        // this.adminForm.get('pword').setValue(res[0].pword);
        this.adminForm.get('master').setValue(res[0].master);
      });
    });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.adminForm.controls[controlName].hasError(errorName);
  }

  // SOURCE: https://malcoded.com/posts/angular-fundamentals-reactive-forms
  updateAdmin() {
    //const result: Admin = Object.assign({}, this.adminForm.value);
    const result = this.adminForm.value;
    this.adminService.updateAdmin(this.id, result.first_name, result.last_name, result.email, result.master).subscribe(() => {
      this.router.navigate(['admin/admins']);
    });
  }
}
