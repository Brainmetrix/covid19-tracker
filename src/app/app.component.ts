import { Component, OnInit } from '@angular/core';
import { CoronaService } from '../services/corona.service';
import { Subscription, BehaviorSubject, interval } from 'rxjs';
import * as M from 'materialize-css/dist/js/materialize';
// declare const M;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'covid19-tracker';
  BannerDataList: any;
  BannerData = 'Be a true Indian. Show compassion. Be considerate. Help those in need. We will get through this!';
  storebannerSubject: BehaviorSubject<any> = new BehaviorSubject('');
  count = 0;
  subscription: Subscription;

  executed = false;
  position: any;
  public onlineFlag;

  constructor(
    private covid: CoronaService) { }

  ngOnInit() {

    this.checkOnlineStatus();
    setInterval(() => {
      // check after every 8 sec Online or not
      this.checkOnlineStatus();
    }, 8000);

    this.covid.getBanners().subscribe(data => {
      this.BannerDataList = data.factoids.map(item => {
        return item.banner;
      });
      this.count = this.BannerDataList.length - 1;
      this.BannerData = this.BannerDataList[0];
      const source = interval(5000);
      let i = 0;
      this.subscription = source.subscribe((val: any) => {
        val = this.opensnack(this.BannerDataList[i]);
        this.storebannerSubject.next(val);
        i = i + 1;
        if (i <= this.count) {
          i = i + 1;
        } else {
          i = 0;
        }
      });
    });


  }

  opensnack(data) {
    this.storebannerSubject.subscribe(v => {
      this.BannerData = data;
    });
  }

  checkOnlineStatus() {
    // check online or not and show toaster
    this.onlineFlag = navigator.onLine;
    if (this.onlineFlag === false) {
      this.executed = true;
      const toastHTML = '<span>No internet connection available !</span>';
      M.toast({ html: toastHTML, classes: 'rounded delete' });
    } else if (this.onlineFlag === true && this.executed === true) {
      const toastHTML = '<span>Connection established !</span>';
      M.toast({ html: toastHTML, classes: 'rounded success' });
      this.executed = false;
    }
  }

}