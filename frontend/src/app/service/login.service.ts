import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http:HttpClient) {
  }

  isLoggedIn = false;

  uri = 'http://localhost:32323';
  //uri = 'http://flip3.engr.oregonstate.edu:32323';

  login(body:any){
    this.isLoggedIn = true;
    return this.http.post(`${this.uri}/api/login`,body,{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type','application/json')
    });
  }

  adminlogin(body:any){
    this.isLoggedIn = true;
    return this.http.post(`${this.uri}/api/adminlogin`,body,{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type','application/json')
    });
  }

  userdashboard(){
    return this.http.get(`${this.uri}/userdashboard`,{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type','application/json')
    });
  }

  /*forgotpassword(){
    return this.http.get(`${this.uri}/forgotpassword`,{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type','application/json')
    });
  }*/

  logout(){
    this.isLoggedIn = false;
    return this.http.post(`${this.uri}/api/logout`,{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type','application/json')
    });
  }

  adminlogout(){
    this.isLoggedIn = false;
    return this.http.post(`${this.uri}/api/adminlogout`,{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type','application/json')
    });
  }

  resetPW(email) {
    //console.log(email);

    const data = {
      "email": email,
    }

    return this.http.post(`${this.uri}/forgotpw`, data);
  }
}
