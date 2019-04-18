import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Admin } from '../model/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  baseURI: string = 'http://localhost:32323';
  //baseURI: string = 'http://flip3.engr.oregonstate.edu:32323';

  getAdmins() {
    return this.http.get(this.baseURI + '/listadmins');
  }

  deleteAdmin(id: number) {
    return this.http.get(this.baseURI + '/deleteadmin/' + id);
  }

  getAdmin(id: number) {
    return this.http.get(this.baseURI + '/listadmin/' + id);
  }

  updateAdmin(id: number, first_name: string, last_name: string, email: string, master: number) {
    const admin = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      // pword: pword,
      master: master
    };
    return this.http.post(this.baseURI + '/updateadmin/' + id, admin);
  }

  addAdmin(first_name: string, last_name: string, email: string, pword: string, master: number) {
    const admin = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      pword: pword,
      master: master
    };
    return this.http.post(this.baseURI + '/addadmin', admin);
  }

  getUsers() {
    return this.http.get(this.baseURI + '/listusers');
  }

  deleteUser(id: number) {
    return this.http.get(this.baseURI + '/deleteuser/' + id);
  }

  getUser(id: number) {
    return this.http.get(this.baseURI + '/listuser/' + id);
  }

  updateUser(id: number, fname: string, lname: string, email: string, signature: string) {
    const user = {
      fname: fname,
      lname: lname,
      email: email,
      signature: signature
    };
    return this.http.post(this.baseURI + '/updateuser/' + id, user);
  }

  addUser(fname: string, lname: string, email: string, pword: string, signature: string) {
    const user = {
      fname: fname,
      lname: lname,
      email: email,
      pword: pword,
      signature: signature
    };
    return this.http.post(this.baseURI + '/adduser', user);
  }

  getAwards() {
    return this.http.get(this.baseURI + '/listawards');
  }

  getCount() {
    return this.http.get(this.baseURI + '/awardscount');
  }

  topGivers() {
    return this.http.get(this.baseURI + '/awardgivers');
  }

  topReceivers() {
    return this.http.get(this.baseURI + '/awardreceivers');
  }

  employeeWeek() {
    return this.http.get(this.baseURI + '/eotw');
  }

  employeeMonth() {
    return this.http.get(this.baseURI + '/eotm');
  }

  giversChart() {
    return this.http.get(this.baseURI + '/giverschart');
  }

  receiversChart() {
    return this.http.get(this.baseURI + '/receiverschart');
  }

  monthlyAwards() {
    return this.http.get(this.baseURI + '/monthlyawards');
  }

}
