import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FlashMessagesService } from 'angular2-flash-messages';

import { LoginService } from '../../service/login.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {

  resetForm: FormGroup;

  constructor(private loginService: LoginService, private fb: FormBuilder, private flashMessage: FlashMessagesService) {
    this.resetForm = this.fb.group({
      email: ['', Validators.required]
    })
  }

  resetPW(email) {
    this.loginService.resetPW(email)
      .subscribe(
        result => {
          this.flashMessage.show('Please check your email!', { cssClass: 'alert-success' });
        },
        error => {
          this.flashMessage.show('User not found!', { cssClass: 'alert-danger' });
        },
        () => {

        }
      );
  }

  ngOnInit() {
  }

}
