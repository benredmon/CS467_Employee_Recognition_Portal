import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private auth:LoginService, private router:Router) { }

  canActivate(): boolean {
        return this.checkLogin();
    }

  checkLogin(){
    if (this.auth.isLoggedIn){
      return true;
    }else{
      this.router.navigate(['/login']);
      console.log('Unauthorized Request.');
      return false;
    }
  }

}
