import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatFormFieldModule, MatSelectModule, MatCheckboxModule } from '@angular/material';
import { AdminService } from '../../../service/admin.service';
import { User } from '../../../model/admin.model';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-useradd',
  templateUrl: './useradd.component.html',
  styleUrls: ['./useradd.component.css']
})

export class UseraddComponent implements OnInit {

  userForm: FormGroup;

  @ViewChild(SignaturePad) signaturePad: SignaturePad;

  private signaturePadOptions: Object = { 
    minWidth: 1,
    penColor: 'rgb(0, 0, 0)',
    canvasWidth: 300,
    canvasHeight: 75,
  };

  constructor(private adminService: AdminService, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder) {
    this.createForm();
  }

  createForm() {
    this.userForm = this.formBuilder.group({
      fname: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      lname: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(255)]),
      pword: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      //signature: new FormControl('')
    });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.userForm.controls[controlName].hasError(errorName);
  }

  // SOURCE: https://malcoded.com/posts/angular-fundamentals-reactive-forms
  addUser() {
    const base64 = this.signaturePad.toDataURL('image/png', 0.5);

    const result = this.userForm.value;

    // submit only if signature pad not empty
    if (!this.signaturePad.isEmpty()) {
      this.adminService.addUser(result.fname, result.lname, result.email, result.pword, base64).subscribe(() => {
        this.router.navigate(['admin/users']);
      });
    }
  }

  drawClear() {
    this.signaturePad.clear();
  }

  validForm() {
    if (this.userForm.valid && !this.signaturePad.isEmpty()) {
      return false;
    }

    return true;
  }

  ngOnInit() {}

}
