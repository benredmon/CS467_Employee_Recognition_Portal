import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {NgForm} from '@angular/forms';
import { MatTabsModule, MatTableModule, MatSort, MatTableDataSource, MatFormFieldModule, MatInputModule, MatButtonModule } from '@angular/material';
import { AdminService } from '../../../service/admin.service';
import { Award } from '../../../model/admin.model';
import { Chart } from 'chart.js';
import * as moment from 'moment';

let now = moment().format('LLLL');

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.css']
})
export class ReportingComponent {

  dataSource = new MatTableDataSource<Award>();
  items: any;
  count: any;
  chartG = [];
  chartR = [];
  chartA = [];
  //chart = [];
  cnt = [];
  date = [];
  first: any;
  start: any;
  end: any;

  displayedColumns: string[] = ['id', 'grantedBy', 'recipient', 'awardType', 'dateGiven'];

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router: Router,
    private adminService: AdminService) { }

  ngOnInit() {
    this.listAwards();
    this.awardsCount();
    this.awardGivers();
    this.awardReceivers();
    this.currentWeek();
    this.currentMonth();
    this.chartGiver();
    this.chartReceiver();
    //this.monthlyAwards(this.start, this.end);
    this.monthlyInit();
  }

  ngAfterViewInit() {
  this.dataSource.sort = this.sort;
  this.dataSource.sortingDataAccessor = (item, property) => {
    switch (property) {
      //case 'dateGiven': return new Date(item.dateGiven);
      case 'dateGiven': return moment(item.dateGiven, "MM-DD-YYYY");
      default: return item[property];
    }
   };
  }

  listAwards() {
    this.adminService.getAwards().subscribe(data => {
        this.items = data;
        this.dataSource.data = this.items;
      });
  }

  awardsCount() {
    this.adminService.getCount().subscribe(data => {
      var newH = document.createElement("h1");
      newH.innerHTML = data[0].count;

      document.getElementById("totalCount").appendChild(newH);
    });
  }

  awardGivers() {
    this.adminService.topGivers().subscribe(data => {
      this.items = data
      //console.log(this.items.length);

      if (this.items.length < 10) {
        for (var i = 0; i < this.items.length; i++) {
          var string = data[i].grantedBy + " (" + data[i].giver + ")"
          var newPara = document.createElement("p");
          newPara.style.margin = "0";
          newPara.innerHTML = string;
          document.getElementById("listG").appendChild(newPara);
        }
      }
      else {
        for (var i = 0; i < 10; i++) {
          var string = data[i].grantedBy + " (" + data[i].giver + ")"
          var newPara = document.createElement("p");
          newPara.style.margin = "0";
          newPara.innerHTML = string;
          document.getElementById("listG").appendChild(newPara);
        }
      }
    });
  }

  awardReceivers() {
    this.adminService.topReceivers().subscribe(data => {
      this.items = data
      //console.log(this.items.length);

      if (this.items.length < 10) {
        for (var i = 0; i < this.items.length; i++) {
          var string = data[i].received + " (" + data[i].receiver + ")"
          var newPara = document.createElement("p");
          newPara.style.margin = "0";
          newPara.innerHTML = string;
          document.getElementById("listR").appendChild(newPara);
        }
      }
      else {
        for (var i = 0; i < 10; i++) {
          var string = data[i].received + " (" + data[i].receiver + ")"
          var newPara = document.createElement("p");
          newPara.style.margin = "0";
          newPara.innerHTML = string;
          document.getElementById("listR").appendChild(newPara);
        }
      }
    });
  }

  currentWeek() {
    this.adminService.employeeWeek().subscribe(data => {
      this.items = data;
      //console.log(this.items);

      if (this.items.length == 0) {
        var string = "None";
        var newPara = document.createElement("p");
        newPara.style.margin = "0";
        newPara.innerHTML = string;
        document.getElementById("eotw").appendChild(newPara);
      }
      else {
        for (var i = 0; i < this.items.length; i++) {
          var string = data[i].winner;
          var newPara = document.createElement("p");
          newPara.style.margin = "0";
          newPara.innerHTML = string;
          document.getElementById("eotw").appendChild(newPara);
        }
      }
    });
  }

  currentMonth() {
    this.adminService.employeeMonth().subscribe(data => {
      this.items = data;
      //console.log(this.items);

      if (this.items.length == 0) {
        var string = "None";
        var newPara = document.createElement("p");
        newPara.style.margin = "0";
        newPara.innerHTML = string;
        document.getElementById("eotm").appendChild(newPara);
      }
      else {
        for (var i = 0; i < this.items.length; i++) {
          var string = data[i].winner;
          var newPara = document.createElement("p");
          newPara.style.margin = "0";
          newPara.innerHTML = string;
          document.getElementById("eotm").appendChild(newPara);
        }
      }
    });
  }

  chartGiver() {
    this.adminService.giversChart().subscribe(data => {
      this.items = data;

      let people = [];
      let month = [];
      let week = [];
      for (var i = 0; i < this.items.length; i++) {
        people.push(this.items[i].giver);
        month.push(this.items[i].eotm);
        week.push(this.items[i].eotw);
      }

      var ctx = document.getElementById("giverChart");
      this.chartG = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: people,
          datasets: [
            {
              label: 'Employee of the Month',
              data: month,
              backgroundColor: 'rgba(240, 255, 255, 0.2)',
              borderColor: '#F0FFFF',
              borderWidth: 1,
              fill: true
            },
            {
              label: 'Employee of the Week',
              data: week,
              backgroundColor: 'rgba(127, 255, 212, 0.2)',
              borderColor: '#7FFFD4',
              borderWidth: 1,
              fill: true
            }
          ]
        },
        options: {
          legend: {
            labels: {
              fontColor: '#F0FFFF'
            },
            display: true
          },
          scales: {
            xAxes: [{
              stacked: true,
              display: false,
              ticks: {
                beginAtZero: false,
                fontColor: '#F0FFFF',
              },
              gridlines: {
                display: false
              }
            }],
            yAxes: [{
              stacked: true,
              ticks: {
                beginAtZero: true,
                fontColor: '#F0FFFF',
                callback: function(value) {if (value % 1 === 0) {return value;}}
              },
              gridlines: {
                display: false
              }
            }],
          }
        }
      })
    });
  }

  chartReceiver() {
    this.adminService.receiversChart().subscribe(data => {
      this.items = data;

      let people = [];
      let month = [];
      let week = [];
      for (var i = 0; i < this.items.length; i++) {
        people.push(this.items[i].receiver);
        month.push(this.items[i].eotm);
        week.push(this.items[i].eotw);
      }

      var ctx = document.getElementById("receiverChart");
      this.chartR = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: people,
          datasets: [
            {
              label: 'Employee of the Month',
              data: month,
              backgroundColor: 'rgba(240, 255, 255, 0.2)',
              borderColor: '#F0FFFF',
              borderWidth: 1,
              fill: true
            },
            {
              label: 'Employee of the Week',
              data: week,
              backgroundColor: 'rgba(127, 255, 212, 0.2)',
              borderColor: '#7FFFD4',
              borderWidth: 1,
              fill: true
            }
          ]
        },
        options: {
          legend: {
            labels: {
              fontColor: '#F0FFFF'
            },
            display: true
          },
          scales: {
            xAxes: [{
              stacked: true,
              display: false,
              ticks: {
                display: true,
                beginAtZero: false,
                fontColor: '#F0FFFF',
              },
              gridLines: {
                display: true,
                lineWidth: 5
              }
            }],
            yAxes: [{
              stacked: true,
              ticks: {
                display: true,
                beginAtZero: true,
                fontColor: '#F0FFFF',
                callback: function(value) {if (value % 1 === 0) {return value;}}
              },
              gridLines: {
                display: true,
              }
            }],
          }
        }
      })
    });
  }

  monthlyInit() {
    this.adminService.monthlyAwards().subscribe(data => {
      this.items = data;

      // this.first = moment(this.items[0].date).format('YYYY-MM-DD');
      if (this.items[0].month >= 10) {
        this.first = this.items[0].year + '-' + this.items[0].month + '-01'
      }
      else {
        this.first = this.items[0].year + '-0' + this.items[0].month + '-01'
      }

      this.start = this.first;
      this.end = moment().format('YYYY-MM-DD');

      for (var i = 0; i < this.items.length; i++) {
        this.cnt.push(this.items[i].count);
        // this.date.push(moment(this.items[i].date).format('YYYY-MM'));
        if (this.items[i].month >= 10) {
          this.date.push(this.items[i].year + '-' + this.items[i].month);
        }
        else {
          this.date.push(this.items[i].year + '-0' + this.items[i].month);
        }

      }

      this.monthlyAwards();
    });
  }

  monthlyAwards() {
    if (this.chartA.length != 0) {
      let elem = document.getElementById("monthlyChart");
      let parent = elem.parentNode;
      parent.removeChild(elem);

      let cnvs = document.createElement("canvas");
      cnvs.id = "monthlyChart";
      parent.appendChild(cnvs);
    }

    var ctx = document.getElementById("monthlyChart");
    this.chartA = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.date,
        datasets: [
          {
            label: 'Awards',
            data: this.cnt,
            borderColor: '#7FFFD4',
            backgroundColor: 'rgba(127, 255, 212, 0.2)',
            fill: true
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              min: this.start,
              max: this.end,
              unit: 'month'
            },
            ticks: {
              display: true,
              beginAtZero: false,
              fontColor: '#F0FFFF'
            }
          }],
          yAxes: [{
            ticks: {
              display: true,
              beginAtZero: true,
              fontColor: '#F0FFFF'
            }
          }]
        }
      }
    })
  }

  dateRange(f: NgForm) {
    var start,
        end;

    // processing selected/blank end date
    if (f.value.end == "" || f.value.end == null) {
      end = moment().format('YYYY-MM-DD');
    }
    else {
      end = moment(f.value.end).format('YYYY-MM-DD');
    }

    // processing selected/blank start date
    if (f.value.start == "" || f.value.start == null) {
      start = this.first;
    }
    else {
      start = moment(f.value.start).format('YYYY-MM-DD');
    }

    // set date parameters in chronological order
    if (start < end) {
      this.start = start;
      this.end = end;
    }
    else {
      this.start = end;
      this.end = start;
    }

    this.monthlyAwards();

  }

  resetGraph() {
    this.start = 0;
    this.end = moment();

    this.monthlyAwards();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
