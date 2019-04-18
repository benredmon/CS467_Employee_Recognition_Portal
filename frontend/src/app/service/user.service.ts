import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  uri: string = 'http://localhost:32323';
  //uri = 'http://flip3.engr.oregonstate.edu:32323';

  constructor(private http: HttpClient) { }

  getUserById(id) {
    return this.http.get(`${this.uri}/getuser/${id}`);
  }

  getCandidate(id) {
    return this.http.get(`${this.uri}/listcandidate/${id}`);
  }

  updateUser(id, fname, lname) {
    const user = {
      fname: fname,
      lname: lname,
    };

    return this.http.post(`${this.uri}/updatename/${id}`, user);
  }

  updatePword(id, pword) {
    const newPword = {
      pword: pword,
    };
    return this.http.post(`${this.uri}/updatepword/${id}`, newPword);
  }
}
