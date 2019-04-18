import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatFormFieldModule, MatSelectModule } from '@angular/material';
import { AdminService } from '../../../service/admin.service';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-useredit',
  templateUrl: './useredit.component.html',
  styleUrls: ['./useredit.component.css']
})
export class UsereditComponent {

  id: number;
  userForm: FormGroup;

  @ViewChild(SignaturePad) signaturePad: SignaturePad;

  private signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
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
      //signature: new FormControl('', [Validators.required, Validators.maxLength(255)])
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params.id;
      //console.log(this.id);
      this.adminService.getUser(this.id).subscribe(res => {
        //console.log(res[0].signature);
        this.userForm.get('fname').setValue(res[0].fname);
        this.userForm.get('lname').setValue(res[0].lname);
        this.userForm.get('email').setValue(res[0].email);
        this.signaturePad.fromDataURL(res[0].signature, {width: 300, height: 75});
      });
    });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.userForm.controls[controlName].hasError(errorName);
  }

  // SOURCE: https://malcoded.com/posts/angular-fundamentals-reactive-forms
  updateUser() {
    const base64 = this.signaturePad.toDataURL('image/png', 0.5);

    //const result: Admin = Object.assign({}, this.userForm.value);
    const result = this.userForm.value;

    if (!this.signaturePad.isEmpty()) {
      this.adminService.updateUser(this.id, result.fname, result.lname, result.email, base64).subscribe(() => {
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

}
