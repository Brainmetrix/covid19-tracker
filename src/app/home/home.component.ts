import { Component, OnInit } from '@angular/core';
import { CoronaService } from '../../services/corona.service';
import { ThrowStmt } from '@angular/compiler';
import {
  faClipboardCheck, faDownload, faChartLine, faUserShield, faSkullCrossbones,
  faMinusCircle, faPlusCircle, faChevronCircleDown, faChevronCircleUp
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  faClipboardCheck = faClipboardCheck;
  faDownload = faDownload;
  faChartLine = faChartLine;
  faUserShield = faUserShield;
  faSkullCrossbones = faSkullCrossbones;
  faMinusCircle = faMinusCircle;
  faPlusCircle = faPlusCircle;
  faChevronCircleDown = faChevronCircleDown;
  faChevronCircleUp = faChevronCircleUp;
  totalConfirmed = 0;
  totalActive = 0;
  totalRecovered = 0;
  totalDeath = 0;

  showDistrict = false;
  sortedDataBasedOnDate;

  DailystateStatus: Array<any> = [{ state: '', confirmed: '', recovered: '', deaths: '', active: '' }];
  DailyStatus: any = { total: '' };
  statewisedata: Array<any> = [{ state: '', confirmed: '', recovered: '', deaths: '', active: '' }];
  statewisecase: any = { confirmed: '', active: '', recovered: '', deaths: '' };
  startdate = new Date();
  lastupdateddate = new Date();
  lastupdated: any = { hour: 0, minute: 0, second: 0 };
  SingleStateData;
  lastrefreshedtime: any;
  totalStateWiseCases: any = [];
  cloneStateWiseCases: any = [];
  statesCode: any;
  districtsCode: any;
  search: any;
  timer: any;
  constructor(private covid: CoronaService) { }

  ngOnInit() {
    this.getStateWise();
    const time = 15 * 60000; // 1 minutes  = 60000 milliseconds
    setInterval(() => {
      // call the api to get the fresh data after every 15 minutes
      this.getStateWise();
      this.testData();
    }, time);
    this.testData();
  }

  testData() {
    this.covid.getDailyCaseStatus().subscribe(
      response => {
        this.sortedDataBasedOnDate = response.data.history;
        this.sortByMaxCases(this.sortedDataBasedOnDate);
        this.calculateDiff(this.sortedDataBasedOnDate);
        this.statewisedata = this.sortedDataBasedOnDate[this.sortedDataBasedOnDate.length - 1].statewise;
        this.statewisecase = this.sortedDataBasedOnDate[this.sortedDataBasedOnDate.length - 1].total;
      },
      error => {
        console.log(error);
      }
    );
  }

  calculateDiff(data) {
    const x = data;
    const last: any = x[x.length - 1];
    const last2: any = x[x.length - 2];

    function calculate(schema1, schema2) {
      const ret = {};
      for (let key in schema1) {
        if (schema1.hasOwnProperty(key) && schema2.hasOwnProperty(key)) {
          let obj = schema1[key];
          let obj2 = schema2[key];
          if (typeof obj === 'number' && !isNaN(obj) && typeof obj2 === 'number' && !isNaN(obj2)) {
            ret[key] = obj - obj2;
          } else {
            if (typeof obj === 'object' && typeof obj2 === 'object') {
              ret[key] = calculate(obj, obj2);
            } else {
              ret[key] = obj;
            }
          }
        }
      }
      return ret;
    }
    const test = calculate(last, last2);
    this.DailyStatus = test;
    this.DailystateStatus = this.DailyStatus.statewise;
  }

  getDistrictKeys(value) {
    this.districtsCode = Object.keys(value && value.district);
  }

  getStateWise() {
    this.totalStateWiseCases = [];
    this.cloneStateWiseCases = [];
    this.covid.getDataStateWise().subscribe(data => {
      this.statesCode = Object.keys(data);
      const INDIA = {name: 'India', value: 'India', Code: 'IN'};
      for (const d of this.statesCode) {
        const prepareObj = {
          state: this.covid.getStateName(d) ? this.covid.getStateName(d) : INDIA,
          district: data && data[d].districts,
          meta: data && data[d].meta,
          total: data && data[d].total,
          delta: data && data[d].delta,
          show: false
        };
        this.totalStateWiseCases.push(prepareObj);
      }
      this.totalStateWiseCases.sort(this.sortDataBasedOnConfirmedCases);
      this.cloneStateWiseCases = this.totalStateWiseCases;
      console.log('totalStateWiseCases', this.totalStateWiseCases);

    },
      err => {
        console.log(err);
      });
  }

  sortDataBasedOnConfirmedCases(first, second) {
    if (first.state.name !== 'India') {
      return second.total.confirmed - first.total.confirmed;
    }
  }

  sortByMaxCases(sortedDataBasedOnDate) {
    sortedDataBasedOnDate.forEach(item => item.statewise.sort((a, b) => {
      if (b.confirmed < a.confirmed) {
        return -1;
      }
      if (b.confirmed > a.confirmed) {
        return 1;
      }
      return 0;
    }));
    this.calculateDiff(this.sortedDataBasedOnDate);

  }

  searchState(searchValue) {
    clearTimeout(this.timer);
    if (searchValue) {
      this.timer = setTimeout(() => {
        const searchedData = this.cloneStateWiseCases.filter(item =>
          item.state && item.state.name.toUpperCase().includes(searchValue.toUpperCase()));
        if (searchedData && searchedData.length > 0) {
          this.totalStateWiseCases = searchedData;
        } else {
          this.totalStateWiseCases = [];
          this.totalStateWiseCases = this.cloneStateWiseCases;
        }
      }, 500);
    } else {
      this.totalStateWiseCases = [];
      this.totalStateWiseCases = this.cloneStateWiseCases;
    }
  }
}
