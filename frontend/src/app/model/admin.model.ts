export class Admin {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  master: string;
}

export class User {
  id: number;
  fname: string;
  lname: string;
  email: string;
  signature: string;
  timestamp: string;
}

export class Award {
  id: number;
  grantedBy: string;
  recipient: string;
  awardType: string;
  dateGiven: string;
}
