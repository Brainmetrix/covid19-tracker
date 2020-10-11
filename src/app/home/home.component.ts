import { Component, OnInit } from '@angular/core';
import { CoronaService } from '../../services/corona.service';
import { ThrowStmt } from '@angular/compiler';
import {
  faClipboardCheck, faDownload, faChartLine, faUserShield, faSkullCrossbones,
  faMinusCircle, faPlusCircle, faChevronCircleDown, faChevronCircleUp
} from '@fortawesome/free-solid-svg-icons';
import { Chart } from 'chart.js';

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
  doughnut: any;
  chart;
  chart2 = [];
  pie: any;
  data1 = [];
  stateLabel: any = [];
  confirmedDataSet: any = [];
  recoveredDataSet: any = [];
  deceasedDataSet: any = [];
  color = Chart.helpers.color;
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
    // this.plorGraph();
  }

  plorGraph() {

    const defaultXAxis = {
      barThickness: 20,
      maxBarThickness: 20,
      minBarLength: 10,
      barValueSpacing: 130,

      scaleLabel: {
        display: true,
        labelString: 'Total No. of patients',
        stacked: false,
      },
      ticks: {
        beginAtZero: true,
        // stepSize: 5
        min: 10000
      }
    };

    this.chart = new Chart('bar', {
      type: 'horizontalBar',
      data: {
        labels: this.stateLabel,
        datasets: [
          {
            // type: 'horizontalBar',
            label: 'Confirmed',
            data: this.confirmedDataSet,
            backgroundColor: '#ff4d4f',
            borderColor: '#ff4d4f',
            fill: true,
            borderWidth: 5,
            // categoryPercentage: 1,
            barPercentage: 1,
            // barThickness: 10,
            // maxBarThickness: 8,
            // minBarLength: 5,

          },
          {
            label: 'Recoverd',
            data: this.recoveredDataSet,
            backgroundColor: '#28a745',
            borderColor: '#28a745',
            fill: true,
            // barThickness: 10,
            barPercentage: 1,

          },
          {
            label: 'Death',
            data: this.recoveredDataSet,
            backgroundColor: '#464d53',
            borderColor: '#464d53',
            fill: true,
            // barThickness: 10,
            barPercentage: 1,

          },
        ]
      },
      options: {
        barValueSpacing: 130,
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: false,
          text: 'Confirmed Cases'
        },
        legend: {
          display: true,
          position: 'top',
          align: 'center',
          boxWidth: 10,
          labels: {
            usePointStyle: true,
          },
        },
        elements: {
          rectangle: {
            borderWidth: 2,
          }
        },
        scales: {
          xAxes: [
            defaultXAxis
          ],
          yAxes: [{

            scaleLabel: {
              display: true,
              labelString: 'State',
            },
            ticks: {
              beginAtZero: true,
              // stepSize: 5
              // min: 5
            }
          }]
        }
      }
    });

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
      const INDIA = { name: 'India', value: 'India', Code: 'IN' };
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
      for (const state of this.totalStateWiseCases) {
        this.stateLabel.push(state && state.state && state.state.name);
        this.confirmedDataSet.push(state && state.total && state.total.confirmed);
        this.recoveredDataSet.push(state && state.total && state.total.recovered);
        this.deceasedDataSet.push(state && state.total && state.total.deceased);
      }
      this.cloneStateWiseCases = this.totalStateWiseCases;
      console.log('totalStateWiseCases', this.totalStateWiseCases);
      console.log('this.stateLabel', this.stateLabel);
      console.log('this.confirmedDataSet', this.confirmedDataSet);
      this.plorGraph();


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
