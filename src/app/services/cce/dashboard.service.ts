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
      {requestId: '1', statusType: 'need',    statusTypeId: 1, lat:'', long:'',  quantity: 1,  itemType:'food',     name: 'Meals',        status: 'Looking for Supplier', statusId: 0, dialogmessage: 'A supplier of your request has not yet been found.', sourceName: 'Colorado Care Center', address: "2345 Weston st., Denver, CO 80211"}, 
      {requestId: '2', statusType: 'need',    statusTypeId: 1, lat:'', long:'',  quantity: 5,  itemType:'boxes',    name: 'Diapers',      status: 'New Match!',           statusId: 1, dialogmessage: 'A supplier has been found. Awaiting their confirmation.', sourceName: 'Health Providers', address: "2345 Weston st., Denver, CO 80211"}, 
      {requestId: '3', statusType: 'need',    statusTypeId: 1, lat:'', long:'',  quantity: 12, itemType:'packages', name: 'Toilet Paper', status: 'Delivery Pending',     statusId: 2, dialogmessage: 'Supplier has confirmed your request and sent it out for delivery. Have you received this item?', sourceName: 'Safeway Store', address: "2345 Weston st., Denver, CO 80211"}, 
      {requestId: '4', statusType: 'need',    statusTypeId: 1, lat:'', long:'',  quantity: 2,  itemType:'food',     name: 'Apples',       status: 'Fulfilled!',           statusId: 3, dialogmessage: 'Your request has been delivered and is complete.', sourceName: 'Denver Health Hospital', address: "2345 Weston st., Denver, CO 80211"},
      {requestId: '5', statusType: 'need',    statusTypeId: 1, lat:'', long:'',  quantity: 2,  itemType:'boxes',    name: 'Toothpaste',   status: 'Cancelled',            statusId: 4, dialogmessage: 'Your request has been cancelled by *REQUESTOR OR SUPPLIER*.', sourceName: 'Denver Health Hospital', address: "2345 Weston st., Denver, CO 80211"},
    
      {requestId: '1', statusType: 'supply',  statusTypeId: 2, lat:'', long:'',  quantity: 1,  itemType:'food',     name: 'Meals',        status: 'No requestors yet',    statusId: 0, dialogmessage: 'No Requestors yet', sourceName: 'Colorado Care Center', address: "2345 Weston st., Denver, CO 80211"}, 
      {requestId: '2', statusType: 'supply',  statusTypeId: 2, lat:'', long:'',  quantity: 5,  itemType:'boxes',    name: 'Diapers',      status: 'New Match!',           statusId: 1, dialogmessage: 'A requestor at the following address needs these goods.  Are you still able to supply and deliver them?', sourceName: 'Health Providers', address: "2345 Weston st., Denver, CO 80211"}, 
      {requestId: '3', statusType: 'supply',  statusTypeId: 2, lat:'', long:'',  quantity: 12, itemType:'packages', name: 'Toilet Paper', status: 'Delivery Pending',     statusId: 2, dialogmessage: 'You have sent items out for delivery to this requestor at this address.', sourceName: 'Safeway Store', address: "2345 Weston st., Denver, CO 80211"}, 
      {requestId: '4', statusType: 'supply',  statusTypeId: 2, lat:'', long:'',  quantity: 2,  itemType:'food',     name: 'Apples',       status: 'Fulfilled!',           statusId: 3, dialogmessage: 'Requestor has confirmed delivery.  This order is completed.', sourceName: 'Denver Health Hospital', address: "2345 Weston st., Denver, CO 80211"},
      {requestId: '5', statusType: 'supply',  statusTypeId: 2, lat:'', long:'',  quantity: 2,  itemType:'boxes',    name: 'Toothpaste',   status: 'Cancelled',            statusId: 4, dialogmessage: 'This request has been cancelled by *REQUESTOR OR SUPPLIER*.', sourceName: 'Denver Health Hospital', address: "2345 Weston st., Denver, CO 80211"}];
    
  temp = [];
        
  constructor(private http: HttpClient) {        
    this.init();
  }
  
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
        case -1://Error
        {
          this.requests[x].styleclass = 'contentstatusred';
          break;
        }
        case 0://Proposed
        {
          this.requests[x].styleclass = 'contentstatusyellow';
          break;
        }
        case 1://New Match
        {
          this.requests[x].styleclass = 'contentstatusgreen';
          break;
        }
        case 2://Pending Delivery
        {
          this.requests[x].styleclass = 'contentstatusyellow';
          break;
        }
        case 3://Fulfilled
        {
          this.requests[x].styleclass = 'contentstatusgreen';
          break;
        }
        case 4://Cancelled
        {
          this.requests[x].styleclass = 'contentstatusred';
          break;
        }        
        default://there is no default, so error
          this.requests[x].styleclass = 'contentstatusred';
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
