import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { ForgotpasswordComponent } from './components/forgotpassword/forgotpassword.component';

import { AdmindashboardComponent } from './components/admindashboard/admindashboard.component';
import { UserlistComponent } from './components/admindashboard/userlist/userlist.component';
import { UseraddComponent } from './components/admindashboard/useradd/useradd.component';
import { UsereditComponent } from './components/admindashboard/useredit/useredit.component';
import { AdminlistComponent } from './components/admindashboard/adminlist/adminlist.component';
import { AdminaddComponent } from './components/admindashboard/adminadd/adminadd.component';
import { AdmineditComponent } from './components/admindashboard/adminedit/adminedit.component';
import { ReportingComponent } from './components/admindashboard/reporting/reporting.component';

import { UserdashboardComponent } from './components/userdashboard/userdashboard.component';
import { ListComponent } from './components/userdashboard/list/list.component';
import { CreateComponent } from './components/userdashboard/create/create.component';
import { EditComponent } from './components/userdashboard/edit/edit.component';

import { AuthGuardService } from './service/auth-guard.service';

const routes: Routes = [
  {
    path: 'admin',
    component: AdmindashboardComponent,
    children: [
      { path: 'users', component: UserlistComponent },
      { path: 'useradd', component: UseraddComponent },
      { path: 'useredit/:id', component: UsereditComponent },
      { path: 'admins', component: AdminlistComponent },
      { path: 'adminadd', component: AdminaddComponent },
      { path: 'adminedit/:id', component: AdmineditComponent },
      { path: 'reporting', component: ReportingComponent }
    ],
    canActivate: [AuthGuardService]
  },
  { path: 'userdashboard',
    component: UserdashboardComponent,
    children: [
      { path: '', component: ListComponent },
      { path: 'create', component: CreateComponent },
      { path: 'edit', component: EditComponent },
    ],
    canActivate: [AuthGuardService]
  },
  { path: 'login', component: LoginComponent},
  { path: 'forgotpassword', component: ForgotpasswordComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [
  LoginComponent, ForgotpasswordComponent,
  AdmindashboardComponent,
  UserlistComponent, UseraddComponent, UsereditComponent,
  AdminlistComponent, AdminaddComponent, AdmineditComponent,
  ReportingComponent,
  UserdashboardComponent,
  ListComponent,
  CreateComponent,
  EditComponent,
]
