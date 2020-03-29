import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

const Organizations = gql`
  query Organizations {
    organizations {
      id,
      name
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  constructor(private apollo: Apollo) {}

  public getOrganizations(): Observable<object> {
    return this.apollo
        .query({
          query: Organizations,
        })
        .pipe(
            map((response: any) => {
              console.log('DEBUG ORG DATA ', response);
              const data = response.data;
              return data.organizations;
            })
        );
  }
}
