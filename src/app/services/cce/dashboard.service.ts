import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Status } from 'src/app/dashboard/components/models/dasboard';

@Injectable({
  providedIn: 'root'
})

export class DashboardService {
    

    requests: Status[] = [
        {requestId: '1', statusType: 'need', statusTypeId: 1, quantity: 1, itemType:'units', name: 'Meals', status: 'On its way!', statusId: 1, sourceName: 'Colorado Care Center', address: "2345 Weston st., Denver, CO 80211"}, 
        {requestId: '2', statusType: 'need', statusTypeId: 1, quantity: 5, itemType:'boxes', name: 'Diapers', status: 'New Match!', statusId: 2, sourceName: 'Health Providers', address: "2345 Weston st., Denver, CO 80211"}, 
        {requestId: '3', statusType: 'share', statusTypeId: 2, quantity: 12, itemType:'packages', name: 'Toilet Paper', status: 'Pick up Pending', statusId: 4, sourceName: 'Safeway Store', address: "2345 Weston st., Denver, CO 80211"}, 
        {requestId: '4', statusType: 'share', statusTypeId: 2, quantity: 2, itemType:'boxes', name: 'Toothpaste', status: 'Cancelled.', statusId: 3, sourceName: 'Denver Health Hospital', address: "2345 Weston st., Denver, CO 80211"}];
     
      
    constructor(private http: HttpClient) {
        
     }

    getRequests(): Observable<any> {        
        return new Observable((observer) => {
            console.log('getRequests')
            observer.next(this.requests)
          })
    }  

    updateRequests(statuses: Status[]): Observable<Status[]> {
        return new Observable((observer) => {
            console.log('updateRequests')
            observer.next(statuses)
          })
    }
}
