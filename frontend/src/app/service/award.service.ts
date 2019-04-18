import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AwardService {

  uri = 'http://localhost:32323';
  //uri = 'http://flip3.engr.oregonstate.edu:32323';

  constructor(private http: HttpClient) { }

  getAwards() {
    return this.http.get(`${this.uri}/listawards`);
  }

  getAwardsById(id) {
    return this.http.get(`${this.uri}/listawards/${id}`);
  }

  addAward(rid, gid, aid, date, time) {

    const award = {
      "rid": rid,
      "gid": gid,
      "aid": aid,
      "date": date,
      "time": time
    };

    return this.http.post(`${this.uri}/listawards/add`, award);
  }

  deleteAwardById(id) {
    return this.http.get(`${this.uri}/listawards/delete/${id}`);
  }

  sendCert(cert, email, recipient, awardType, giver) {

    const data = {
      "body": cert,
      "email": email,
      "recipient": recipient,
      "awardType": awardType,
      "giver": giver,
    }

    return this.http.post(`${this.uri}/cert`, data);
  }
}
