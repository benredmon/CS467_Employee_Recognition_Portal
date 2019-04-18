import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { DatePipe } from '@angular/common';

import * as jsPDF from 'jspdf';


import { AwardService } from '../../../service/award.service';
import { UserService } from '../../../service/user.service';
import { DataService } from '../../../service/data.service';
import { Award } from '../../../model/award.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  createForm: FormGroup;

  logInUserID:any;
  users = [];
  logInUser: any = {};
  winner: Award;

  constructor(private datePipe: DatePipe, private data: DataService, private userService: UserService, private awardService: AwardService, private fb: FormBuilder, private router: Router, private flashMessage: FlashMessagesService) {
    this.createForm = this.fb.group({
      aid: ['', Validators.required],
      rid: ['', Validators.required],
      date: [new Date(), Validators.required],
      time: [this.datePipe.transform(new Date(), "HH:mm"), Validators.required]
    }),
    this.data.currentLogInUserID
      .subscribe(logInUserID => this.logInUserID = logInUserID)
  }

  addAward(rid, aid, date, time) {
    let formattedDate = this.datePipe.transform(date, "yyyy-MM-dd");
    this.awardService.addAward(rid, this.logInUserID, aid, formattedDate, time)
      .subscribe(
        (data: Award) => {
          //Handle result
          this.winner = data;
          this.createPDF(this.winner.recipient, this.winner.awardType, this.winner.grantedBy, this.winner.dateGiven, this.winner.signature, this.winner.email);
        },
        error => {
          //Handle error
          this.flashMessage.show('Error Creating A New Award!', { cssClass: 'alert-danger' });
        },
        () => {
            this.router.navigate(['userdashboard'])
        });
  }

  ngOnInit() {
    this.fetchUsers(this.logInUserID);
    this.getUserById(this.logInUserID);
  }

  fetchUsers(id) {
    this.userService.getCandidate(id)
      .subscribe((data: any) => {
        this.users = data;
      });
  }

  getUserById(userID) {
    this.userService.getUserById(userID)
      .subscribe((data: any) => {
        this.logInUser = data;
      });
  }

  get selectedUser(){
    let recipientId = this.createForm.controls.rid.value;
    let selected = this.users.find(user=> user.id == recipientId);
    return selected;
  }

  createPDF(recipient, awardType, giver, date, signature, email) {
    //https://stackoverflow.com/questions/35063330/how-to-align-text-in-center-using-jspdf
    var doc = new jsPDF('landscape');
    var template = new Image();
    template.src = 'assets/cert/template.jpg';
    var sign = new Image();
    sign.src = signature;

    var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

    doc.addImage(template, 'JPEG', 0, 0, 297, 210);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(48);
    doc.text(recipient, pageWidth / 2, 90, 'center');

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(48);
    doc.text(awardType, pageWidth / 2, 125, 'center');

    doc.setFontSize(25);
    doc.setTextColor(0, 0, 0);
    doc.text(date, 43, 175, 'center');

    doc.addImage(sign, 'PNG', pageWidth / 5 * 2, 145, 65, 30);

    doc.text(giver, 240, 175, 'center');

    //doc.save('certificate.pdf');
    var cert = doc.output('datauristring');
    this.sendCert(cert, email, recipient, awardType, giver);
  }

  sendCert(cert, email, recipient, awardType, giver) {
    this.awardService.sendCert(cert, email, recipient, awardType, giver)
      .subscribe(
        result => {},
        error => {},
        () => {}
      );
  }

}
