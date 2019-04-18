import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabsModule, MatTableModule, MatSort, MatTableDataSource } from '@angular/material';

import * as moment from 'moment';

import { AwardService } from '../../../service/award.service';
import { DataService } from '../../../service/data.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})

export class ListComponent implements OnInit {

  displayedColumns: string[] = ['typeAwards', 'recipient', 'dateGiven', 'actions'];

  dataSource: any = new MatTableDataSource();
  logInUserID:any;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private data: DataService, private awardService: AwardService) {
    this.data.currentLogInUserID
      .subscribe(logInUserID => this.logInUserID = logInUserID)
  }

  ngOnInit() {
    this.fetchAwards(this.logInUserID);
  }

  ngAfterViewInit() {
  this.dataSource.sort = this.sort;
  this.dataSource.sortingDataAccessor = (item, property) => {
    console.log(item.dateGiven);
    switch (property) {
      //case 'dateGiven': return new Date(item.dateGiven);
      case 'dateGiven': return moment(item.dateGiven, "MM-DD-YYYY");
      default: return item[property];
    }
   };
  }

  fetchAwards(id) {
    this.awardService.getAwardsById(id)
      .subscribe((data: any) => {
        this.dataSource.data = data;
      });
  }

  deleteAward(award) {
    this.awardService.deleteAwardById(award.id)
      .subscribe(() => {
        this.fetchAwards(this.logInUserID);
      });
  }
}
