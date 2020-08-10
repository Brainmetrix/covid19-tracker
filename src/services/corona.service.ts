import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CoronaService {
  stateList = [
    { name: 'Andaman and Nicobar Islands', value: 'Andaman and Nicobar Islands', Code: 'AN' },
    { name: 'Andhra Pradesh', value: 'Andhra Pradesh', Code: 'AP' },
    { name: 'Arunachal Pradesh', value: 'Arunachal Pradesh', Code: 'AR' },
    { name: 'Assam', value: 'Assam', Code: 'AS' },
    { name: 'Bihar', value: 'Bihar', Code: 'BR' },
    { name: 'Chandigarh', value: 'Chandigarh', Code: 'CH' },
    { name: 'Chattisgarh', value: 'Chattisgarh', Code: 'CT' },
    { name: 'Dadra and Nagar Haveli and Daman and Diu', value: 'Dadra and Nagar Haveli and Daman and Diu', Code: 'DN' },
    { name: 'Delhi', value: 'Delhi', Code: 'DL' },
    { name: 'Goa', value: 'Goa', Code: 'GA' },
    { name: 'Gujarat', value: 'Gujarat', Code: 'GJ' },
    { name: 'Haryana', value: 'Haryana', Code: 'HR' },
    { name: 'Himachal Pradesh', value: 'Himachal Pradesh', Code: 'HP' },
    { name: 'Jammu and Kashmir', value: 'Jammu and Kashmir', Code: 'JK' },
    { name: 'Jharkhand', value: 'Jharkhand', Code: 'JH' },
    { name: 'Karnataka', value: 'Karnataka', Code: 'KA' },
    { name: 'Kerala', value: 'Kerala', Code: 'KL' },
    { name: 'Ladakh', value: 'Ladakh', Code: 'LA' },
    { name: 'Lakshadweep Islands', value: 'Lakshadweep Islands', Code: '' },
    { name: 'Madhya Pradesh', value: 'Madhya Pradesh', Code: 'MP' },
    { name: 'Maharashtra', value: 'Maharashtra', Code: 'MH' },
    { name: 'Manipur', value: 'Manipur', Code: 'MN' },
    { name: 'Meghalaya', value: 'Meghalaya', Code: 'ML' },
    { name: 'Mizoram', value: 'Mizoram', Code: 'MZ' },
    { name: 'Nagaland', value: 'Nagaland', Code: 'NL' },
    { name: 'Odisha', value: 'Odisha', Code: 'OR' },
    { name: 'Pondicherry', value: 'Pondicherry', Code: 'PY' },
    { name: 'Punjab', value: 'Punjab', Code: 'PB' },
    { name: 'Rajasthan', value: 'Rajasthan', Code: 'RJ' },
    { name: 'Sikkim', value: 'Sikkim', Code: 'SK' },
    { name: 'Tamil Nadu', value: 'Tamil Nadu', Code: 'TN' },
    { name: 'Telangana', value: 'Telangana', Code: 'TG' },
    { name: 'Tripura', value: 'Tripura', Code: 'TR' },
    { name: 'Uttar Pradesh', value: 'Uttar Pradesh', Code: 'UP' },
    { name: 'Uttarakhand', value: 'Uttarakhand', Code: 'UT' },
    { name: 'West Bengal', value: 'West Bengal', Code: 'WB' }
  ];

  data1;
  state;
  district;
  BannerData: BehaviorSubject<any> = new BehaviorSubject('');
  districtdata: Subject<any> = new Subject<any>();

  // url_statewise = 'https://api.rootnet.in/covid19-in/unofficial/covid19india.org/statewise';
  urlStatewise = 'https://api.covid19india.org/v4/min/data.min.json';
  // url_latest_stats = 'https://api.rootnet.in/covid19-in/stats/latest';
  urlDailycases = 'https://api.rootnet.in/covid19-in/unofficial/covid19india.org/statewise/history';
  ulrDistrictwise = 'https://api.covid19india.org/state_district_wise.json';
  urlBanner = 'https://api.covid19india.org/website_data.json';

  constructor(private http: HttpClient) {
    this.getDataStateWise();
  }

  getStateName(key) {
    return this.stateList.find(item => item.Code === key);
  }

  getBanners(): Observable<any> {
    return this.http.get(this.urlBanner);
  }

  getDataStateWise(): Observable<any> {
    return this.http.get(this.urlStatewise);
  }

  getDailyCaseStatus(): Observable<any> {
    return this.http.get(this.urlDailycases);
  }

  getState(state) {
    this.state = state;
  }

  getDataDistrictWise(state) {
    this.http.get(this.ulrDistrictwise).subscribe(data => {
      this.data1 = data;
      this.district = this.data1[state].districtData;
      this.districtdata.next(this.district);
    }
    );
  }

}
