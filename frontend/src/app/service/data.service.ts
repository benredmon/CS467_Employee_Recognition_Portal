import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {

  private LogInUser = new BehaviorSubject('Default User');
  currentLogInUser = this.LogInUser.asObservable();

  public LogInUserID = new BehaviorSubject(0);
  currentLogInUserID = this.LogInUserID.asObservable();

  constructor() { }

  changeLogInUser(userFname: string) {
    this.LogInUser.next(userFname)
  }

  changeLogInUserID(userID: number) {
    this.LogInUserID.next(userID)
  }

  getID() {
    let id = this.LogInUserID;
    return id;
  }

}
