import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FlashMessagesModule } from 'angular2-flash-messages';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule, MatNativeDateModule, MatTabsModule, MatTableModule, MatSortModule, MatButtonModule, MatCardModule, MatInputModule, MatFormFieldModule, MatToolbarModule, MatSelectModule, MatCheckboxModule, MatRadioModule, MatIconModule, MatDividerModule, MatMenuModule} from '@angular/material';
import { CommonModule, DatePipe } from '@angular/common';

import { AdminService } from './service/admin.service';
import { UserService } from './service/user.service';
import { AwardService } from './service/award.service';
import { LoginService } from './service/login.service';
import { DataService } from './service/data.service';
import { AuthGuardService } from './service/auth-guard.service';

import { SignaturePadModule } from 'angular2-signaturepad';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
  ],
  imports: [
    FlashMessagesModule.forRoot(),
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NoopAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatDividerModule,
    MatMenuModule,
    CommonModule,
    SignaturePadModule
  ],
  providers: [AdminService, UserService, AwardService, LoginService, DataService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
