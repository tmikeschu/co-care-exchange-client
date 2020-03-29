import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Status } from 'src/app/dashboard/components/models/dasboard';
import { environment } from 'src/environments/environment';
import { map, subscribeOn } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class DashboardService {
  agreements: Subject<any> = new BehaviorSubject<any[]>([]);
  messageCount: number = 0;
  hasNeeds: boolean= false;
  hasShares: boolean= false;

  requests: Status[] = [
      {requestId: '1', statusType: 'need', statusTypeId: 1, quantity: 1, itemType:'units', name: 'Meals', status: 'On its way!', statusId: 1, sourceName: 'Colorado Care Center', address: "2345 Weston st., Denver, CO 80211"}, 
      {requestId: '2', statusType: 'need', statusTypeId: 1, quantity: 5, itemType:'boxes', name: 'Diapers', status: 'New Match!', statusId: 2, sourceName: 'Health Providers', address: "2345 Weston st., Denver, CO 80211"}, 
      {requestId: '3', statusType: 'share', statusTypeId: 2, quantity: 12, itemType:'packages', name: 'Toilet Paper', status: 'Pick up Pending', statusId: 4, sourceName: 'Safeway Store', address: "2345 Weston st., Denver, CO 80211"}, 
      {requestId: '4', statusType: 'share', statusTypeId: 2, quantity: 2, itemType:'boxes', name: 'Toothpaste', status: 'Cancelled.', statusId: 3, sourceName: 'Denver Health Hospital', address: "2345 Weston st., Denver, CO 80211"}];
    
  temp = [
      {requestId: '1', statusType: 'need', statusTypeId: 1, quantity: 1, itemType:'units', name: 'APPLES', status: 'On its way!', statusId: 1, sourceName: 'Colorado Care Center', address: "2345 Weston st., Denver, CO 80211"}, 
      {requestId: '2', statusType: 'need', statusTypeId: 1, quantity: 5, itemType:'boxes', name: 'Diapers', status: 'New Match!', statusId: 2, sourceName: 'Health Providers', address: "2345 Weston st., Denver, CO 80211"}, 
      {requestId: '3', statusType: 'share', statusTypeId: 2, quantity: 12, itemType:'packages', name: 'Toilet Paper', status: 'Pick up Pending', statusId: 4, sourceName: 'Safeway Store', address: "2345 Weston st., Denver, CO 80211"}, 
      {requestId: '4', statusType: 'share', statusTypeId: 2, quantity: 2, itemType:'boxes', name: 'Toothpaste', status: 'Cancelled.', statusId: 3, sourceName: 'Denver Health Hospital', address: "2345 Weston st., Denver, CO 80211"}];
        
  constructor(private http: HttpClient) {        
    this.init();
  }

  // getRequests(): Observable<any> {        
  //   return new Observable((observer) => {        
  //       observer.next(this.requests)
  //     });
  // } 
  
  getRequests2() {   
    console.log('getRequests2');
    this.requests = this.requests.concat(this.temp);
    this.setlabelstyles();
    this.agreements.next(this.requests);
  } 

  init() {     
    console.log('init', this.requests);
    this.agreements.next(this.requests);
    this.setlabelstyles();
  } 

  testgraphQL():Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({'x-api-key': 'KmFXIagDOypuL6YtCMzuaOyhs9cFodW2n6MK1eS1'})
    };
    const query = {
      'query':'query View { dashboard {requested{name, statusText, agreementId}, shared{name, statusText, agreementId}}}',
      'variables': {}
    };
    return this.http.post<any>(`${environment.serverUrl}`, query, httpOptions);
  }

  setlabelstyles(){
    console.log('setlabelstyles')
    for(let x = 0; x < this.requests.length; x++){
      if(this.requests[x].statusTypeId == 1){
        this.hasNeeds = true;
      }

      if(this.requests[x].statusTypeId == 2){
        this.hasShares = true;
      }

      switch(this.requests[x].statusId){
        case 1:
        {
          this.requests[x].styleclass = 'contentstatusgreen';
          break;
        }
        case 2:
          {
            this.requests[x].styleclass = 'contentstatusgreen';
            break;
          }
        case 3:
          {
            this.requests[x].styleclass = 'contentstatusred';
            break;
          }
        case 4:
          {
            this.requests[x].styleclass = 'contentstatusyellow';
            break;
          }
        default:
            break;
      }
    } 

    this.messageCount = 0;
    for(let x = 0; x < this.requests.length; x++){
      if(this.requests[x].statusId == 2){
        this.messageCount++;
      }
    }
  }
}
